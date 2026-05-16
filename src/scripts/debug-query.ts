import { prisma } from '../lib/prisma';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function main() {
  console.log('=== AGENTS ===');
  const agents = await prisma.agent.findMany({ take: 10 });
  console.log(JSON.stringify(agents, null, 2));
  
  console.log('\n=== TASKS WITH RESULTS ===');
  const tasks = await prisma.task.findMany({ 
    where: { result: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(tasks, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });