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
const rei_1 = require("./services/rei");
const reiSessionManager_1 = require("./services/reiSessionManager");
const x402Service_1 = require("./services/x402Service");
const x402Server_1 = require("./services/x402Server");
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
// Initialize x402 (payment protocol)
console.log('[Init] Setting up x402...');
(0, x402Service_1.initX402Client)().then(() => console.log('[Init] X402 client ready'));
const x402ServerReady = (0, x402Server_1.initX402Server)().then(() => {
    console.log('[Init] X402 server ready');
    const middleware = (0, x402Server_1.getX402Middleware)();
    if (middleware) {
        app.use('/api/tasks', middleware, taskRoutes_1.default);
        console.log('[Init] X402 middleware applied to /api/tasks');
    }
    else {
        app.use('/api/tasks', taskRoutes_1.default);
    }
});
app.use('/api/agents', agentRoutes_1.default);
// ── Rei Routes ──────────────────────────────────────────────────────────
app.post('/api/rei/analyze', async (req, res) => {
    const { description } = req.body;
    if (!description || description.trim().length < 5) {
        return res.status(400).json({ error: 'Description must be at least 5 characters.' });
    }
    try {
        const recommendation = await (0, rei_1.getReiRecommendation)(description);
        res.json(recommendation);
    }
    catch (error) {
        console.error('[Rei] /api/rei/analyze error:', error);
        res.status(500).json({ error: 'Rei analysis failed.' });
    }
});
app.post('/api/rei/session/start', async (req, res) => {
    const { clientAddress, description, selectedAgents, stakeTxIds, clientPublicKey } = req.body;
    if (!clientAddress)
        return res.status(400).json({ error: 'Missing: clientAddress' });
    if (!description)
        return res.status(400).json({ error: 'Missing: description' });
    if (!selectedAgents || !Array.isArray(selectedAgents) || selectedAgents.length === 0) {
        return res.status(400).json({ error: 'Missing: selectedAgents' });
    }
    if (!stakeTxIds || !Array.isArray(stakeTxIds)) {
        return res.status(400).json({ error: 'Missing: stakeTxIds' });
    }
    try {
        const { sessionId, agents } = (0, reiSessionManager_1.initSession)(clientAddress, description, selectedAgents, stakeTxIds, clientPublicKey);
        const firstAgent = await (0, reiSessionManager_1.executeSession)(sessionId);
        res.json({ sessionId, firstAgent, subTask: firstAgent.subTask });
    }
    catch (error) {
        console.error('[Rei] /api/rei/session/start error:', error);
        res.status(500).json({ error: error.message || 'Failed to start Rei session.' });
    }
});
app.post('/api/rei/session/:sessionId/approve', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await (0, reiSessionManager_1.approveAndAdvance)(sessionId);
        res.json(result);
    }
    catch (error) {
        console.error('[Rei] /api/rei/session/:sessionId/approve error:', error);
        res.status(400).json({ error: error.message || 'Approval failed.' });
    }
});
app.post('/api/rei/session/:sessionId/reject', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await (0, reiSessionManager_1.rejectAndAdvance)(sessionId);
        res.json(result);
    }
    catch (error) {
        console.error('[Rei] /api/rei/session/:sessionId/reject error:', error);
        res.status(400).json({ error: error.message || 'Rejection failed.' });
    }
});
app.get('/api/rei/session/:sessionId/status', (req, res) => {
    const { sessionId } = req.params;
    const session = (0, reiSessionManager_1.getSessionStatus)(sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found.' });
    }
    res.json(session);
});
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
