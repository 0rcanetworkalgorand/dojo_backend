"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const contracts_1 = require("../algorand/contracts");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// List Agents
router.get('/', async (req, res) => {
    const { lane, sensei } = req.query;
    const where = {};
    if (lane)
        where.lane = lane.toUpperCase();
    if (sensei)
        where.senseiAddress = sensei;
    try {
        let agents = await prisma_1.prisma.agent.findMany({
            where,
        });
        const mapped = agents.map(a => {
            const successRate = 100; // Default until failure tracking is active
            const totalEarned = Number(a.totalEarnedUsdc) / 1_000_000;
            return {
                ...a,
                address: a.address,
                name: a.name || `Agent ${a.address.substring(0, 6)}`,
                taskCount: Number(a.tasksCompleted),
                successRate,
                totalEarned,
                commitmentExpiry: a.listingExpiry ? new Date(a.listingExpiry).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
            };
        });
        res.json(mapped);
    }
    catch (error) {
        console.error('[agentRoutes] Detailed fetch error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});
// Proxy Registration (Admin signs on behalf of user)
router.post('/register', async (req, res) => {
    const { agentId, senseiAddress, lane, llmTier, biddingStrategy, openaiApiKey } = req.body;
    // 0. Input Validation
    const validLanes = ['RESEARCH', 'CODE', 'DATA', 'OUTREACH'];
    const validTiers = ['Standard', 'Pro', 'Elite'];
    const validStrategies = ['Volume', 'Margin'];
    if (!validLanes.includes(lane)) {
        return res.status(400).json({ error: `lane must be one of: ${validLanes.join(', ')}` });
    }
    if (!validTiers.includes(llmTier)) {
        return res.status(400).json({ error: `llmTier must be one of: ${validTiers.join(', ')}` });
    }
    if (!validStrategies.includes(biddingStrategy)) {
        return res.status(400).json({ error: `biddingStrategy must be one of: ${validStrategies.join(', ')}` });
    }
    const isGroq = openaiApiKey && openaiApiKey.startsWith('gsk_');
    const isOpenAI = openaiApiKey && openaiApiKey.startsWith('sk-');
    if (!openaiApiKey || (!isGroq && !isOpenAI) || openaiApiKey.length < 30) {
        return res.status(400).json({ error: 'llmApiKey must be a valid OpenAI (sk-) or Groq (gsk_) key' });
    }
    try {
        console.log(`[ProxyRegister] Step 1: Preparing transaction (Version 5) for ${agentId}`);
        // 1. Encrypt Config for Vault
        const vaultKeyHex = process.env.VAULT_KEY;
        if (!vaultKeyHex || vaultKeyHex.length !== 64) {
            throw new Error('Backend VAULT_KEY is not configured correctly (must be 64 hex chars)');
        }
        const configToEncrypt = {
            lane,
            llmTier,
            biddingStrategy,
            openai_api_key: openaiApiKey,
            agent_address: agentId // agentId is used as the address/unique identifier
        };
        const vaultKey = Buffer.from(vaultKeyHex, 'hex');
        const salt = Buffer.from('0rca_swarm_dojo_salt');
        const derivedKey = crypto_1.default.pbkdf2Sync(vaultKey, salt, 100000, 32, 'sha256');
        const nonce = crypto_1.default.randomBytes(12);
        const cipher = crypto_1.default.createCipheriv('aes-256-gcm', derivedKey, nonce);
        const ciphertext = Buffer.concat([
            cipher.update(JSON.stringify(configToEncrypt), 'utf8'),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        // Format: base64(nonce + ciphertext + authTag)
        // Python's cryptography AESGCM.encrypt puts the tag at the end of the ciphertext
        const encryptedBlob = Buffer.concat([nonce, ciphertext, authTag]).toString('base64');
        const vaultDir = path_1.default.join(process.cwd(), '../dojo-agents/vault');
        if (!fs_1.default.existsSync(vaultDir)) {
            fs_1.default.mkdirSync(vaultDir, { recursive: true });
        }
        const vaultPath = path_1.default.join(vaultDir, `${agentId}.enc`);
        fs_1.default.writeFileSync(vaultPath, encryptedBlob);
        console.log(`[ProxyRegister] Step 2: Vault file written: ${vaultPath}`);
        // 2. Map lane string to required UInt64 for contract
        const laneInt = lane === 'RESEARCH' ? 0 : lane === 'OUTREACH' ? 1 : 2;
        const laneBigInt = BigInt(laneInt);
        // 3. Mock config hash for the contract (the actual config is in the vault)
        const configHash = crypto_1.default.createHash('sha256').update(encryptedBlob).digest();
        console.log(`[ProxyRegister] Step 2: lane=${laneBigInt}, sensei=${senseiAddress}`);
        // 3. Attempt on-chain registration
        let txId = 'already-on-chain';
        try {
            const suggestedParams = await contracts_1.registryClient.algorand.client.algod.getTransactionParams().do();
            const baseFee = BigInt(suggestedParams.fee || 1000);
            const result = await contracts_1.registryClient.newGroup().registerAgent({
                args: {
                    agentId,
                    sensei: senseiAddress,
                    lane: laneBigInt,
                    configHash: new Uint8Array(configHash)
                },
                boxReferences: [
                    new Uint8Array(Buffer.from(agentId))
                ],
                staticFee: (0, algokit_utils_1.microAlgos)(baseFee)
            }).send();
            txId = result.txIds[0];
            console.log(`[ProxyRegister] Step 3: On-chain txn successful. Tx: ${txId}`);
        }
        catch (chainErr) {
            const errMsg = chainErr?.message || '';
            // pc=178 is "Agent already registered" in the contract
            if (errMsg.includes('pc=178') || errMsg.includes('Agent already registered')) {
                console.log(`[ProxyRegister] Agent ${agentId} already exists on-chain — proceeding with DB sync.`);
            }
            else {
                // Re-throw if it's a different contract error
                throw chainErr;
            }
        }
        // 4. Create/Upsert in Database (always runs, even if agent was already on-chain)
        const agent = await prisma_1.prisma.agent.upsert({
            where: { id: agentId },
            update: {
                senseiAddress,
                lane: lane.toUpperCase(),
                configHash: configHash.toString('hex'),
                status: types_1.AgentStatus.ACTIVE
            },
            create: {
                id: agentId,
                address: agentId,
                senseiAddress,
                lane: lane.toUpperCase(),
                configHash: configHash.toString('hex'),
                status: types_1.AgentStatus.ACTIVE,
                tasksCompleted: BigInt(0),
                totalEarnedUsdc: BigInt(0)
            }
        });
        console.log(`[ProxyRegister] ✅ Agent ${agentId} registered in DB. Tx: ${txId}`);
        res.json({
            success: true,
            txId,
            agent
        });
    }
    catch (error) {
        console.error('[ProxyRegister] Failed:', error.message || error);
        res.status(500).json({
            error: 'Contract execution failed',
            details: error.message || 'Unknown error'
        });
    }
});
// Get user/agent stats
router.get('/stats/:address', async (req, res) => {
    const { address } = req.params;
    try {
        let agents = await prisma_1.prisma.agent.findMany({
            where: { senseiAddress: address }
        });
        const agentAddresses = agents.map(a => a.address);
        const tasks = await prisma_1.prisma.task.findMany({
            where: {
                OR: [
                    { clientAddress: address },
                    { workerAddress: { in: agentAddresses } }
                ]
            }
        });
        const stats = {
            totalAgents: agents.length,
            tasksToday: tasks.filter(t => t.createdAt > new Date(Date.now() - 86400000)).length,
            usdcVolume: agents.reduce((sum, a) => sum + Number(a.totalEarnedUsdc), 0),
        };
        res.json(stats);
    }
    catch (err) {
        console.error('[agentRoutes] Stats fetch error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});
// Record a license purchase
router.post('/licenses', async (req, res) => {
    const { agentAddress, licenseeAddress, txId, feeUsdc } = req.body;
    if (!agentAddress || !licenseeAddress) {
        return res.status(400).json({ error: 'Missing addresses' });
    }
    try {
        const agent = await prisma_1.prisma.agent.findUnique({
            where: { address: agentAddress }
        });
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        const license = await prisma_1.prisma.license.create({
            data: {
                agentId: agent.id,
                licenseeAddress,
                feeUsdc: BigInt(feeUsdc || 50000000), // Default 50 USDC if not provided
                isActive: true
            }
        });
        console.log(`[Licenses] Agent ${agentAddress} licensed by ${licenseeAddress}. Tx: ${txId}`);
        res.json({ success: true, licenseId: license.id });
    }
    catch (error) {
        console.error('Failed to record license:', error);
        res.status(500).json({ error: 'Failed' });
    }
});
exports.default = router;
