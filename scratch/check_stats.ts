import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStats() {
    console.log('--- Agent Stats ---');
    const agents = await prisma.agent.findMany();
    agents.forEach(a => {
        console.log(`Agent: ${a.address}`);
        console.log(`  Tasks Completed: ${a.tasksCompleted}`);
        console.log(`  Total Earned: ${a.totalEarnedUsdc}`);
        console.log(`  Sensei: ${a.senseiAddress}`);
    });

    console.log('\n--- Settled Tasks ---');
    const tasks = await prisma.task.findMany({
        where: { state: 'SETTLED' }
    });
    tasks.forEach(t => {
        console.log(`Task ID: ${t.id}`);
        console.log(`  Bounty: ${t.bountyUsdc}`);
        console.log(`  Agent: ${t.agentId}`);
    });
}

checkStats()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
