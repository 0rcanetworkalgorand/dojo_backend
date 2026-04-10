import OpenAI from 'openai';
import { prisma } from '../lib/prisma';
import { TaskState } from '../lib/types';
import { broadcast } from '../lib/socket';

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

export class TaskExecutor {
    private static openai: OpenAI | null = null;

    private static getClient(): OpenAI {
        if (!this.openai) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error('OPENAI_API_KEY is not set in .env');
            }
            this.openai = new OpenAI({ apiKey });
        }
        return this.openai;
    }

    /**
     * Execute a task asynchronously: call OpenAI, save result, settle payment.
     * This runs in the background — the API returns immediately after task creation.
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

            // 2. Update state to LOCKED
            await prisma.task.update({
                where: { id: taskId },
                data: { state: TaskState.LOCKED }
            });
            broadcast('TASK_STATUS', { taskId, state: TaskState.LOCKED, timestamp: new Date() });
            console.log(`[TaskExecutor] Task ${taskId} state → LOCKED`);

            // 3. Determine the system prompt based on lane
            const systemPrompt = LANE_PROMPTS[task.lane] || LANE_PROMPTS.RESEARCH;
            const userPrompt = task.description || task.title || 'No description provided';

            // 4. Call OpenAI
            console.log(`[TaskExecutor] Calling OpenAI (gpt-4o-mini) for lane: ${task.lane}...`);
            const client = this.getClient();

            const completion = await client.chat.completions.create({
                model: 'gpt-4o-mini',
                max_tokens: 2000,
                temperature: 0.7,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            });

            const result = completion.choices[0]?.message?.content || 'No output generated.';
            console.log(`[TaskExecutor] OpenAI response received (${result.length} chars)`);

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
            
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    state: TaskState.SETTLED,
                    settledAt: new Date()
                }
            });

            // Credit the agent's earnings
            if (task.agentId) {
                await prisma.agent.update({
                    where: { id: task.agentId },
                    data: {
                        tasksCompleted: { increment: 1 },
                        totalEarnedUsdc: { increment: task.bountyUsdc }
                    }
                });
            }

            // 7. Broadcast the final result to all connected clients
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

            console.log(`[TaskExecutor] ✅ Task ${taskId} SETTLED. Agent ${task.agentId} credited.`);

        } catch (error: any) {
            console.error(`[TaskExecutor] ❌ Failed for task ${taskId}:`, error.message || error);

            // Mark task as failed but keep it in DB
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
