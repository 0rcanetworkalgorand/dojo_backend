import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Connecting to database via Prisma...');
    
    // Execute multiple ALTER TABLE statements to add missing columns
    await prisma.$executeRawUnsafe('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "totalEarned" BIGINT DEFAULT 0;');
    await prisma.$executeRawUnsafe('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "successRate" INTEGER DEFAULT 100;');
    await prisma.$executeRawUnsafe('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "reputation" INTEGER DEFAULT 0;');
    await prisma.$executeRawUnsafe('ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "expiry" BIGINT;');
    
    console.log('✅ Database schema patched successfully!');
  } catch (err) {
    console.error('❌ Failed to patch database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
