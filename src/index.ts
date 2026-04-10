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
