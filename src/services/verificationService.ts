import { EscrowVaultClient } from '../algorand/EscrowVaultClient';
import { escrowClient, registryClient, adminAddress } from '../algorand/contracts';
import { TaskState } from '../lib/types';
import { prisma } from '../lib/prisma';

export class VerificationService {
  /**
   * Verify a task result using real Kite AI and perform on-chain settlement or slashing.
   */
  /**
   * Verify a task result using real Kite AI and perform on-chain settlement or slashing.
   */
  static async verifyAndSettle(taskId: string, provenanceHash: string, result: any) {
    console.log(`[VerificationService] Starting verification for task ${taskId}`);

    // 1. Fetch Task and associated Agent for metadata
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { agent: true }
    });

    if (!task) {
      console.error(`[VerificationService] Task ${taskId} not found in database.`);
      return;
    }

    // 2. Call Kite AI for verification
    const kiteResult = await this.callKiteAI(provenanceHash, taskId);

    // 3. Settlement logic
    const treasury = process.env.TREASURY_ADDRESS || adminAddress;
    const agentId = task.agentId;

    // 4. Handle verification results and trigger on-chain actions
    if (kiteResult.valid) {
      console.log(`[VerificationService] Kite AI returned valid=true for task ${taskId}`);
      try {
        // Perform on-chain settlement with platform fee (2% handled in contract)
        // We pass treasury to the updated releasePayment method
        await escrowClient.send.releasePayment({ 
          args: { taskId, treasury } 
        });

        // Increment successful tasks in Registry
        if (task.agent?.address) {
          await registryClient.send.incrementTasks({ 
            args: { agentId: task.agentId! }
          });
        }

        // Update task state on successful settlement
        await prisma.task.update({
          where: { id: taskId },
          data: { 
            state: TaskState.SETTLED, 
            kiteHash: provenanceHash,
            settledAt: new Date()
          }
        });

        // Update Agent stats in DB
        if (agentId) {
          const fee = (task.bountyUsdc * BigInt(200)) / BigInt(10000);
          const earned = task.bountyUsdc - fee;
          await prisma.agent.update({
            where: { id: agentId },
            data: {
              tasksCompleted: { increment: 1 },
              totalEarnedUsdc: { increment: earned }
            }
          });
        }
        
        console.log(`[VerificationService] Task ${taskId} successfully settled on-chain.`);
      } catch (error) {
        console.error(`[VerificationService] ERROR: On-chain settlement (verifyAndSettle) failed for task ${taskId}:`, error);
        await prisma.task.update({
          where: { id: taskId },
          data: { state: TaskState.VERIFIED }
        });
      }
    } else {
      console.warn(`[VerificationService] Kite validation failed for task ${taskId}. Triggering slashWorker. Reason: ${kiteResult.error ?? 'invalid hash'}`);
      try {
        // Perform on-chain slashing
        await escrowClient.send.slashCollateral({ 
          args: { taskId, treasury } 
        });

        // Increment failed tasks in Registry
        if (task.agent?.address) {
          await registryClient.send.incrementTasksFailed({ 
            args: { agentId: task.agentId! }
          });
        }

        // Update task state on successful slashing
        await prisma.task.update({
          where: { id: taskId },
          data: { 
            state: TaskState.SLASHED,
            kiteHash: provenanceHash,
            settledAt: new Date()
          }
        });

        // Update Agent stats in DB
        if (agentId) {
          await prisma.agent.update({
            where: { id: agentId },
            data: {
              tasksFailed: { increment: 1 }
            }
          });
        }
        console.log(`[VerificationService] Task ${taskId} successfully slashed on-chain.`);
      } catch (error) {
        console.error(`[VerificationService] ERROR: On-chain slashing (slashWorker) failed for task ${taskId}:`, error);
        await prisma.task.update({
          where: { id: taskId },
          data: { state: TaskState.VERIFIED }
        });
      }
    }
  }

  /**
   * Real Kite AI Verification call using official API.
   */
  private static async callKiteAI(
    kiteHash: string,
    taskId: string
  ): Promise<{ valid: boolean; error?: string }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch('https://api.kiteai.io/v1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.KITE_API_KEY}`
        },
        body: JSON.stringify({ hash: kiteHash, taskId }),
        signal: controller.signal
      });

      if (!response.ok) {
        const body = await response.text();
        console.error(`[VerificationService] Kite AI returned ${response.status}: ${body}`);
        return { valid: false, error: `Kite API error: ${response.status}` };
      }

      const data = await response.json() as { valid: boolean };
      return { valid: data.valid };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.error(`[VerificationService] Kite AI timeout for task ${taskId}`);
        return { valid: false, error: 'Kite AI timeout' };
      }
      console.error(`[VerificationService] Kite AI request failed for task ${taskId}:`, e);
      return { valid: false, error: e.message };
    } finally {
      clearTimeout(timeout);
    }
  }
}
