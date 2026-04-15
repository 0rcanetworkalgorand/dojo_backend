import OpenAI from 'openai';
import { prisma } from '../lib/prisma';
import { TaskState } from '../lib/types';
import { broadcast } from '../lib/socket';
import { ConfigVault } from './configVault';
import { escrowClient, adminAddress, algorand } from '../algorand/contracts';
import fs from 'fs';
import path from 'path';

const LANE_PROMPTS: Record<string, string> = {
    RESEARCH: `You are an elite research analyst for the 0rca Swarm Dojo — a decentralized AI agent marketplace on Algorand. 
Your job is to produce comprehensive, data-driven research reports. 
Include: Executive Summary, Key Findings (with bullet points), Detailed Analysis, Data Sources, and Actionable Recommendations.
Format your output in clean Markdown. Be thorough, specific, and cite real data where possible.`,

    CODE: `You are an expert software engineer for the 0rca Swarm Dojo — a decentralized AI agent marketplace on Algorand.
Your job is to write clean, production-ready code with detailed comments.
Include: Solution approach, complete working code, explanation of key design decisions, and testing suggestions.
Format code blocks with proper language tags. Use best practices for the language requested.`,

    DATA: `You are a senior data scientist for the 0rca Swarm Dojo — a decentralized AI agent marketplace on Algorand.
Your job is to analyze, clean, transform, and provide insights from data.
Include: Data Overview, Methodology, Statistical Analysis, Key Insights, Visualizations (described as ASCII/text charts where helpful), and Recommendations.
Format your output in clean Markdown with tables where appropriate.`,

    OUTREACH: `You are a strategic communications expert for the 0rca Swarm Dojo — a decentralized AI agent marketplace on Algorand.
Your job is to craft compelling content, messaging strategies, and outreach campaigns.
Include: Strategy Overview, Target Audience Analysis, Content Drafts, Channel Recommendations, and KPI Targets.
Format your output in clean Markdown. Be creative but professional.`,
};

const DEFAULT_LLM_PARAMS = {
    Standard: { model: 'llama-3.1-8b-instant', max_tokens: 2000, temperature: 0.7 },
    Pro: { model: 'llama-3.3-70b-specdec', max_tokens: 4000, temperature: 0.5 },
    Elite: { model: 'llama-3.3-70b-specdec', max_tokens: 8000, temperature: 0.3 }
};

export class TaskExecutor {
    /**
     * Get a specialized OpenAI client for a specific agent.
     */
    private static async getClientForAgent(agentId: string): Promise<{ client: OpenAI, params: any }> {
        // 1. Try to load from Vault
        const vaultPath = path.resolve(process.cwd(), '../dojo-agents/vault', `${agentId}.enc`);
        
        let apiKey: string | undefined;
        let tier: keyof typeof DEFAULT_LLM_PARAMS = "Standard";

        if (fs.existsSync(vaultPath)) {
            try {
                const sealed = fs.readFileSync(vaultPath, 'utf8');
                const config = JSON.parse(ConfigVault.decrypt(sealed));
                apiKey = config.openai_api_key;
                tier = (config.llmTier as any) || "Standard";
                console.log(`[TaskExecutor] Decrypted vault for ${agentId}. Using Sensei key.`);
            } catch (err) {
                console.error(`[TaskExecutor] Failed to decrypt vault for ${agentId}:`, err);
            }
        }

        // 2. Fallback to platform key only if no agent key exists
        if (!apiKey) {
            apiKey = process.env.GROQ_API_KEY;
            if (!apiKey) {
                throw new Error(`Authentication Failed: No API key found in vault for agent ${agentId} and no global GROQ_API_KEY in .env`);
            }
            console.warn(`[TaskExecutor] No specific key for agent ${agentId}. Falling back to platform key (Groq).`);
        }

        // 3. Provider Switching Logic
        let baseURL: string | undefined = undefined;
        let llmParams = DEFAULT_LLM_PARAMS[tier] || DEFAULT_LLM_PARAMS.Standard;

        if (apiKey.startsWith('gsk_')) {
            baseURL = "https://api.groq.com/openai/v1";
            console.log(`[TaskExecutor] Groq provider detected. Re-routing to Groq Cloud...`);
            // Substitute with Groq-compatible models if using Llama/Mixtral
            if (llmParams.model.includes('gpt')) {
                llmParams.model = tier === 'Elite' ? 'llama-3.1-70b-versatile' : 'llama-3.1-8b-instant';
            }
        } else if (apiKey.startsWith('sk-') && apiKey.length < 60) {
            // DeepSeek check (optional, usually shares baseURL but can be specified)
            console.log(`[TaskExecutor] OpenAI compatible provider detected.`);
        }

        const client = new OpenAI({ apiKey, baseURL });
        return { client, params: llmParams };
    }

