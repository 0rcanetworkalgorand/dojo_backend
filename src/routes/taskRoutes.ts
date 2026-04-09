import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { TaskState, LaneType } from '../lib/types';
import { broadcast } from '../lib/socket';
import { AuctionService } from '../services/AuctionService';

const router = Router();
const auctionService = new AuctionService();

// Client: Post a new task requirement
router.post('/', async (req, res) => {
    const { title, description, lane, bountyUsdc, clientAddress, deadlineDays } = req.body;

    try {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + (deadlineDays || 7));

        const task = await prisma.task.create({
            data: {
                id: crypto.randomUUID(),
                lane: lane as LaneType,
                bountyUsdc: BigInt(bountyUsdc),
                clientAddress,
                state: TaskState.CREATED,
                deadline,
                // We'll store metadata in description for now or a separate field if added
            }
        });

        // Notify agents via WebSocket
        broadcast('NEW_TASK', {
            id: task.id,
            title,
            description,
            lane: task.lane,
            bountyUsdc: task.bountyUsdc.toString(),
            deadline: task.deadline
        });

        // Start off-chain auction
        auctionService.startAuction(task.id);

        res.status(201).json({ 
            ...task, 
            bountyUsdc: task.bountyUsdc.toString() 
        });
    } catch (error) {
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
        } else {
            res.status(400).json({ error: 'Auction closed or invalid task' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit bid' });
    }
});

// List tasks
router.get('/', async (req, res) => {
    const { state } = req.query;
    try {
        const tasks = await prisma.task.findMany({
            where: state ? { state: state as TaskState } : {},
            orderBy: { createdAt: 'desc' }
        });
        const serialized = tasks.map(t => ({
            ...t,
            bountyUsdc: t.bountyUsdc.toString(),
            collateralUsdc: t.collateralUsdc?.toString()
        }));
        res.json(serialized);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Cleanup: Delete a reserved task (on transaction failure)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        
        // Only allow deletion of CREATED tasks
        if (task.state !== TaskState.CREATED) {
            return res.status(400).json({ error: 'Cannot delete task in current state' });
        }

        await prisma.task.delete({ where: { id } });
        res.json({ message: 'Task cleaned up' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cleanup task' });
    }
});

export default router;
