"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskExecutor = void 0;
const openai_1 = __importDefault(require("openai"));
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const socket_1 = require("../lib/socket");
const configVault_1 = require("./configVault");
const contracts_1 = require("../algorand/contracts");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
function encryptHybrid(plainText, publicKeyBase64) {
    try {
        // 1. Generate random AES-256-GCM key
        const aesKey = crypto_1.default.randomBytes(32);
        const iv = crypto_1.default.randomBytes(16);
        // 2. Encrypt data with AES
        const cipher = crypto_1.default.createCipheriv('aes-256-gcm', aesKey, iv);
        const encryptedData = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        // 3. Encrypt AES key with RSA public key
        const publicKey = crypto_1.default.createPublicKey({
            key: Buffer.from(publicKeyBase64, 'base64'),
            type: 'spki',
            format: 'der'
        });
        const encryptedAesKey = crypto_1.default.publicEncrypt({
            key: publicKey,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        }, aesKey);
        // 4. Combine: IV (16) + AuthTag (16) + EncryptedAESKey + EncryptedData
        const combined = Buffer.concat([iv, authTag, encryptedAesKey, encryptedData]);
        return combined.toString('base64');
    }
    catch (error) {
        console.error('[Encryption] Failed to encrypt output:', error);
        return null;
        return plainText;
    }
}
const LANE_PROMPTS = {
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
class TaskExecutor {
    /**
     * Get a specialized OpenAI client for a specific agent.
     */
    static async getClientForAgent(agentId) {
        // 1. Try to load from Vault
        const vaultPath = path_1.default.resolve(process.cwd(), '../dojo-agents/vault', `${agentId}.enc`);
        let apiKey;
        let tier = "Standard";
        if (fs_1.default.existsSync(vaultPath)) {
            try {
                const sealed = fs_1.default.readFileSync(vaultPath, 'utf8');
                const config = JSON.parse(configVault_1.ConfigVault.decrypt(sealed));
                apiKey = config.openai_api_key;
                tier = config.llmTier || "Standard";
                console.log(`[TaskExecutor] Decrypted vault for ${agentId}. Using Sensei key.`);
            }
            catch (err) {
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
        let baseURL = undefined;
        let llmParams = DEFAULT_LLM_PARAMS[tier] || DEFAULT_LLM_PARAMS.Standard;
        if (apiKey.startsWith('gsk_')) {
            baseURL = "https://api.groq.com/openai/v1";
            console.log(`[TaskExecutor] Groq provider detected. Re-routing to Groq Cloud...`);
            // Substitute with Groq-compatible models if using Llama/Mixtral
            if (llmParams.model.includes('gpt')) {
                llmParams.model = tier === 'Elite' ? 'llama-3.1-70b-versatile' : 'llama-3.1-8b-instant';
            }
        }
        else if (apiKey.startsWith('sk-') && apiKey.length < 60) {
            // DeepSeek check (optional, usually shares baseURL but can be specified)
            console.log(`[TaskExecutor] OpenAI compatible provider detected.`);
        }
        const client = new openai_1.default({ apiKey, baseURL });
        return { client, params: llmParams };
    }
    /**
     * Execute a task asynchronously: call AI provider, save result, settle payment.
     */
    static async executeTask(taskId) {
        console.log(`[TaskExecutor] Starting execution for task ${taskId}`);
        let task = null;
        try {
            // 1. Fetch the task from DB
            task = await prisma_1.prisma.task.findUnique({
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
            await prisma_1.prisma.task.update({
                where: { id: taskId },
                data: { state: types_1.TaskState.LOCKED }
            });
            (0, socket_1.broadcast)('TASK_STATUS', { taskId, state: types_1.TaskState.LOCKED, timestamp: new Date() });
            console.log(`[TaskExecutor] Task ${taskId} state → LOCKED`);
            // 3. Get AI Client and parameters
            const { client, params } = await this.getClientForAgent(task.agentId);
            // [DEMO OVERRIDE] Force fail agent data-9
            if (task.agentId === 'agent data-9') {
                throw new Error("DEMO_FAILURE: Internal Cognitive Mismatch triggered for 'agent data-9'");
            }
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
            // 5. Encrypt result with client's public key before storing
            let encryptedResult = null;
            console.log(`[TaskExecutor] Client public key:`, task.clientPublicKey ? 'EXISTS' : 'MISSING');
            if (task.clientPublicKey) {
                const encrypted = encryptHybrid(result, task.clientPublicKey);
                if (encrypted) {
                    encryptedResult = encrypted;
                    console.log(`[TaskExecutor] Output encrypted (hybrid), length:`, encryptedResult.length);
                }
                else {
                    console.error('[TaskExecutor] Encryption failed');
                }
            }
            else {
                console.warn(`[TaskExecutor] No clientPublicKey found - using plain result`);
            }
            // 5. Update state to SUBMITTED with the encrypted result
            await prisma_1.prisma.task.update({
                where: { id: taskId },
                data: {
                    state: types_1.TaskState.SUBMITTED,
                    result: null,
                    encryptedResult
                }
            });
            (0, socket_1.broadcast)('TASK_STATUS', { taskId, state: types_1.TaskState.SUBMITTED, timestamp: new Date() });
            // 6. WAIT for client approval - do NOT auto-release payment
            // Payment will be released when user clicks "Satisfied" via /api/tasks/:id/release
            // Or slashed when user clicks "Not Satisfied" via /api/tasks/:id/slash
            console.log(`[TaskExecutor] ✅ Task ${taskId} output ready. Waiting for client approval...`);
            console.log(`[TaskExecutor]    State: SUBMITTED. Payment will be released on approval.`);
            // 7. Broadcast the result - client must approve to release payment
            (0, socket_1.broadcast)('TASK_RESULT', {
                taskId,
                state: types_1.TaskState.SUBMITTED,
                encryptedResult,
                lane: task.lane,
                agentId: task.agentId,
                agentName: task.agent?.id || 'Unknown',
                senseiAddress,
                bountyUsdc: task.bountyUsdc.toString(),
                timestamp: new Date()
            });
            console.log(`[TaskExecutor] ✅ Task ${taskId} output generated and broadcasted. Awaiting approval.`);
        }
        catch (error) {
            console.error(`[TaskExecutor] ❌ Failed for task ${taskId}:`, error.message || error);
            // ═══════════════════════════════════════════════════════════════
            // ON-CHAIN SLASH: Refund user's bounty + take 10% from developer
            // ═══════════════════════════════════════════════════════════════
            if (task) {
                // 1. Slash the EscrowVault — return 100% of user's bounty to their wallet
                console.log(`[TaskExecutor] Initiating on-chain slash for task ${taskId}...`);
                try {
                    const slashResult = await contracts_1.escrowClient.send.slashBounty({
                        args: { taskId },
                        boxReferences: [
                            { appId: BigInt(process.env.ESCROW_VAULT_APP_ID || '0'), name: new Uint8Array(Buffer.from(taskId)) }
                        ],
                        accountReferences: [task.clientAddress].filter(Boolean),
                        extraFee: (0, algokit_utils_1.microAlgos)(1000),
                    });
                    console.log(`[TaskExecutor] ✅ EscrowVault slash successful — user bounty refunded. TxId: ${slashResult.transaction.txID()}`);
                    // Notify frontend about the bounty refund
                    (0, socket_1.broadcast)('BOUNTY_REFUNDED', {
                        taskId,
                        clientAddress: task.clientAddress,
                        bountyAmount: task.bountyUsdc.toString(),
                        txId: slashResult.transaction.txID(),
                        timestamp: new Date()
                    });
                }
                catch (slashErr) {
                    console.error(`[TaskExecutor] WARNING: EscrowVault slash failed for ${taskId}:`, slashErr.message || slashErr);
                }
                // 2. Slash the CommitmentLock — take 10% from developer's stake to treasury
                if (task.agentId) {
                    try {
                        const treasuryAddr = process.env.TREASURY_ADDRESS || contracts_1.adminAddress;
                        const commitSlashResult = await contracts_1.commitmentClient.send.slashStake({
                            args: { stakeId: task.agentId },
                            boxReferences: [
                                { appId: BigInt(process.env.COMMITMENT_LOCK_APP_ID || '0'), name: new Uint8Array(Buffer.from(task.agentId)) }
                            ],
                            accountReferences: [treasuryAddr],
                            extraFee: (0, algokit_utils_1.microAlgos)(1000),
                        });
                        console.log(`[TaskExecutor] ✅ CommitmentLock slash successful — 10% of developer stake sent to treasury. TxId: ${commitSlashResult.transaction.txID()}`);
                        // Notify frontend about the collateral slash
                        (0, socket_1.broadcast)('COLLATERAL_SLASHED', {
                            taskId,
                            agentId: task.agentId,
                            senseiAddress: task.agent?.senseiAddress,
                            treasuryAddress: treasuryAddr,
                            slashPercentage: 10,
                            txId: commitSlashResult.transaction.txID(),
                            timestamp: new Date()
                        });
                    }
                    catch (commitSlashErr) {
                        console.error(`[TaskExecutor] WARNING: CommitmentLock slash failed for agent ${task.agentId}:`, commitSlashErr.message || commitSlashErr);
                    }
                }
            }
            // [GLOBAL FAILURE TRACKING] Increment failed tasks for the agent
            if (task && task.agentId) {
                console.log(`[TaskExecutor] Logging failure for Agent: ${task.agentId}`);
                try {
                    // [DEMO OVERRIDE] for agent data-9: increment both to match user's demo logic
                    if (task.agentId === 'agent data-9') {
                        await prisma_1.prisma.agent.update({
                            where: { id: task.agentId },
                            data: {
                                tasksCompleted: { increment: 1 },
                                tasksFailed: { increment: 1 }
                            }
                        });
                    }
                    else {
                        // Regular agents just get a failure increment
                        await prisma_1.prisma.agent.update({
                            where: { id: task.agentId },
                            data: { tasksFailed: { increment: 1 } }
                        });
                    }
                }
                catch (dbErr) {
                    console.error('[TaskExecutor] Failed to update agent failure stats:', dbErr);
                }
            }
            try {
                // Encrypt error message if client public key exists
                const errorMessage = `Task Failed: ${error.message || 'Unknown Error'}`;
                let encryptedError = null;
                if (task?.clientPublicKey) {
                    encryptedError = encryptHybrid(errorMessage, task.clientPublicKey);
                }
                await prisma_1.prisma.task.update({
                    where: { id: taskId },
                    data: {
                        state: types_1.TaskState.SLASHED,
                        result: null,
                        encryptedResult: encryptedError
                    }
                });
                (0, socket_1.broadcast)('TASK_STATUS', {
                    taskId,
                    state: types_1.TaskState.SLASHED,
                    error: error.message,
                    timestamp: new Date()
                });
            }
            catch (dbErr) {
                console.error(`[TaskExecutor] Failed to update task state:`, dbErr);
            }
        }
    }
}
exports.TaskExecutor = TaskExecutor;
