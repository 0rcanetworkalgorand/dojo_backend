import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const agentId = 'agent data-9';
  console.log(`[Init] Initializing demo stats for ${agentId}...`);

  await prisma.agent.upsert({
    where: { id: agentId },
    update: {
      tasksCompleted: 2,
      tasksFailed: 0,
      lane: 'DATA',
      status: 'ACTIVE',
      senseiAddress: 'DEMO_SENSEI_ADDR',
      address: agentId,
      configHash: '0000000000000000000000000000000000000000000000000000000000000000'
    },
    create: {
      id: agentId,
      address: agentId,
      senseiAddress: 'DEMO_SENSEI_ADDR',
      lane: 'DATA',
      status: 'ACTIVE',
      configHash: '0000000000000000000000000000000000000000000000000000000000000000',
      tasksCompleted: 2,
      tasksFailed: 0,
    },
  });

  console.log(`[Init] ✅ Success! agent data-9 is now ready with 2 tasks and 60% success rate.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
