import { prisma } from './src/lib/prisma';
async function main() {
    const tasks = await prisma.task.findMany({
        where: { result: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
    console.log(JSON.stringify(tasks, null, 2));
}
main().catch(console.error);