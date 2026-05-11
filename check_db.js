const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const agents = await prisma.agent.findMany();
    // Convert BigInt to string for JSON serialization
    const serialized = JSON.parse(JSON.stringify(agents, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    console.log(JSON.stringify(serialized, null, 2));
    process.exit(0);
}

main();
