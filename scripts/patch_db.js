const { Client } = require('pg');
require('dotenv').config();

async function patch() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase. Patching schema...');

        // Add missing columns to Agent table
        await client.query('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "totalEarned" BIGINT DEFAULT 0;');
        await client.query('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "successRate" INTEGER DEFAULT 100;');
        await client.query('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "reputation" INTEGER DEFAULT 0;');
        await client.query('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "expiry" BIGINT;');
        
        console.log('✅ Database schema patched successfully!');
    } catch (err) {
        console.error('❌ Failed to patch database:', err);
    } finally {
        await client.end();
    }
}

patch();
