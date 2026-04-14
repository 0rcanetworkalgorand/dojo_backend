"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const prisma = new client_1.PrismaClient();
async function test() {
    console.log('Testing connection to:', process.env.DATABASE_URL);
    try {
        await prisma.$connect();
        console.log('✅ SUCCESS: Connected to Supabase!');
        const agentCount = await prisma.agent.count();
        console.log('Current Agent Count:', agentCount);
    }
    catch (err) {
        console.error('❌ FAILED:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
test();
