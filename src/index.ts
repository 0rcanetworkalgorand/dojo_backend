import express from 'express';
import http from 'http';
import { initSocket } from './lib/socket';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { LaneType, AgentStatus, TaskState } from './lib/types';
import { prisma } from './lib/prisma';
import { TaskRouter } from './services/taskRouter';
import { IndexerListener } from './services/indexerListener';
import { startCommitmentWatcher } from './services/commitmentWatcher';
import agentRoutes from './routes/agentRoutes';
import taskRoutes from './routes/taskRoutes';
import { getReiRecommendation } from './services/rei';
import { initSession, executeSession, approveAndAdvance, rejectAndAdvance, getSessionStatus } from './services/reiSessionManager';


// Ensure BigInt values can be serialized to JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/agents', agentRoutes);
app.use('/api/tasks', taskRoutes);

// ── Rei Routes ──────────────────────────────────────────────────────────
app.post('/api/rei/analyze', async (req, res) => {
    const { description } = req.body;
    if (!description || description.trim().length < 5) {
        return res.status(400).json({ error: 'Description must be at least 5 characters.' });
    }
    try {
        const recommendation = await getReiRecommendation(description);
        res.json(recommendation);
    } catch (error: any) {
        console.error('[Rei] /api/rei/analyze error:', error);
        res.status(500).json({ error: 'Rei analysis failed.' });
    }
});

app.post('/api/rei/session/start', async (req, res) => {
    const { clientAddress, description, selectedAgents, stakeTxIds, clientPublicKey } = req.body;
    if (!clientAddress) return res.status(400).json({ error: 'Missing: clientAddress' });
    if (!description) return res.status(400).json({ error: 'Missing: description' });
    if (!selectedAgents || !Array.isArray(selectedAgents) || selectedAgents.length === 0) {
        return res.status(400).json({ error: 'Missing: selectedAgents' });
    }
    if (!stakeTxIds || !Array.isArray(stakeTxIds)) {
        return res.status(400).json({ error: 'Missing: stakeTxIds' });
    }
    try {
        const { sessionId, agents } = initSession(clientAddress, description, selectedAgents, stakeTxIds, clientPublicKey);
        const firstAgent = await executeSession(sessionId);
        res.json({ sessionId, firstAgent, subTask: firstAgent.subTask });
    } catch (error: any) {
        console.error('[Rei] /api/rei/session/start error:', error);
        res.status(500).json({ error: error.message || 'Failed to start Rei session.' });
    }
});

app.post('/api/rei/session/:sessionId/approve', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await approveAndAdvance(sessionId);
        res.json(result);
    } catch (error: any) {
        console.error('[Rei] /api/rei/session/:sessionId/approve error:', error);
        res.status(400).json({ error: error.message || 'Approval failed.' });
    }
});

app.post('/api/rei/session/:sessionId/reject', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await rejectAndAdvance(sessionId);
        res.json(result);
    } catch (error: any) {
        console.error('[Rei] /api/rei/session/:sessionId/reject error:', error);
        res.status(400).json({ error: error.message || 'Rejection failed.' });
    }
});

app.get('/api/rei/session/:sessionId/status', (req, res) => {
    const { sessionId } = req.params;
    const session = getSessionStatus(sessionId);
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
initSocket(server);

server.listen(PORT, async () => {
    console.log(`Dojo Backend listening on port ${PORT}`);
    
    // Verify Database Connection early
    try {
        await prisma.$connect();
        console.log('✅ Database connection verified');
        
        // 0rca Swarm Dojo — Background Indexer
        // ONLY START INDEXER IF DB IS OK
        const indexer = new IndexerListener();
        indexer.start(); 
        console.log("Indexer listener started");
        
        // Start background services
        startCommitmentWatcher();
        
    } catch (err) {
        console.error('❌ DATABASE CONNECTION FAILED:', err);
        console.error('The backend will likely fail to persist data. Please check your DATABASE_URL.');
    }
});
