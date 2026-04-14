import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixEarnings() {
    console.log('[Fix] Synchronizing agent stats with settled tasks...');
    
    // 1. Reset all agent stats to 0 (to recompute from scratch based on trustless task data)
    // Actually safer: Just find agents that have mismatch
    const agents = await prisma.agent.findMany();
    
    for (const agent of agents) {
        const settledTasks = await prisma.task.findMany({
            where: { 
                agentId: agent.id,
                state: 'SETTLED'
            }
        });

        const totalEarned = settledTasks.reduce((sum, t) => sum + t.bountyUsdc, BigInt(0));
        const count = BigInt(settledTasks.length);

        if (agent.tasksCompleted !== count || agent.totalEarnedUsdc !== totalEarned) {
            console.log(`[Fix] Updating ${agent.id}: ${agent.totalEarnedUsdc} -> ${totalEarned} ALGO`);
            await prisma.agent.update({
                where: { id: agent.id },
                data: {
                    tasksCompleted: count,
                    totalEarnedUsdc: totalEarned
                }
            });
        }
    }
    console.log('[Fix] Successfully synchronized all agent earnings.');
}

fixEarnings()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
