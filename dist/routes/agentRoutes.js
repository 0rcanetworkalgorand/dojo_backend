"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
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
        // Fallback for demo
        res.json([]);
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
        res.status(500).json({ error: 'Failed' });
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
