"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexerListener = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const client_1 = require("@prisma/client");
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
            console.warn('[Indexer] Could not load cursor, starting from current tip');
        }
        // One-time sync of current on-chain state
        console.log('🔄 Syncing existing agents from blockchain boxes...');
        try {
            await this.syncExistingAgents();
            console.log('✅ Initial Sync completed. Indexer in SLEEP mode to preserve connections.');
            // Prevent further polling to save connections
            while (true) {
                await new Promise(r => setTimeout(r, 3600000));
            }
        }
        catch (error) {
            console.error('[Indexer] Sync/Polling loop crashed:', error);
        }
    }
    async processBlock(round) {
        try {
            const blockResponse = await contracts_1.algorand.client.algod.block(round).do();
            const txns = blockResponse.block.txns || [];
            for (const txn of txns) {
                const dt = txn.txn;
                if (dt.type === 'appl') {
                    const appId = dt.apid || 0;
                    if (Number(appId) === this.registryAppId) {
                        await this.handleRegistryCall(txn);
                    }
                    else if (Number(appId) === this.escrowAppId) {
                        await this.handleEscrowCall(txn);
                    }
                }
            }
        }
        catch (e) {
            console.error(`[Indexer] Error processing block ${round}:`, e);
        }
    }
    async handleRegistryCall(txn) {
        const apaa = txn.txn.apaa;
        if (!apaa || apaa.length === 0)
            return;
        const selector = Buffer.from(apaa[0]).toString('hex');
        const method = getMethod(DojoRegistryClient_1.APP_SPEC, selector);
        if (!method)
            return;
        try {
            const abiMethod = new algosdk_1.default.ABIMethod(method);
            const args = abiMethod.decodeMethodArgs(apaa.slice(1).map((a) => new Uint8Array(a)));
            if (method.name === 'register_agent') {
                const [agentId, sensei, lane, configHash] = args;
                const agent = await prisma_1.prisma.agent.upsert({
                    where: { address: sensei.toString() },
                    update: {
                        status: client_1.AgentStatus.ACTIVE,
                        lane: this.mapLane(Number(lane)),
                        configHash: Buffer.from(configHash).toString('hex')
                    },
                    create: {
                        id: agentId.toString(),
                        address: sensei.toString(),
                        senseiAddress: sensei.toString(),
                        lane: this.mapLane(Number(lane)),
                        configHash: Buffer.from(configHash).toString('hex'),
                        status: client_1.AgentStatus.ACTIVE
                    }
                });
                this.broadcastEvent('AGENT_REGISTERED', agent);
            }
            else if (method.name === 'update_status') {
                const [agentId, active] = args;
                const agent = await prisma_1.prisma.agent.update({
                    where: { id: agentId.toString() },
                    data: { status: active ? client_1.AgentStatus.ACTIVE : client_1.AgentStatus.INACTIVE }
                });
                this.broadcastEvent('AGENT_STATUS_UPDATED', agent);
            }
        }
        catch (e) {
            console.error('[Indexer] Registry decode error:', e);
        }
    }
    async handleEscrowCall(txn) {
        const apaa = txn.txn.apaa;
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
                const task = await prisma_1.prisma.task.upsert({
                    where: { id: taskId.toString() },
                    update: {
                        state: client_1.TaskState.LOCKED,
                        bountyUsdc: BigInt(bounty.toString()),
                        collateralUsdc: BigInt(collateral.toString()),
                        clientAddress: client.toString(),
                        workerAddress: worker.toString(),
                        deadline: new Date(Number(deadline) * 1000)
                    },
                    create: {
                        id: taskId.toString(),
                        state: client_1.TaskState.LOCKED,
                        bountyUsdc: BigInt(bounty.toString()),
                        collateralUsdc: BigInt(collateral.toString()),
                        clientAddress: client.toString(),
                        workerAddress: worker.toString(),
                        lane: client_1.LaneType.RESEARCH, // Default
                        deadline: new Date(Number(deadline) * 1000)
                    }
                });
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
                const task = await prisma_1.prisma.task.update({
                    where: { id: taskId.toString() },
                    data: { state: client_1.TaskState.SETTLED, settledAt: new Date() }
                });
                this.broadcastEvent('TASK_SETTLED', task);
            }
        }
        catch (e) {
            console.error('[Indexer] Escrow decode error:', e);
        }
    }
    mapLane(lane) {
        const lanes = [client_1.LaneType.RESEARCH, client_1.LaneType.CODE, client_1.LaneType.DATA, client_1.LaneType.OUTREACH];
        return lanes[lane] || client_1.LaneType.RESEARCH;
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
                            where: { address: senseiAddr },
                            update: {
                                status: statusRaw === 1 ? client_1.AgentStatus.ACTIVE : client_1.AgentStatus.INACTIVE,
                                lane: this.mapLane(laneRaw),
                                configHash,
                                tasksCompleted: BigInt(tasksCompleted),
                                totalEarnedUsdc: BigInt(0)
                            },
                            create: {
                                id: agentId,
                                address: senseiAddr,
                                senseiAddress: senseiAddr,
                                status: statusRaw === 1 ? client_1.AgentStatus.ACTIVE : client_1.AgentStatus.INACTIVE,
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
