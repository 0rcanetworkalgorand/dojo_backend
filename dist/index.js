"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./lib/socket");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./lib/prisma");
const indexerListener_1 = require("./services/indexerListener");
const commitmentWatcher_1 = require("./services/commitmentWatcher");
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// Ensure BigInt values can be serialized to JSON
BigInt.prototype.toJSON = function () {
    return this.toString();
};
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api/agents', agentRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
const PORT = process.env.PORT || 3001;
// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', api: 'v1' }));
// WebSocket
(0, socket_1.initSocket)(server);
server.listen(PORT, async () => {
    console.log(`Dojo Backend listening on port ${PORT}`);
    // Verify Database Connection early
    try {
        await prisma_1.prisma.$connect();
        console.log('✅ Database connection verified');
        // 0rca Swarm Dojo — Background Indexer
        // ONLY START INDEXER IF DB IS OK
        const indexer = new indexerListener_1.IndexerListener();
        indexer.start();
        console.log("Indexer listener started");
        // Start background services
        (0, commitmentWatcher_1.startCommitmentWatcher)();
    }
    catch (err) {
        console.error('❌ DATABASE CONNECTION FAILED:', err);
        console.error('The backend will likely fail to persist data. Please check your DATABASE_URL.');
    }
});
