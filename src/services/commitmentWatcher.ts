import { TaskState } from '../lib/types';
import { prisma } from '../lib/prisma';

export const startCommitmentWatcher = () => {
  // Check for expired commitments every 24 hours (86400000ms)
  setInterval(async () => {
    console.log('Running daily commitment expiry check...');
    
    // Find tasks that haven't been submitted before deadline
    // Using the new schema 'state' and 'deadline' fields
    const expiredTasks = await prisma.task.findMany({
      where: {
        state: TaskState.LOCKED,
        deadline: {
          lt: new Date()
        }
      }
    });

    for (const task of expiredTasks) {
      console.log(`Slashing collateral for expired task ${task.id}`);
      // In a real scenario, this would trigger an on-chain slash via VerificationService
      await prisma.task.update({
        where: { id: task.id },
        data: { state: TaskState.SLASHED }
      });
    }
  }, 24 * 60 * 60 * 1000);
};
