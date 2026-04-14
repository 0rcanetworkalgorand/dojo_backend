"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const socket_1 = require("../lib/socket");
const AuctionService_1 = require("../services/AuctionService");
const taskExecutor_1 = require("../services/taskExecutor");
const router = (0, express_1.Router)();
const auctionService = new AuctionService_1.AuctionService();
// ── Keyword-based lane detection ─────────────────────────────────────
const LANE_KEYWORDS = {
    RESEARCH: ['research', 'analyze', 'analysis', 'report', 'study', 'investigate', 'sentiment', 'market', 'trend', 'scrape', 'survey', 'insight', 'whitepaper', 'summarize', 'explore', 'review', 'audit'],
    CODE: ['code', 'build', 'develop', 'debug', 'deploy', 'smart contract', 'frontend', 'backend', 'api', 'fix', 'implement', 'refactor', 'test', 'program', 'software', 'typescript', 'python', 'solidity', 'rust'],
    DATA: ['data', 'dataset', 'etl', 'clean', 'visualize', 'chart', 'graph', 'statistics', 'model', 'pipeline', 'sql', 'csv', 'database', 'dashboard', 'metric', 'analytics'],
    OUTREACH: ['outreach', 'social', 'twitter', 'community', 'marketing', 'campaign', 'content', 'post', 'engagement', 'growth', 'brand', 'influencer', 'newsletter', 'discord', 'telegram'],
};
function detectLane(description) {
    const lower = description.toLowerCase();
    const scores = {};
    for (const [lane, keywords] of Object.entries(LANE_KEYWORDS)) {
        scores[lane] = keywords.reduce((sum, kw) => {
            // Whole-word matching for better accuracy
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            const matches = lower.match(regex);
            return sum + (matches ? matches.length : 0);
        }, 0);
    }
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topLane = sorted[0][0];
    const topScore = sorted[0][1];
    const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
    const confidence = totalScore > 0 ? Math.round((topScore / totalScore) * 100) : 0;
    return { lane: topScore > 0 ? topLane : 'RESEARCH', confidence: topScore > 0 ? confidence : 25, scores };
}
// ── Match agents to a task description ───────────────────────────────
router.post('/match', async (req, res) => {
    const { description } = req.body;
    if (!description || description.trim().length < 5) {
        return res.status(400).json({ error: 'Please provide a task description (at least 5 characters).' });
    }
    try {
        const detection = detectLane(description);
        console.log(`[TaskMatch] Detected lane: ${detection.lane} (confidence: ${detection.confidence}%) for: "${description.substring(0, 60)}..."`);
        // Fetch agents matching the detected lane
        const agents = await prisma_1.prisma.agent.findMany({
            where: {
                lane: detection.lane,
                status: 'ACTIVE',
            },
        });
        // Also fetch agents from secondary lanes if confidence is low
        let secondaryAgents = [];
        if (detection.confidence < 60) {
            const secondaryLanes = Object.entries(detection.scores)
                .filter(([l, s]) => l !== detection.lane && s > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 1)
                .map(([l]) => l);
            if (secondaryLanes.length > 0) {
                secondaryAgents = await prisma_1.prisma.agent.findMany({
                    where: {
                        lane: { in: secondaryLanes },
                        status: 'ACTIVE',
                    },
                });
            }
        }
        const allAgents = [...agents, ...secondaryAgents].map(a => ({
            ...a,
            name: a.name || `Agent ${a.address.substring(0, 8)}`,
            taskCount: Number(a.tasksCompleted),
            successRate: 100,
            totalEarned: Number(a.totalEarnedUsdc) / 1_000_000,
            commitmentExpiry: a.listingExpiry ? new Date(a.listingExpiry).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
            isPrimaryMatch: agents.some(pa => pa.id === a.id),
        }));
        res.json({
            detectedLane: detection.lane,
            confidence: detection.confidence,
            scores: detection.scores,
            agents: allAgents,
        });
    }
    catch (error) {
        console.error('[TaskMatch] Error:', error);
        res.status(500).json({ error: 'Failed to match agents' });
    }
});
// Client: Post a new task requirement (called from /hire page)
router.post('/', async (req, res) => {
    const { title, description, lane, bountyUsdc, clientAddress, deadlineDays, stakeTxId, agentAddress, agentId: reqAgentId } = req.body;
    try {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + (deadlineDays || 7));
        // Find the agent to assign
        let agentId = reqAgentId || null;
        if (!agentId && agentAddress) {
            const agent = await prisma_1.prisma.agent.findFirst({ where: { address: agentAddress, status: 'ACTIVE' } });
            agentId = agent?.id || null;
        }
        const task = await prisma_1.prisma.task.create({
            data: {
                id: crypto.randomUUID(),
                title: title || null,
                description: description || null,
                lane: lane || 'RESEARCH',
                bountyUsdc: BigInt(bountyUsdc || 0),
                clientAddress: clientAddress || 'unknown',
                agentId,
                workerAddress: agentAddress || null,
                state: types_1.TaskState.CREATED,
                deadline,
            }
        });
        console.log(`[TaskRoutes] Task ${task.id} created. Lane: ${task.lane}, Agent: ${agentId || 'none'}`);
        // Notify via WebSocket
        (0, socket_1.broadcast)('NEW_TASK', {
            id: task.id,
            title,
            description,
            lane: task.lane,
            bountyUsdc: task.bountyUsdc.toString(),
            deadline: task.deadline,
            state: task.state
        });
        // ── Trigger AI execution asynchronously ──
        // This fires in the background — the response returns immediately
        if (description && description.trim().length > 0) {
            taskExecutor_1.TaskExecutor.executeTask(task.id).catch(err => {
                console.error(`[TaskRoutes] Background execution failed for ${task.id}:`, err);
            });
        }
        res.status(201).json({
            ...task,
            bountyUsdc: task.bountyUsdc.toString()
        });
    }
    catch (error) {
        console.error('Failed to create task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});
// Agent: Submit a bid for a task
router.post('/:id/bid', async (req, res) => {
    const { id } = req.params;
    const { agentId, bidAmountUsdc, workerAddress } = req.body;
    try {
        const success = auctionService.addBid(id, {
            agentId,
            bidAmountUsdc: BigInt(bidAmountUsdc),
            workerAddress
        });
        if (success) {
            res.json({ message: 'Bid accepted' });
        }
        else {
            res.status(400).json({ error: 'Auction closed or invalid task' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit bid' });
    }
});
// List tasks
router.get('/', async (req, res) => {
    const { state } = req.query;
    try {
        const tasks = await prisma_1.prisma.task.findMany({
            where: state ? { state: state } : {},
            orderBy: { createdAt: 'desc' }
        });
        const serialized = tasks.map(t => ({
            ...t,
            bountyUsdc: t.bountyUsdc.toString(),
            collateralUsdc: t.collateralUsdc?.toString()
        }));
        res.json(serialized);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
// Get a specific task by ID (for polling results)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma_1.prisma.task.findUnique({
            where: { id },
            include: { agent: true }
        });
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        res.json({
            ...task,
            bountyUsdc: task.bountyUsdc.toString(),
            collateralUsdc: task.collateralUsdc?.toString()
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});
// Cleanup: Delete a reserved task (on transaction failure)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma_1.prisma.task.findUnique({ where: { id } });
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        // Only allow deletion of CREATED tasks
        if (task.state !== types_1.TaskState.CREATED) {
            return res.status(400).json({ error: 'Cannot delete task in current state' });
        }
        await prisma_1.prisma.task.delete({ where: { id } });
        res.json({ message: 'Task cleaned up' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to cleanup task' });
    }
});
exports.default = router;
