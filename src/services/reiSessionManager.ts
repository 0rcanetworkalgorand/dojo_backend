import { prisma } from '../lib/prisma';
import { TaskState, LaneType } from '../lib/types';
import { broadcast } from '../lib/socket';
import { escrowClient, commitmentClient, adminAddress } from '../algorand/contracts';
import { microAlgos } from '@algorandfoundation/algokit-utils';
import OpenAI from 'openai';
import { SelectedAgent } from './rei';
import crypto from 'crypto';

function encryptHybrid(plainText: string, publicKeyBase64: string): string | null {
    try {
        // 1. Generate random AES-256-GCM key
        const aesKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        
        // 2. Encrypt data with AES
        const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
        const encryptedData = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        
        // 3. Encrypt AES key with RSA public key
        const publicKey = crypto.createPublicKey({
            key: Buffer.from(publicKeyBase64, 'base64'),
            type: 'spki',
            format: 'der'
        });
        
        const encryptedAesKey = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            aesKey
        );
        
        // 4. Combine: IV (16) + AuthTag (16) + EncryptedAESKey + EncryptedData
        // Format: base64(IV + AuthTag + EncryptedAESKey + EncryptedData)
        const combined = Buffer.concat([iv, authTag, encryptedAesKey, encryptedData]);
        return combined.toString('base64');
        
    } catch (error) {
        console.error('[Rei Encryption] Failed:', error.message);
        return null;
    }
}

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

function getAiClient(): OpenAI {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set');
    return new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
}

export interface CompletedOutput {
    lane: string;
    output: string;
    agentAddress: string;
    senseiAddress: string;
    taskId: string;
    status: 'APPROVED' | 'REJECTED';
}

export interface ReiSession {
    sessionId: string;
    clientAddress: string;
    clientPublicKey?: string;
    originalDescription: string;
    selectedAgents: SessionAgent[];
    currentAgentIndex: number;
    completedOutputs: CompletedOutput[];
    status: 'STAKING' | 'EXECUTING' | 'COMPLETE' | 'ABANDONED';
    stakeTxIds: string[];
}

export interface SessionAgent extends SelectedAgent {
    taskId: string;
    status: 'PENDING' | 'STAKED' | 'EXECUTING' | 'COMPLETED' | 'SKIPPED';
}

const sessions = new Map<string, ReiSession>();

