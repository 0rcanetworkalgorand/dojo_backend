"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const contracts_1 = require("../algorand/contracts");
const algosdk_1 = __importDefault(require("algosdk"));
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
        where.senseiAddress = sensei.toUpperCase();
    try {
        let agents = await prisma_1.prisma.agent.findMany({
            where,
        });
        const mapped = agents.map(a => {
            // Success rate starts at 100% and drops by 20% for each failed task
            const successRate = Math.max(0, 100 - (Number(a.tasksFailed) * 20));
            const totalEarned = Number(a.totalEarnedUsdc);
            // Generate a clean display name from the agent ID (e.g. "data-y42bsr" → "Agent Data-Y42BSR")
            const lanePrefix = a.id.split('-')[0] || 'agent';
            const idSuffix = a.id.split('-').slice(1).join('-') || a.id;
            const displayName = `Agent ${lanePrefix.charAt(0).toUpperCase() + lanePrefix.slice(1)}-${idSuffix.toUpperCase()}`;
            return {
                id: a.id,
                address: a.address,
                senseiAddress: a.senseiAddress,
                lane: a.lane.toLowerCase(), // Frontend Lane type uses lowercase
                status: a.status,
                configHash: a.configHash,
                tasksCompleted: Number(a.tasksCompleted),
                tasksFailed: Number(a.tasksFailed),
                totalEarnedUsdc: Number(a.totalEarnedUsdc),
                listingExpiry: a.listingExpiry,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
                name: displayName,
                taskCount: Number(a.tasksCompleted) + Number(a.tasksFailed),
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
        const wallet = algosdk_1.default.generateAccount();
        const configToEncrypt = {
            lane,
            llmTier,
            biddingStrategy,
            openai_api_key: openaiApiKey,
            private_key: Buffer.from(wallet.sk).toString('base64'),
            agent_address: wallet.addr
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
        // 2. Map lane string to required UInt64 for contract
        // Lane enum: 0=RESEARCH, 1=CODE, 2=DATA, 3=OUTREACH
        const laneMap = {
            'RESEARCH': 0,
            'CODE': 1,
            'DATA': 2,
            'OUTREACH': 3
        };
        const laneInt = laneMap[lane] ?? 0;
        const laneBigInt = BigInt(laneInt); // UInt64 for contract
        // 3. Mock config hash for the contract (the actual config is in the vault)
        const configHash = crypto_1.default.createHash('sha256').update(encryptedBlob).digest();
        // Save agent to DB immediately with the real address so frontend gets a valid Algorand address
        await prisma_1.prisma.agent.upsert({
            where: { id: agentId },
            update: {
                address: wallet.addr,
                senseiAddress: senseiAddress,
            },
            create: {
                id: agentId,
                address: wallet.addr,
                senseiAddress: senseiAddress,
                lane: lane,
                status: 'INACTIVE',
                configHash: configHash.toString('hex')
            }
        });
        console.log(`[ProxyRegister] Step 2: lane=${laneInt}, sensei=${senseiAddress}`);
        // 3. Attempt on-chain registration and fund contract with 200k microAlgos for MBR
        let txId = 'already-on-chain';
        try {
            const suggestedParams = await contracts_1.registryClient.algorand.client.algod.getTransactionParams().do();
            const baseFee = BigInt(suggestedParams.fee || 1000);
            // Mitigate algokit-utils bug expecting `transaction.from.publicKey` on v2 Transaction objects
            // by explicitly passing the signer into a 0-ALGO dummy transaction in the group.
            const dummyTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                from: contracts_1.adminAddress,
                to: contracts_1.adminAddress,
                amount: 0,
                suggestedParams
            });
            const result = await contracts_1.registryClient.newGroup()
                .addTransaction(dummyTxn, contracts_1.signer)
                .registerAgent({
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
            }).send({ maxRoundsToWaitForConfirmation: 10 });
            txId = result.txIds[0];
            console.log(`[ProxyRegister] Step 3: On-chain txn successful. Tx: ${txId}`);
        }
        catch (chainErr) {
            console.error('Registration failed with error:', chainErr.stack || chainErr);
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
                address: wallet.addr,
                senseiAddress,
                lane: lane.toUpperCase(),
                configHash: configHash.toString('hex'),
                status: types_1.AgentStatus.ACTIVE
            },
            create: {
                id: agentId,
                address: wallet.addr,
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
    const { address: rawAddress } = req.params;
    const address = rawAddress.toUpperCase(); // Normalize for case-sensitive lookups
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
        console.log(`[Stats API] Returning stats for ${address}:`, stats);
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
