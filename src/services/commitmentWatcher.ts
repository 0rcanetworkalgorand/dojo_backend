import { prisma } from '../lib/prisma';
import { registryClient } from '../algorand/contracts';
import { AgentStatus, CommitmentStatus } from '../lib/types';

export const startCommitmentWatcher = () => {
  // Check for expired commitments every 12 hours
  setInterval(async () => {
    console.log('[CommitmentWatcher] Running identity expiry check...');
    
    // 1. Find natural expirations (lockExpiry passed and still ACTIVE)
    const expiredCommitments = await prisma.commitment.findMany({
      where: {
        status: CommitmentStatus.ACTIVE,
        lockExpiry: {
          lt: new Date()
        }
      },
      include: { agent: true }
    });

    for (const commitment of expiredCommitments) {
      console.log(`[CommitmentWatcher] Commitment ${commitment.id} expired for agent ${commitment.agent.address}. Delisting...`);
      
      try {
        // Trigger on-chain delisting
        await registryClient.send.delistAgent({ 
          args: { agentId: commitment.agentId } 
        });

        // Update database states
        await prisma.$transaction([
          prisma.commitment.update({
            where: { id: commitment.id },
            data: { status: CommitmentStatus.EXPIRED }
          }),
          prisma.agent.update({
            where: { id: commitment.agentId },
            data: { status: AgentStatus.INACTIVE }
          })
        ]);
        
        console.log(`[CommitmentWatcher] Successfully delisted ${commitment.agent.address}`);
      } catch (err) {
        console.error(`[CommitmentWatcher] Failed to delist ${commitment.id}:`, err);
      }
    }

    // 2. Task Expiry (Optional, but good for cleanup)
    const staleTasks = await prisma.task.findMany({
      where: {
        state: 'LOCKED',
        deadline: { lt: new Date() }
      }
    });

    for (const task of staleTasks) {
       console.log(`[CommitmentWatcher] Task ${task.id} deadline passed. Suggesting slash...`);
       // Note: Slashing usually requires admin signature, similar to VerificationService
    }

  }, 12 * 60 * 60 * 1000);
};
