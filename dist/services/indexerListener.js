"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexerListener = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const types_1 = require("../lib/types");
const prisma_1 = require("../lib/prisma");
const contracts_1 = require("../algorand/contracts");
const executionManager_1 = require("./executionManager");
const DojoRegistryClient_1 = require("../algorand/DojoRegistryClient");
const EscrowVaultClient_1 = require("../algorand/EscrowVaultClient");
const socket_1 = require("../lib/socket");
// Helper to get ARC56 method by selector
const getMethod = (spec, selector) => {
    return spec.methods.find((m) => {
        const method = new algosdk_1.default.ABIMethod(m);
        return Buffer.from(method.getSelector()).toString('hex') === selector;
    });
};
class IndexerListener {
    registryAppId;
    escrowAppId;
    lastBlock = 0;
    isRunning = false;
    constructor() {
        this.registryAppId = parseInt(process.env.DOJO_REGISTRY_APP_ID || '0');
        this.escrowAppId = parseInt(process.env.ESCROW_VAULT_APP_ID || '0');
    }
    async start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        console.log('🚀 Indexer Listener started (Polling Algod)');
        // 0. Initialize cursor from DB if exists
        try {
            const cursor = await prisma_1.prisma.indexerCursor.findFirst({ where: { id: 1 } });
            if (cursor && Number(cursor.lastRound) > 0) {
                this.lastBlock = Number(cursor.lastRound);
                console.log(`[Indexer] Resuming from saved round: ${this.lastBlock}`);
            }
        }
        catch (err) {
            console.error('[Indexer] DATABASE CONNECTION ERROR: Could not load cursor. Please check your database connection.');
            console.warn('[Indexer] Continuing with cursor = current tip to allow partial functionality...');
        }
        // One-time sync of current on-chain state
        console.log('🔄 Syncing existing agents from blockchain boxes...');
        try {
            await this.syncExistingAgents();
            console.log('✅ Initial Sync completed. Switching to LIVE block polling...');
            // Start the polling loop
            this.poll();
        }
        catch (error) {
            console.error('[Indexer] Sync/Polling loop crashed:', error);
        }
    }
    async poll() {
        while (this.isRunning) {
            try {
                const status = await contracts_1.algorand.client.algod.status().do();
                const currentRound = Number(status['last-round']);
                // If this is first run and lastBlock is 0, start from current tip
                if (this.lastBlock === 0) {
                    this.lastBlock = currentRound;
                }
                while (this.lastBlock < currentRound) {
                    this.lastBlock++;
                    await this.processBlock(this.lastBlock);
                    try {
                        // Update cursor in DB
                        await prisma_1.prisma.indexerCursor.upsert({
                            where: { id: 1 },
                            update: { lastRound: BigInt(this.lastBlock) },
                            create: { id: 1, lastRound: BigInt(this.lastBlock) }
                        });
                    }
                    catch (dbErr) {
                        console.error(`[Indexer] Failed to update cursor in DB at round ${this.lastBlock}:`, dbErr.message);
                    }
                }
            }
            catch (err) {
                console.error('[Indexer] Polling error:', err);
            }
            // Wait 2 seconds before next poll (Algorand block time is ~2.8s-3.3s)
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    async processBlock(round) {
        try {
            // Fetch block with 'msgpack' format (standard for SDK v3)
            const blockResponse = await contracts_1.algorand.client.algod.block(round).do();
            // Handle different block structures depending on node/SDK version
            const txns = blockResponse?.block?.txns || blockResponse?.block?.transactions || [];
            for (const txn of txns) {
                try {
                    // Extract transaction data - handle both msgpack and JSON-like structures
                    const dt = txn.txn || txn;
                    if (dt.type === 'appl') {
                        const appId = dt.apid || dt.apaid || 0;
                        if (Number(appId) === this.registryAppId) {
                            await this.handleRegistryCall(txn);
                        }
                        else if (Number(appId) === this.escrowAppId) {
                            await this.handleEscrowCall(txn);
                        }
                    }
                }
                catch (txnErr) {
                    console.error(`[Indexer] Error parsing transaction in block ${round}:`, txnErr);
                }
            }
        }
        catch (e) {
            console.error(`[Indexer] Error processing block ${round}:`, e);
        }
    }
    async handleRegistryCall(txn) {
        // Handle both possible locations for apaa depending on how block was decoded
        const apaa = txn.txn?.apaa || txn.apaa;
        if (!apaa || apaa.length === 0)
            return;
        const selector = Buffer.from(apaa[0]).toString('hex');
        const method = getMethod(DojoRegistryClient_1.APP_SPEC, selector);
        if (!method)
            return;
        try {
            const abiMethod = new algosdk_1.default.ABIMethod(method);
            // Ensure args are Uint8Arrays for decodeMethodArgs
            const args = abiMethod.decodeMethodArgs(apaa.slice(1).map((a) => new Uint8Array(a)));
            if (method.name === 'register_agent') {
                const [agentId, sensei, lane, configHash] = args;
                const agentIdStr = typeof agentId === 'string' ? agentId : Buffer.from(agentId).toString('utf-8');
                const senseiAddr = sensei.toString();
                console.log(`[Indexer] Processing Registration: ${agentIdStr}...`);
                const agent = await prisma_1.prisma.agent.upsert({
                    where: { id: agentIdStr },
                    update: {
                        status: types_1.AgentStatus.ACTIVE,
                        lane: this.mapLane(Number(lane)),
                        configHash: Buffer.from(configHash).toString('hex')
                    },
                    create: {
                        id: agentIdStr,
                        address: agentIdStr,
                        senseiAddress: senseiAddr,
                        lane: this.mapLane(Number(lane)),
                        configHash: Buffer.from(configHash).toString('hex'),
                        status: types_1.AgentStatus.ACTIVE,
                        tasksCompleted: BigInt(0),
                        totalEarnedUsdc: BigInt(0)
                    }
                });
                console.log(`[Indexer] ✅ Registered Agent: ${agentIdStr} (Sensei: ${senseiAddr})`);
                this.broadcastEvent('AGENT_REGISTERED', agent);
            }
            else if (method.name === 'update_status') {
                const [agentId, active] = args;
                const agentIdStr = typeof agentId === 'string' ? agentId : Buffer.from(agentId).toString('utf-8');
                const agent = await prisma_1.prisma.agent.update({
                    where: { id: agentIdStr },
                    data: { status: active ? types_1.AgentStatus.ACTIVE : types_1.AgentStatus.INACTIVE }
                });
                console.log(`[Indexer] Status Updated: ${agentIdStr} -> ${active ? 'ACTIVE' : 'INACTIVE'}`);
                this.broadcastEvent('AGENT_STATUS_UPDATED', agent);
            }
        }
        catch (e) {
            console.error('[Indexer] Registry decode error:', e.message || e);
        }
    }
    async handleEscrowCall(txn) {
        const apaa = txn.txn?.apaa || txn.apaa;
        if (!apaa || apaa.length === 0)
            return;
        const selector = Buffer.from(apaa[0]).toString('hex');
        const method = getMethod(EscrowVaultClient_1.APP_SPEC, selector);
        if (!method)
            return;
        try {
            const abiMethod = new algosdk_1.default.ABIMethod(method);
            const args = abiMethod.decodeMethodArgs(apaa.slice(1).map((a) => new Uint8Array(a)));
            if (method.name === 'lock_bounty') {
                const [taskId, client, worker, bounty, collateral, deadline] = args;
                const taskIdStr = typeof taskId === 'string' ? taskId : Buffer.from(taskId).toString('utf-8');
                console.log(`[Indexer] Processing Task Lock: ${taskIdStr}...`);
                const task = await prisma_1.prisma.task.upsert({
                    where: { id: taskIdStr },
                    update: {
                        state: types_1.TaskState.LOCKED,
                        bountyUsdc: BigInt(bounty.toString()),
                        collateralUsdc: BigInt(collateral.toString()),
                        clientAddress: client.toString(),
                        workerAddress: worker.toString(),
                        deadline: new Date(Number(deadline) * 1000)
                    },
                    create: {
                        id: taskIdStr,
                        state: types_1.TaskState.LOCKED,
                        bountyUsdc: BigInt(bounty.toString()),
                        collateralUsdc: BigInt(collateral.toString()),
                        clientAddress: client.toString(),
                        workerAddress: worker.toString(),
                        lane: types_1.LaneType.RESEARCH, // Default
                        deadline: new Date(Number(deadline) * 1000)
                    }
                });
                console.log(`[Indexer] ✅ Task Locked: ${taskIdStr} (Worker: ${worker.toString()})`);
                this.broadcastEvent('TASK_LOCKED', task);
                // Trigger Agent Execution!
                if (task.agentId && task.workerAddress) {
                    console.log(`[Indexer] Triggering execution for Task ${task.id} on Agent ${task.agentId}`);
                    executionManager_1.ExecutionManager.startAgentForTask(task.agentId, task.id, {
                        taskId: task.id,
                        lane: task.lane,
                        bountyUsdc: task.bountyUsdc.toString()
                    }).catch(err => console.error(`[Indexer] Failed to start agent for task ${task.id}:`, err));
                }
            }
            else if (method.name === 'release_payment') {
                const [taskId] = args;
                const taskIdStr = typeof taskId === 'string' ? taskId : Buffer.from(taskId).toString('utf-8');
                const task = await prisma_1.prisma.task.update({
                    where: { id: taskIdStr },
                    data: { state: types_1.TaskState.SETTLED, settledAt: new Date() }
                });
                console.log(`[Indexer] ✅ Payment Released for Task: ${taskIdStr}`);
                this.broadcastEvent('TASK_SETTLED', task);
            }
        }
        catch (e) {
            console.error('[Indexer] Escrow decode error:', e.message || e);
        }
    }
    mapLane(lane) {
        const lanes = [types_1.LaneType.RESEARCH, types_1.LaneType.CODE, types_1.LaneType.DATA, types_1.LaneType.OUTREACH];
        return lanes[lane] || types_1.LaneType.RESEARCH;
    }
    broadcastEvent(type, payload) {
        const serialized = JSON.parse(JSON.stringify(payload, (_, v) => typeof v === 'bigint' ? v.toString() : v));
        (0, socket_1.broadcast)(type, { ...serialized, timestamp: new Date() });
    }
    async syncExistingAgents() {
        try {
            const registryAppId = BigInt(this.registryAppId);
            const boxesResponse = await contracts_1.algorand.client.algod.getApplicationBoxes(registryAppId).do();
            for (const boxInfo of boxesResponse.boxes) {
                try {
                    const agentId = Buffer.from(boxInfo.name).toString('utf-8');
                    const boxData = await contracts_1.algorand.client.algod.getApplicationBoxByName(registryAppId, boxInfo.name).do();
                    const value = boxData.value;
                    if (value.length >= 89) {
                        const senseiAddr = algosdk_1.default.encodeAddress(value.slice(0, 32));
                        const laneRaw = Number(algosdk_1.default.decodeUint64(value.slice(32, 40), 'safe'));
                        const statusRaw = value[40];
                        const configHash = Buffer.from(value.slice(41, 73)).toString('hex');
                        const tasksCompleted = algosdk_1.default.decodeUint64(value.slice(73, 81), 'bigint');
                        await prisma_1.prisma.agent.upsert({
                            where: { id: agentId },
                            update: {
                                address: agentId, // agentId is the unique identifier
                                status: statusRaw === 1 ? types_1.AgentStatus.ACTIVE : types_1.AgentStatus.INACTIVE,
                                lane: this.mapLane(laneRaw),
                                configHash,
                                tasksCompleted: BigInt(tasksCompleted),
                                totalEarnedUsdc: BigInt(0)
                            },
                            create: {
                                id: agentId,
                                address: agentId,
                                senseiAddress: senseiAddr,
                                status: statusRaw === 1 ? types_1.AgentStatus.ACTIVE : types_1.AgentStatus.INACTIVE,
                                lane: this.mapLane(laneRaw),
                                configHash,
                                tasksCompleted: BigInt(tasksCompleted),
                                totalEarnedUsdc: BigInt(0)
                            }
                        });
                        (0, socket_1.broadcast)('AGENT_REGISTERED', {
                            address: senseiAddr,
                            agentId: agentId,
                            lane: laneRaw,
                            status: statusRaw,
                            configHash
                        });
                    }
                }
                catch (err) {
                    console.error(`[Indexer] Error syncing box ${Buffer.from(boxInfo.name).toString('hex')}:`, err);
                }
            }
        }
        catch (e) {
            console.error('[Indexer] Sync failed:', e);
        }
    }
    stop() {
        this.isRunning = false;
    }
}
exports.IndexerListener = IndexerListener;
