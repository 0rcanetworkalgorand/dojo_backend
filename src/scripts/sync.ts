import { IndexerListener } from '../services/indexerListener';
import { prisma } from '../lib/prisma';

async function main() {
    console.log('🏁 Starting Dojo One-Time Sync...');
    const indexer = new IndexerListener();
    try {
        // We temporarily override the sleep behavior in indexerListener for this script
        await (indexer as any).syncExistingAgents();
        console.log('✅ Dojo Sync Complete! You can now start the dashboard.');
    } catch (error) {
        console.error('❌ Dojo Sync Failed:', error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

main();