    /**
     * Execute a task asynchronously: call AI provider, save result, settle payment.
     */
    static async executeTask(taskId: string) {
        console.log(`[TaskExecutor] Starting execution for task ${taskId}`);

        try {
            // 1. Fetch the task from DB
            const task = await prisma.task.findUnique({
                where: { id: taskId },
                include: { agent: true }
            });

            if (!task) {
                console.error(`[TaskExecutor] Task ${taskId} not found`);
                return;
            }

            if (!task.agentId) {
                console.error(`[TaskExecutor] Task ${taskId} has no agent assigned.`);
                return;
            }

            // 2. Update state to LOCKED
            await prisma.task.update({
                where: { id: taskId },
                data: { state: TaskState.LOCKED }
            });
            broadcast('TASK_STATUS', { taskId, state: TaskState.LOCKED, timestamp: new Date() });
            console.log(`[TaskExecutor] Task ${taskId} state → LOCKED`);

            // 3. Get AI Client and parameters
            const { client, params } = await this.getClientForAgent(task.agentId);

            const systemPrompt = LANE_PROMPTS[task.lane] || LANE_PROMPTS.RESEARCH;
            const userPrompt = task.description || task.title || 'No description provided';

            // 4. Call AI Provider
            console.log(`[TaskExecutor] Calling ${client.baseURL || 'OpenAI'} (${params.model}) for lane: ${task.lane}...`);

            const completion = await client.chat.completions.create({
                model: params.model,
                max_tokens: params.max_tokens,
                temperature: params.temperature,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            });

            const result = completion.choices[0]?.message?.content || 'No output generated.';
            console.log(`[TaskExecutor] AI response received (${result.length} chars)`);

            // 5. Update state to SUBMITTED with the result
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    state: TaskState.SUBMITTED,
                    result
                }
            });
            broadcast('TASK_STATUS', { taskId, state: TaskState.SUBMITTED, timestamp: new Date() });

            // 6. Auto-settle: mark as SETTLED and credit the Sensei
            const senseiAddress = task.agent?.senseiAddress;
            
            console.log(`[TaskExecutor] Initiating on-chain settlement for ${taskId}...`);
            try {
                // Call regular EscrowVault contract to release payment
                // Using adminAddress as treasury for the 2% fee
                const releaseResult = await escrowClient.send.releasePayment({
                    args: {
                        taskId,
                        treasury: adminAddress
                    },
                    boxReferences: [
                        { appId: BigInt(process.env.ESCROW_VAULT_APP_ID || '0'), name: new Uint8Array(Buffer.from(taskId)) }
                    ]
                });
                console.log(`[TaskExecutor] On-chain settlement successful for ${taskId}. TxId: ${releaseResult.transaction.txID()}`);
            } catch (onChainErr: any) {
                console.error(`[TaskExecutor] WARNING: On-chain settlement failed for ${taskId}:`, onChainErr.message || onChainErr);
                // We still update DB so the UI shows progress, but we log the failure
            }

            await prisma.task.update({
                where: { id: taskId },
                data: {
                    state: TaskState.SETTLED,
                    settledAt: new Date()
                }
            });

            // 7. INSTANT Real-time Stats Update
            if (task.agentId) {
                await prisma.agent.update({
                    where: { id: task.agentId },
                    data: {
                        tasksCompleted: { increment: 1 },
                        totalEarnedUsdc: { increment: task.bountyUsdc }
                    }
                });
                console.log(`[TaskExecutor] ✅ Instant stats updated for Agent: ${task.agentId} (+${task.bountyUsdc} microAlgos)`);
            }

            // 8. Broadcast the settlement event for real-time UI refresh
            broadcast('TASK_SETTLED', { 
                ...task, 
                state: TaskState.SETTLED, 
                settledAt: new Date() 
            });

            // 9. Broadcast the final result to all connected clients
            broadcast('TASK_RESULT', {
                taskId,
                state: TaskState.SETTLED,
                result,
                lane: task.lane,
                agentId: task.agentId,
                agentName: task.agent?.id || 'Unknown',
                senseiAddress,
                bountyUsdc: task.bountyUsdc.toString(),
                settledAt: new Date(),
                timestamp: new Date()
            });

            console.log(`[TaskExecutor] ✅ Task ${taskId} finalized and broadcasted.`);

        } catch (error: any) {
            console.error(`[TaskExecutor] ❌ Failed for task ${taskId}:`, error.message || error);

            try {
                await prisma.task.update({
                    where: { id: taskId },
                    data: {
                        state: TaskState.SLASHED,
                        result: `Error: ${error.message || 'Unknown error during execution'}`
                    }
                });
                broadcast('TASK_STATUS', {
                    taskId,
                    state: TaskState.SLASHED,
                    error: error.message,
                    timestamp: new Date()
                });
            } catch (dbErr) {
                console.error(`[TaskExecutor] Failed to update task state:`, dbErr);
            }
        }
    }
}
