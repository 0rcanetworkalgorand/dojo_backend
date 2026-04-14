import algosdk from 'algosdk';
import { LaneType, AgentStatus, TaskState } from '../lib/types';
import { prisma } from '../lib/prisma';
import { algorand } from '../algorand/contracts';
import { ExecutionManager } from './executionManager';
import { APP_SPEC as REGISTRY_SPEC } from '../algorand/DojoRegistryClient';
import { APP_SPEC as ESCROW_SPEC } from '../algorand/EscrowVaultClient';
import { broadcast } from '../lib/socket';

// Helper to get ARC56 method by selector
const getMethod = (spec: any, selector: string) => {
    return spec.methods.find((m: any) => {
        const method = new algosdk.ABIMethod(m);
        return Buffer.from(method.getSelector()).toString('hex') === selector;
    });
};

export class IndexerListener {
    private registryAppId: number;
    private escrowAppId: number;
    private lastBlock: number = 0;
    private isRunning: boolean = false;

    constructor() {
        this.registryAppId = parseInt(process.env.DOJO_REGISTRY_APP_ID || '0');
        this.escrowAppId = parseInt(process.env.ESCROW_VAULT_APP_ID || '0');
    }

    public async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('🚀 Indexer Listener started (Polling Algod)');
        
        // 0. Initialize cursor from DB if exists
        try {
            const cursor = await prisma.indexerCursor.findFirst({ where: { id: 1 } });
            if (cursor && Number(cursor.lastRound) > 0) {
                this.lastBlock = Number(cursor.lastRound);
                console.log(`[Indexer] Resuming from saved round: ${this.lastBlock}`);
            }
        } catch (err) {
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
        } catch (error) {
            console.error('[Indexer] Sync/Polling loop crashed:', error);
        }
    }

    private async poll() {
        while (this.isRunning) {
            try {
                const status = await algorand.client.algod.status().do();
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
                        await prisma.indexerCursor.upsert({
                            where: { id: 1 },
                            update: { lastRound: BigInt(this.lastBlock) },
                            create: { id: 1, lastRound: BigInt(this.lastBlock) }
                        });
                    } catch (dbErr: any) {
                        console.error(`[Indexer] Failed to update cursor in DB at round ${this.lastBlock}:`, dbErr.message);
                    }
                }
            } catch (err) {
                console.error('[Indexer] Polling error:', err);
            }
            // Wait 2 seconds before next poll (Algorand block time is ~2.8s-3.3s)
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    private async processBlock(round: number) {
        try {
            // Fetch block with 'msgpack' format (standard for SDK v3)
            const blockResponse = await algorand.client.algod.block(round).do();
            
            // Handle different block structures depending on node/SDK version
            const txns = (blockResponse as any)?.block?.txns || (blockResponse as any)?.block?.transactions || [];

            for (const txn of txns) {
                try {
                    // Extract transaction data - handle both msgpack and JSON-like structures
                    const dt = txn.txn || txn;
                    if (dt.type === 'appl') {
                        const appId = dt.apid || dt.apaid || 0;
                        if (Number(appId) === this.registryAppId) {
                            await this.handleRegistryCall(txn);
                        } else if (Number(appId) === this.escrowAppId) {
                            await this.handleEscrowCall(txn);
                        }
                    }
                } catch (txnErr) {
                    console.error(`[Indexer] Error parsing transaction in block ${round}:`, txnErr);
                }
            }
        } catch (e) {
            console.error(`[Indexer] Error processing block ${round}:`, e);
        }
    }

    private async handleRegistryCall(txn: any) {
        // Handle both possible locations for apaa depending on how block was decoded
        const apaa = txn.txn?.apaa || txn.apaa;
        if (!apaa || apaa.length === 0) return;

        const selector = Buffer.from(apaa[0]).toString('hex');
        const method = getMethod(REGISTRY_SPEC, selector);
        if (!method) return;

        try {
            const abiMethod = new algosdk.ABIMethod(method);
            // Ensure args are Uint8Arrays for decodeMethodArgs
            const args = (abiMethod as any).decodeMethodArgs(apaa.slice(1).map((a: any) => new Uint8Array(a)));

            if (method.name === 'register_agent') {
                const [agentId, sensei, lane, configHash] = args;
                const agentIdStr = typeof agentId === 'string' ? agentId : Buffer.from(agentId as Uint8Array).toString('utf-8');
                const senseiAddr = sensei.toString();
                
                console.log(`[Indexer] Processing Registration: ${agentIdStr}...`);

                const agent = await prisma.agent.upsert({
                    where: { id: agentIdStr },
                    update: { 
                        status: AgentStatus.ACTIVE,
                        lane: this.mapLane(Number(lane)),
                        configHash: Buffer.from(configHash as Uint8Array).toString('hex')
                    },
                    create: {
                        id: agentIdStr,
                        address: agentIdStr,
                        senseiAddress: senseiAddr,
                        lane: this.mapLane(Number(lane)),
                        configHash: Buffer.from(configHash as Uint8Array).toString('hex'),
                        status: AgentStatus.ACTIVE,
                        tasksCompleted: BigInt(0),
                        totalEarnedUsdc: BigInt(0)
                    }
                });
                console.log(`[Indexer] ✅ Registered Agent: ${agentIdStr} (Sensei: ${senseiAddr})`);
                this.broadcastEvent('AGENT_REGISTERED', agent);
            } else if (method.name === 'update_status') {
                const [agentId, active] = args;
                const agentIdStr = typeof agentId === 'string' ? agentId : Buffer.from(agentId as Uint8Array).toString('utf-8');
                const agent = await prisma.agent.update({
                    where: { id: agentIdStr },
                    data: { status: active ? AgentStatus.ACTIVE : AgentStatus.INACTIVE }
                });
                console.log(`[Indexer] Status Updated: ${agentIdStr} -> ${active ? 'ACTIVE' : 'INACTIVE'}`);
                this.broadcastEvent('AGENT_STATUS_UPDATED', agent);
            }
        } catch (e: any) {
            console.error('[Indexer] Registry decode error:', e.message || e);
        }
    }

    private async handleEscrowCall(txn: any) {
        const apaa = txn.txn?.apaa || txn.apaa;
        if (!apaa || apaa.length === 0) return;

        const selector = Buffer.from(apaa[0]).toString('hex');
        const method = getMethod(ESCROW_SPEC, selector);
        if (!method) return;

        try {
            const abiMethod = new algosdk.ABIMethod(method);
            const args = (abiMethod as any).decodeMethodArgs(apaa.slice(1).map((a: any) => new Uint8Array(a)));

            if (method.name === 'lock_bounty') {
                const [taskId, client, worker, bounty, collateral, deadline] = args;
                const taskIdStr = typeof taskId === 'string' ? taskId : Buffer.from(taskId as Uint8Array).toString('utf-8');
                
                console.log(`[Indexer] Processing Task Lock: ${taskIdStr}...`);

                const task = await prisma.task.upsert({
                    where: { id: taskIdStr },
                    update: {
                        state: TaskState.LOCKED,
                        bountyUsdc: BigInt(bounty.toString()),
                        collateralUsdc: BigInt(collateral.toString()),
                        clientAddress: client.toString(),
                        workerAddress: worker.toString(),
                        deadline: new Date(Number(deadline) * 1000)
                    },
                    create: {
                        id: taskIdStr,
                        state: TaskState.LOCKED,
                        bountyUsdc: BigInt(bounty.toString()),
                        collateralUsdc: BigInt(collateral.toString()),
                        clientAddress: client.toString(),
                        workerAddress: worker.toString(),
                        lane: LaneType.RESEARCH, // Default
                        deadline: new Date(Number(deadline) * 1000)
                    }
                });
                console.log(`[Indexer] ✅ Task Locked: ${taskIdStr} (Worker: ${worker.toString()})`);
                this.broadcastEvent('TASK_LOCKED', task);

                // Trigger Agent Execution!
                if (task.agentId && task.workerAddress) {
                    console.log(`[Indexer] Triggering execution for Task ${task.id} on Agent ${task.agentId}`);
                    ExecutionManager.startAgentForTask(task.agentId, task.id, {
                        taskId: task.id,
                        lane: task.lane,
                        bountyUsdc: task.bountyUsdc.toString()
                    }).catch(err => console.error(`[Indexer] Failed to start agent for task ${task.id}:`, err));
                }
            } else if (method.name === 'release_payment') {
                const [taskId] = args;
                const taskIdStr = typeof taskId === 'string' ? taskId : Buffer.from(taskId as Uint8Array).toString('utf-8');
                
                // 1. Fetch task to get agent attribution
                const task = await prisma.task.findUnique({
                    where: { id: taskIdStr },
                    include: { agent: true }
                });

                if (task && task.state !== TaskState.SETTLED) {
                    console.log(`[Indexer] Processing Payment Release for Task: ${taskIdStr}...`);
                    
                    // 2. Update Task state
                    await prisma.task.update({
                        where: { id: taskIdStr },
                        data: { state: TaskState.SETTLED, settledAt: new Date() }
                    });

                    console.log(`[Indexer] ✅ Payment Released for Task: ${taskIdStr}`);
                    this.broadcastEvent('TASK_SETTLED', { ...task, state: TaskState.SETTLED });
                }
            }
        } catch (e: any) {
            console.error('[Indexer] Escrow decode error:', e.message || e);
        }
    }

    private mapLane(lane: number): LaneType {
        const lanes = [LaneType.RESEARCH, LaneType.CODE, LaneType.DATA, LaneType.OUTREACH];
        return lanes[lane] || LaneType.RESEARCH;
    }

    private broadcastEvent(type: string, payload: any) {
        const serialized = JSON.parse(JSON.stringify(payload, (_, v) => typeof v === 'bigint' ? v.toString() : v));
        broadcast(type, { ...serialized, timestamp: new Date() });
    }

    private async syncExistingAgents() {
        try {
            const registryAppId = BigInt(this.registryAppId);
            const boxesResponse = await algorand.client.algod.getApplicationBoxes(registryAppId).do();
            
            for (const boxInfo of boxesResponse.boxes) {
                try {
                    const agentId = Buffer.from(boxInfo.name).toString('utf-8');
                    const boxData = await algorand.client.algod.getApplicationBoxByName(registryAppId, boxInfo.name).do();
                    const value = boxData.value;

                    if (value.length >= 89) {
                        const senseiAddr = algosdk.encodeAddress(value.slice(0, 32));
                        const laneRaw = Number(algosdk.decodeUint64(value.slice(32, 40), 'safe'));
                        const statusRaw = value[40];
                        const configHash = Buffer.from(value.slice(41, 73)).toString('hex');
                        const tasksCompleted = algosdk.decodeUint64(value.slice(73, 81), 'bigint');
                        
                        await prisma.agent.upsert({
                            where: { id: agentId },
                            update: {
                                address: agentId, // agentId is the unique identifier
                                status: (statusRaw === 0 || statusRaw === 1) ? AgentStatus.ACTIVE : AgentStatus.INACTIVE,
                                lane: this.mapLane(laneRaw),
                                configHash,
                                tasksCompleted: BigInt(tasksCompleted),
                                totalEarnedUsdc: BigInt(0)
                            },
                            create: {
                                id: agentId,
                                address: agentId,
                                senseiAddress: senseiAddr,
                                status: (statusRaw === 0 || statusRaw === 1) ? AgentStatus.ACTIVE : AgentStatus.INACTIVE,
                                lane: this.mapLane(laneRaw),
                                configHash,
                                tasksCompleted: BigInt(tasksCompleted),
                                totalEarnedUsdc: BigInt(0)
                            }
                        });
                        broadcast('AGENT_REGISTERED', {
                            address: senseiAddr,
                            agentId: agentId,
                            lane: this.mapLane(laneRaw),
                            status: (statusRaw === 0 || statusRaw === 1) ? AgentStatus.ACTIVE : AgentStatus.INACTIVE,
                            configHash
                        });
                    }
                } catch (err) {
                    console.error(`[Indexer] Error syncing box ${Buffer.from(boxInfo.name).toString('hex')}:`, err);
                }
            }
        } catch (e) {
            console.error('[Indexer] Sync failed:', e);
        }
    }

    public stop() {
        this.isRunning = false;
    }
}
