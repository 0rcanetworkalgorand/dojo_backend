import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function test() {
    console.log('Testing connection to:', process.env.DATABASE_URL);
    try {
        await prisma.$connect();
        console.log('✅ SUCCESS: Connected to Supabase!');
        const agentCount = await prisma.agent.count();
        console.log('Current Agent Count:', agentCount);
    } catch (err) {
        console.error('❌ FAILED:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
