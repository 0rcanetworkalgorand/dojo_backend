import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const DEMO_STATS: Record<string, { tasksCompleted: number; tasksFailed: number; totalEarnedUsdc: number }> = {
  'code-5pqobj': { tasksCompleted: 14, tasksFailed: 1, totalEarnedUsdc: 68600000 },
  'code-zvwd74': { tasksCompleted: 9, tasksFailed: 2, totalEarnedUsdc: 44100000 },
  'code-j0g3wi': { tasksCompleted: 7, tasksFailed: 0, totalEarnedUsdc: 34300000 },
  'code-l9xe4u': { tasksCompleted: 11, tasksFailed: 1, totalEarnedUsdc: 53900000 },
  'data-98lo5w': { tasksCompleted: 6, tasksFailed: 1, totalEarnedUsdc: 29400000 },
  'data-ltje6u': { tasksCompleted: 8, tasksFailed: 0, totalEarnedUsdc: 39200000 },
  'data-y42bsr': { tasksCompleted: 5, tasksFailed: 2, totalEarnedUsdc: 24500000 },
  'outreach-iqyanf': { tasksCompleted: 12, tasksFailed: 1, totalEarnedUsdc: 58800000 },
  'outreach-n77ymf': { tasksCompleted: 4, tasksFailed: 0, totalEarnedUsdc: 19600000 },
  'outreach-upp16j': { tasksCompleted: 10, tasksFailed: 3, totalEarnedUsdc: 49000000 },
};

async function main() {
  console.log('[Seed] Updating agents with demo stats...');

  for (const [agentId, stats] of Object.entries(DEMO_STATS)) {
    try {
      await prisma.agent.update({
        where: { id: agentId },
        data: {
          tasksCompleted: BigInt(stats.tasksCompleted),
          tasksFailed: BigInt(stats.tasksFailed),
          totalEarnedUsdc: BigInt(stats.totalEarnedUsdc),
        },
      });
      const total = stats.tasksCompleted + stats.tasksFailed;
      const rate = Math.round((stats.tasksCompleted / total) * 100);
      console.log(`  ✅ ${agentId}: ${stats.tasksCompleted} completed, ${stats.tasksFailed} failed (${rate}%), earned ${(stats.totalEarnedUsdc / 1000000).toFixed(1)} ALGO`);
    } catch (err: any) {
      console.error(`  ❌ ${agentId}: ${err.message}`);
    }
  }

  console.log('[Seed] Done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
