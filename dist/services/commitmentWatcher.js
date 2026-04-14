"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCommitmentWatcher = void 0;
const prisma_1 = require("../lib/prisma");
const contracts_1 = require("../algorand/contracts");
const types_1 = require("../lib/types");
const startCommitmentWatcher = () => {
    // Check for expired commitments every 12 hours
    setInterval(async () => {
        console.log('[CommitmentWatcher] Running identity expiry check...');
        // 1. Find natural expirations (lockExpiry passed and still ACTIVE)
        const expiredCommitments = await prisma_1.prisma.commitment.findMany({
            where: {
                status: types_1.CommitmentStatus.ACTIVE,
                lockExpiry: {
                    lt: new Date()
                }
            },
            include: { agent: true }
        });
        for (const commitment of expiredCommitments) {
            console.log(`[CommitmentWatcher] Commitment ${commitment.id} expired for agent ${commitment.agent.address}. Delisting...`);
            try {
                // Trigger on-chain delisting
                await contracts_1.registryClient.send.delistAgent({
                    args: { agentId: commitment.agentId }
                });
                // Update database states
                await prisma_1.prisma.$transaction([
                    prisma_1.prisma.commitment.update({
                        where: { id: commitment.id },
                        data: { status: types_1.CommitmentStatus.EXPIRED }
                    }),
                    prisma_1.prisma.agent.update({
                        where: { id: commitment.agentId },
                        data: { status: types_1.AgentStatus.INACTIVE }
                    })
                ]);
                console.log(`[CommitmentWatcher] Successfully delisted ${commitment.agent.address}`);
            }
            catch (err) {
                console.error(`[CommitmentWatcher] Failed to delist ${commitment.id}:`, err);
            }
        }
        // 2. Task Expiry (Optional, but good for cleanup)
        const staleTasks = await prisma_1.prisma.task.findMany({
            where: {
                state: 'LOCKED',
                deadline: { lt: new Date() }
            }
        });
        for (const task of staleTasks) {
            console.log(`[CommitmentWatcher] Task ${task.id} deadline passed. Suggesting slash...`);
            // Note: Slashing usually requires admin signature, similar to VerificationService
        }
    }, 12 * 60 * 60 * 1000);
};
exports.startCommitmentWatcher = startCommitmentWatcher;
