const { PrismaClient } = require('@prisma/client');
const algosdk = require('algosdk');

const prisma = new PrismaClient();

async function run() {
    const agents = await prisma.agent.findMany();
    let updated = 0;
    for (const agent of agents) {
        if (agent.address.length !== 58) {
            const acc = algosdk.generateAccount();
            await prisma.agent.update({
                where: { id: agent.id },
                data: { address: acc.addr }
            });
            updated++;
        }
    }
    console.log(`Updated ${updated} agents.`);
    await prisma.$disconnect();
}
run().catch(console.error);
