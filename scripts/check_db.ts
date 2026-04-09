import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function check() {
    console.log('--- DOJO DIAGNOSTIC START ---');
    try {
        console.log('Connecting to database...');
        const count = await prisma.agent.count();
        console.log(`✅ Total Agents in Database: ${count}`);
        
        if (count > 0) {
            const agent = await prisma.agent.findFirst();
            console.log('✅ Sample Agent:', JSON.stringify(agent, null, 2));
        } else {
            console.warn('⚠️ No agents found in database.');
        }

        const taskCount = await prisma.task.count();
        console.log(`✅ Total Tasks in Database: ${taskCount}`);
        
        console.log('--- DOJO DIAGNOSTIC END ---');
    } catch (err) {
        console.error('❌ Diagnostic Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
