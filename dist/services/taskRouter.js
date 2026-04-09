"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRouter = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const executionManager_1 = require("./executionManager");
class TaskRouter {
    /**
     * Route a task to the appropriate agent.
     * Now accepts payload directly since it's not persisted in the new schema.
     */
    static async routeTask(taskId, payload) {
        console.log(`[TaskRouter] Routing task ${taskId}...`);
        const task = await prisma_1.prisma.task.findUnique({ where: { id: taskId } });
        if (!task)
            return;
        // The task payload should contain the target lane
        const targetLane = payload.lane;
        if (!targetLane) {
            console.error(`[TaskRouter] Task ${taskId} has no lane in payload.`);
            return;
        }
        // Step 1 — Query candidates from the Prisma database
        const candidates = await prisma_1.prisma.agent.findMany({
            where: {
                lane: targetLane,
                status: client_1.AgentStatus.LISTED,
            }
        });
        // Step 4 — If no candidates exist in the database, throw an error
        if (candidates.length === 0) {
            throw new Error(`No eligible agents available for lane: ${targetLane}`);
        }
        // Step 2 — For each candidate, compute a score
        const scoredCandidates = candidates.map(candidate => {
            const totalTasks = candidate.tasksCompleted + candidate.tasksFailed;
            const successRate = totalTasks > 0n
                ? Number(candidate.tasksCompleted) / Number(totalTasks)
                : 0.5; // default 50% for new agents with no history
            const taskCountWeight = Math.min(Number(candidate.tasksCompleted) / 100, 1.0);
            // caps at 100 tasks — after that, volume weight is maxed
            const score = (successRate * 0.7) + (taskCountWeight * 0.3);
            // 70% weight on success rate, 30% weight on task volume
            return { candidate, score, successRate };
        });
        // Step 3 — Sort candidates by score descending. Select the top candidate.
        scoredCandidates.sort((a, b) => b.score - a.score);
        const selected = scoredCandidates[0];
        const bestAgent = selected.candidate;
        // Step 5 — Log the selected agent and its score
        console.info(`[TaskRouter] Selected agent ${bestAgent.address} with score ${selected.score.toFixed(3)} (successRate=${selected.successRate.toFixed(3)}, completedTasks=${bestAgent.tasksCompleted}) for lane ${targetLane}`);
        await prisma_1.prisma.task.update({
            where: { id: taskId },
            data: {
                agentId: bestAgent.id,
                workerAddress: bestAgent.address,
                state: client_1.TaskState.LOCKED
            }
        });
        // 2. Dispatch to Agent Execution Manager
        await executionManager_1.ExecutionManager.startAgentForTask(bestAgent.id, taskId, payload);
    }
}
exports.TaskRouter = TaskRouter;
