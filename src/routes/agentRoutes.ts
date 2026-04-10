import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AgentStatus } from '../lib/types';
import { registryClient } from '../algorand/contracts';
import { microAlgos } from '@algorandfoundation/algokit-utils';

const router = Router();

// List Agents
router.get('/', async (req, res) => {
    const { lane, sensei } = req.query;
    const where: any = {};
    if (lane) where.lane = (lane as string).toUpperCase();
    if (sensei) where.senseiAddress = sensei as string;

    try {
        let agents = await prisma.agent.findMany({
            where,
        });

        const mapped = agents.map(a => {
            const successRate = 100; // Default until failure tracking is active
            const totalEarned = Number(a.totalEarnedUsdc) / 1_000_000;
            
            return {
                ...a,
                address: a.address,
                name: (a as any).name || `Agent ${a.address.substring(0, 6)}`,
                taskCount: Number(a.tasksCompleted),
                successRate,
                totalEarned,
                commitmentExpiry: a.listingExpiry ? new Date(a.listingExpiry).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
            };
        });

        res.json(mapped);
    } catch (error) {
        console.error('[agentRoutes] Detailed fetch error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Proxy Registration (Admin signs on behalf of user)
router.post('/register', async (req, res) => {
    const { agentId, senseiAddress, lane, configHashHex } = req.body;

    if (!agentId || !senseiAddress || lane === undefined || !configHashHex) {
        return res.status(400).json({ error: 'Missing registration details' });
    }

    try {
        console.log(`[ProxyRegister] Step 1: Preparing transaction (Version 4) for ${agentId}`);
        
        // 1. Convert hex to bytes for the contract
        const configHash = Buffer.from(configHashHex, 'hex');
        
        // 2. Map lane string/number to the required UInt64
        const laneInt = typeof lane === 'string' ? 
            (lane.toLowerCase() === 'research' ? 0 : lane.toLowerCase() === 'outreach' ? 1 : 2) : 
            lane;

        const laneBigInt = BigInt(laneInt);
        
        console.log(`[ProxyRegister] Step 2: lane=${laneBigInt}, sensei=${senseiAddress}`);

        // 3. Attempt on-chain registration
        let txId = 'already-on-chain';
        try {
            const suggestedParams = await registryClient.algorand.client.algod.getTransactionParams().do();
            const baseFee = BigInt(suggestedParams.fee || 1000);

            const result = await registryClient.newGroup().registerAgent({
                args: {
                    agentId,
                    sensei: senseiAddress,
                    lane: laneBigInt,
                    configHash: new Uint8Array(configHash)
                },
                boxReferences: [
                    new Uint8Array(Buffer.from(agentId))
                ],
                staticFee: microAlgos(baseFee)
            }).send();

            txId = result.txIds[0];
            console.log(`[ProxyRegister] Step 3: On-chain txn successful. Tx: ${txId}`);
        } catch (chainErr: any) {
            const errMsg = chainErr?.message || '';
            // pc=178 is "Agent already registered" in the contract
            if (errMsg.includes('pc=178') || errMsg.includes('Agent already registered')) {
                console.log(`[ProxyRegister] Agent ${agentId} already exists on-chain — proceeding with DB sync.`);
            } else {
                // Re-throw if it's a different contract error
                throw chainErr;
            }
        }

        // 4. Create/Upsert in Database (always runs, even if agent was already on-chain)
        const agent = await prisma.agent.upsert({
            where: { id: agentId },
            update: {
                senseiAddress,
                lane: lane.toString().toUpperCase(),
                configHash: configHashHex,
                status: AgentStatus.ACTIVE
            },
            create: {
                id: agentId,
                address: agentId, 
                senseiAddress,
                lane: lane.toString().toUpperCase(),
                configHash: configHashHex,
                status: AgentStatus.ACTIVE,
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

    } catch (error: any) {
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
        let agents = await prisma.agent.findMany({
            where: { senseiAddress: address }
        });

        const agentAddresses = agents.map(a => a.address);
        
        const tasks = await prisma.task.findMany({
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
    } catch (err) {
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
        const agent = await prisma.agent.findUnique({
            where: { address: agentAddress }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const license = await prisma.license.create({
            data: {
                agentId: agent.id,
                licenseeAddress,
                feeUsdc: BigInt(feeUsdc || 50000000), // Default 50 USDC if not provided
                isActive: true
            }
        });
        
        console.log(`[Licenses] Agent ${agentAddress} licensed by ${licenseeAddress}. Tx: ${txId}`);
        
        res.json({ success: true, licenseId: license.id });
    } catch (error) {
        console.error('Failed to record license:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

export default router;
