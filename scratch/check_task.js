const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTask() {
    try {
        const taskId = '77b707df-3edc-4adc-83d6-b3508d2ac9e0';
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { agent: true }
        });
        if (!task) {
            console.log('Task not found in DB.');
        } else {
            console.log('Task Data:', JSON.stringify(task, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

checkTask();
