import { PrismaClient, LaneType } from '@prisma/client';
import algosdk from 'algosdk';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function check() {
    console.log('--- DOJO DIAGNOSTIC START ---');
    try {
        const registryAppId = BigInt(process.env.DOJO_REGISTRY_APP_ID || '0');
        console.log(`Checking Registry App ID: ${registryAppId}`);

        // 1. Check Algosdk for boxes directly
        const client = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
        console.log('Fetching boxes from Algod (Testnet)...');
        const boxes = await client.getApplicationBoxes(registryAppId).do();
        console.log(`✅ On-Chain Boxes found: ${boxes.boxes.length}`);
        
        for (const box of boxes.boxes) {
            console.log(` - Box: ${Buffer.from(box.name).toString('utf-8')}`);
        }

        // 2. Check Database via Prisma
        console.log('\nConnecting to Supabase Database...');
        const count = await prisma.agent.count();
        console.log(`✅ Agents in Prisma Database: ${count}`);
        
        if (count > 0) {
            const agents = await prisma.agent.findMany();
            agents.forEach(a => {
                console.log(` - Agent ID: ${a.id}, Status: ${a.status}, Lane: ${a.lane}`);
            });
        }

        console.log('\n--- DOJO DIAGNOSTIC END ---');
    } catch (err) {
        console.error('❌ Diagnostic Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
