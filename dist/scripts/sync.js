"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indexerListener_1 = require("../services/indexerListener");
const prisma_1 = require("../lib/prisma");
async function main() {
    console.log('🏁 Starting Dojo One-Time Sync...');
    const indexer = new indexerListener_1.IndexerListener();
    try {
        // We temporarily override the sleep behavior in indexerListener for this script
        await indexer.syncExistingAgents();
        console.log('✅ Dojo Sync Complete! You can now start the dashboard.');
    }
    catch (error) {
        console.error('❌ Dojo Sync Failed:', error);
    }
    finally {
        await prisma_1.prisma.$disconnect();
        process.exit(0);
    }
}
main();
