import { LaneType, TaskState, AgentStatus } from '../lib/types';
import { prisma } from '../lib/prisma';
import { ExecutionManager } from './executionManager';

export class TaskRouter {

  /**
   * Route a task to the appropriate agent.
   * Now accepts payload directly since it's not persisted in the new schema.
   */
  static async routeTask(taskId: string, payload: any) {
    console.log(`[TaskRouter] Routing task ${taskId}...`);
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) return;

    // The task payload should contain the target lane
    const targetLane = (payload as any).lane as LaneType;

    if (!targetLane) {
      console.error(`[TaskRouter] Task ${taskId} has no lane in payload.`);
      return;
    }

    // Step 1 — Query candidates from the Prisma database
    const candidates = await prisma.agent.findMany({
      where: {
        lane: targetLane,
        status: AgentStatus.LISTED,
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
        : 0.8; // default 80% for new agents to give them a chance

      const taskCountWeight = Math.min(Number(candidate.tasksCompleted) / 500, 1.0);
      
      // Bidding Strategy Simulation:
      // Volume strategy (lower bids) gets a bonus on selection probability
      // Margin strategy (higher bids) is more selective but harder to win
      // For now, we simulate this with a "bid efficiency" factor
      const strategyBonus = candidate.tasksCompleted > 100n ? 0.1 : 0.0; // Experience bonus

      // Final Score: 60% Success Rate, 20% Volume, 20% Reliability
      const reliabilityScore = candidate.tasksFailed === 0n ? 1.0 : (1.0 / (Number(candidate.tasksFailed) + 1));
      
      const score = (successRate * 0.6) + (taskCountWeight * 0.2) + (reliabilityScore * 0.2) + strategyBonus;
      
      return { candidate, score, successRate };
    });

    // Step 3 — Sort candidates by score descending with slight randomness to prevent monopoly
    scoredCandidates.sort((a, b) => (b.score + Math.random() * 0.05) - (a.score + Math.random() * 0.05));
    const selected = scoredCandidates[0];
    const bestAgent = selected.candidate;

    // Step 5 — Log the selected agent and its score
    console.info(`[TaskRouter] Selected agent ${bestAgent.address} with score ${selected.score.toFixed(3)} (successRate=${selected.successRate.toFixed(3)}, completedTasks=${bestAgent.tasksCompleted}) for lane ${targetLane}`);
    
    await prisma.task.update({
        where: { id: taskId },
        data: { 
            agentId: bestAgent.id,
            workerAddress: bestAgent.address,
            state: TaskState.LOCKED
        }
    });

    // 2. Dispatch to Agent Execution Manager
    await ExecutionManager.startAgentForTask(bestAgent.id, taskId, payload);
  }
}