function generateTaskId(): string {
    return `T-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

async function executeAgentTask(agent: SessionAgent, sessionId: string) {
    const taskId = agent.taskId;

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { state: TaskState.LOCKED }
        });

        broadcast('TASK_STATUS', { taskId, state: TaskState.LOCKED, timestamp: new Date() });

        const systemPrompt = LANE_PROMPTS[agent.lane] || LANE_PROMPTS.RESEARCH;
        const userPrompt = agent.subTask || '';

        console.log(`[Rei] AI executing lane: ${agent.lane} for task ${taskId}...`);
        const client = getAiClient();
        const params = DEFAULT_LLM_PARAMS.Standard;

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
        console.log(`[Rei] AI output received (${result.length} chars)`);

        // Get task to check for clientPublicKey
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        
        // Encrypt result with client's public key (hybrid encryption)
        let encryptedResult: string | null = null;
        if (task?.clientPublicKey) {
            const encrypted = encryptHybrid(result, task.clientPublicKey);
            if (encrypted) {
                encryptedResult = encrypted;
                console.log(`[Rei] Output encrypted successfully (hybrid), length: ${encryptedResult.length}`);
            } else {
                console.log(`[Rei] Encryption failed - will send plain result`);
            }
        } else {
            console.log(`[Rei] No clientPublicKey - using plain result`);
        }

        await prisma.task.update({
            where: { id: taskId },
            data: { 
                state: TaskState.SUBMITTED, 
                result: null,  // Don't store plain text
                encryptedResult 
            }
        });

        broadcast('TASK_STATUS', { taskId, state: TaskState.SUBMITTED, timestamp: new Date() });
        broadcast('REI_AGENT_RESULT', {
            sessionId,
            taskId,
            lane: agent.lane,
            encryptedResult: encryptedResult || result,  // Send encrypted or plain
            agentAddress: agent.agentAddress,
            senseiAddress: agent.senseiAddress,
            subTask: agent.subTask,
            timestamp: new Date()
        });

        console.log(`[Rei] ✅ Agent ${agent.lane} done — awaiting client approval`);
    } catch (err) {
        console.error(`[Rei] Agent ${agent.lane} task ${taskId} failed:`, err);
        await prisma.task.update({
            where: { id: taskId },
            data: { state: TaskState.SLASHED, result: 'Execution failed' }
        });
        broadcast('TASK_STATUS', { taskId, state: TaskState.SLASHED, timestamp: new Date() });
    }
}

async function releasePaymentForTask(taskId: string, senseiAddress: string) {
    const treasuryAddress = process.env.TREASURY_ADDRESS || adminAddress;

    try {
        const releaseResult = await escrowClient.send.releasePayment({
            args: { taskId, treasury: treasuryAddress },
            boxReferences: [
                { appId: BigInt(process.env.ESCROW_VAULT_APP_ID || '0'), name: new Uint8Array(Buffer.from(taskId)) }
            ],
            accountReferences: [treasuryAddress, senseiAddress].filter(Boolean) as string[],
            extraFee: microAlgos(2000),
        });
        console.log(`[Rei] Payment released → sensei: ${senseiAddress} (task: ${taskId}). TxId: ${releaseResult.transaction.txID()}`);

        await prisma.task.update({
            where: { id: taskId },
            data: { state: TaskState.SETTLED, settledAt: new Date() }
        });

        broadcast('TASK_SETTLED', { taskId, state: TaskState.SETTLED, settledAt: new Date() });
    } catch (err) {
        console.error(`[Rei] Payment release failed for task ${taskId}:`, err);
        throw err;
    }
}

async function slashBountyAndStake(taskId: string, clientAddress: string, agentAddress: string, senseiAddress: string) {
    const treasuryAddr = process.env.TREASURY_ADDRESS || adminAddress;

    try {
        await escrowClient.send.slashBounty({
            args: { taskId },
            boxReferences: [
                { appId: BigInt(process.env.ESCROW_VAULT_APP_ID || '0'), name: new Uint8Array(Buffer.from(taskId)) }
            ],
            accountReferences: [clientAddress].filter(Boolean) as string[],
            extraFee: microAlgos(1000),
        });
        console.log(`[Rei] Bounty refunded to client (task: ${taskId})`);
        broadcast('BOUNTY_REFUNDED', { taskId, clientAddress, timestamp: new Date() });
    } catch (err) {
        console.error(`[Rei] Bounty slash failed for task ${taskId}:`, err);
    }

    try {
        await commitmentClient.send.slashStake({
            args: { stakeId: agentAddress },
            boxReferences: [
                { appId: BigInt(process.env.COMMITMENT_LOCK_APP_ID || '0'), name: new Uint8Array(Buffer.from(agentAddress)) }
            ],
            accountReferences: [treasuryAddr],
            extraFee: microAlgos(1000),
        });
        console.log(`[Rei] Agent stake slashed (agent: ${agentAddress})`);
        broadcast('COLLATERAL_SLASHED', {
            taskId,
            agentId: agentAddress,
            senseiAddress,
            treasuryAddress: treasuryAddr,
            slashPercentage: 10,
            timestamp: new Date()
        });
    } catch (err) {
        console.error(`[Rei] Stake slash failed for agent ${agentAddress}:`, err);
    }

    await prisma.task.update({
        where: { id: taskId },
        data: { state: TaskState.SLASHED }
    });
}

async function startNextAgent(session: ReiSession) {
    const nextIndex = session.currentAgentIndex;

    if (nextIndex >= session.selectedAgents.length) {
        session.status = 'COMPLETE';
        const approved = session.completedOutputs.filter(o => o.status === 'APPROVED').length;
        const rejected = session.completedOutputs.filter(o => o.status === 'REJECTED').length;
        console.log('[Rei] ═════════════════════════════════════');
        console.log('[Rei] Session COMPLETE');
        console.log(`[Rei]    ${approved} approved, ${rejected} rejected`);
        console.log('[Rei] ═════════════════════════════════════');
        broadcast('REI_SESSION_COMPLETE', { sessionId: session.sessionId, timestamp: new Date() });
        return null;
    }

    const nextAgent = session.selectedAgents[nextIndex];

    console.log(`[Rei] → Starting agent ${nextIndex + 1}: ${nextAgent.lane}`);
    console.log(`       taskId: ${nextAgent.taskId}`);

    nextAgent.status = 'EXECUTING';
    session.status = 'EXECUTING';

    executeAgentTask(nextAgent, session.sessionId).catch(err => {
        console.error(`[Rei] Execution error:`, err);
    });

    broadcast('REI_AGENT_STARTED', {
        sessionId: session.sessionId,
        agentIndex: nextIndex,
        agent: nextAgent,
        timestamp: new Date()
    });

    return nextAgent;
}

async function createTasksInDb(sessionAgents: SessionAgent[], clientAddress: string, description: string, clientPublicKey?: string) {
    for (const agent of sessionAgents) {
        await prisma.task.create({
            data: {
                id: agent.taskId,
                title: `Rei Session: ${agent.lane}`,
                description: agent.subTask || description,
                lane: agent.lane as LaneType,
                bountyUsdc: BigInt(0),
                clientAddress,
                clientPublicKey: clientPublicKey || null,
                agentId: null,
                workerAddress: agent.agentAddress,
                state: TaskState.CREATED,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        });
        console.log(`[Rei] DB task created: ${agent.taskId} (${agent.lane})`);
    }
}

// ── API Functions ──────────────────────────────────────────────────────

export function initSession(
    clientAddress: string,
    description: string,
    selectedAgents: SelectedAgent[],
    stakeTxIds: string[],
    clientPublicKey?: string
): { sessionId: string; agents: SessionAgent[] } {
    const sessionId = crypto.randomUUID();

    const sessionAgents: SessionAgent[] = selectedAgents.map((agent, i) => ({
        ...agent,
        taskId: agent.taskId && agent.taskId.length > 5 ? agent.taskId : generateTaskId(),
        status: 'PENDING' as const
    }));

    const session: ReiSession = {
        sessionId,
        clientAddress,
        clientPublicKey,
        originalDescription: description,
        selectedAgents: sessionAgents,
        currentAgentIndex: 0,
        completedOutputs: [],
        status: 'STAKING',
        stakeTxIds
    };

    sessions.set(sessionId, session);

    console.log('═══════════════════════════════════════');
    console.log(`[Rei] Session initialized: ${sessionId}`);
    console.log(`[Rei] Client: ${clientAddress}`);
    console.log(`[Rei] Task: ${description.substring(0, 80)}...`);
    console.log(`[Rei] ${sessionAgents.length} agent(s) staked`);
    for (let i = 0; i < sessionAgents.length; i++) {
        const a = sessionAgents[i];
        console.log(`[Rei]   ${i + 1}. ${a.lane} → ${a.agentAddress.substring(0, 10)}... (sensei: ${a.senseiAddress.substring(0, 10)}...)`);
    }
    console.log('═══════════════════════════════════════');

    return { sessionId, agents: sessionAgents };
}

export async function executeSession(sessionId: string): Promise<SessionAgent> {
    const session = sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    await createTasksInDb(session.selectedAgents, session.clientAddress, session.originalDescription, session.clientPublicKey);

    const agent = await startNextAgent(session);
    if (!agent) throw new Error('No agents to execute');

    return agent;
}

export async function approveAndAdvance(sessionId: string): Promise<{
    nextAgent: SessionAgent | null;
    sessionComplete: boolean;
    taskResult: string;
    taskId: string;
}> {
    const session = sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const currentAgent = session.selectedAgents[session.currentAgentIndex];
    currentAgent.status = 'COMPLETED';

    const task = await prisma.task.findUnique({ where: { id: currentAgent.taskId } });

    try {
        await releasePaymentForTask(currentAgent.taskId, currentAgent.senseiAddress);
    } catch (err) {
        console.error(`[Rei] On-chain release failed:`, err);
    }

    session.completedOutputs.push({
        lane: currentAgent.lane,
        output: task?.result || '',
        agentAddress: currentAgent.agentAddress,
        senseiAddress: currentAgent.senseiAddress,
        taskId: currentAgent.taskId,
        status: 'APPROVED'
    });

    console.log(`[Rei] ✅ Agent ${session.currentAgentIndex + 1} (${currentAgent.lane}) — APPROVED`);
    console.log(`[Rei]    → Payment sent to sensei: ${currentAgent.senseiAddress.substring(0, 10)}...`);

    session.currentAgentIndex++;
    const nextAgent = await startNextAgent(session);

    return {
        nextAgent,
        sessionComplete: session.status === 'COMPLETE',
        taskResult: task?.result || '',
        taskId: currentAgent.taskId
    };
}

export async function rejectAndAdvance(sessionId: string): Promise<{
    nextAgent: SessionAgent | null;
    sessionComplete: boolean;
    taskResult: string;
    taskId: string;
}> {
    const session = sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const currentAgent = session.selectedAgents[session.currentAgentIndex];
    currentAgent.status = 'SKIPPED';

    const task = await prisma.task.findUnique({ where: { id: currentAgent.taskId } });

    await slashBountyAndStake(
        currentAgent.taskId,
        session.clientAddress,
        currentAgent.agentAddress,
        currentAgent.senseiAddress
    );

    session.completedOutputs.push({
        lane: currentAgent.lane,
        output: task?.result || '',
        agentAddress: currentAgent.agentAddress,
        senseiAddress: currentAgent.senseiAddress,
        taskId: currentAgent.taskId,
        status: 'REJECTED'
    });

    console.log(`[Rei] ❌ Agent ${session.currentAgentIndex + 1} (${currentAgent.lane}) — REJECTED`);
    console.log(`[Rei]    → Bounty refunded + 10% stake slashed`);

    session.currentAgentIndex++;
    const nextAgent = await startNextAgent(session);

    return {
        nextAgent,
        sessionComplete: session.status === 'COMPLETE',
        taskResult: task?.result || '',
        taskId: currentAgent.taskId
    };
}

export function getSessionStatus(sessionId: string): ReiSession | null {
    return sessions.get(sessionId) || null;
}