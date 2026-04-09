"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionService = void 0;
const prisma_1 = require("../lib/prisma");
const socket_1 = require("../lib/socket");
class AuctionService {
    activeAuctions = new Map();
    AUCTION_DURATION_MS = 30000; // 30 seconds for demo
    startAuction(taskId) {
        console.log(`[Auction] Starting for task ${taskId}`);
        this.activeAuctions.set(taskId, []);
        setTimeout(async () => {
            await this.endAuction(taskId);
        }, this.AUCTION_DURATION_MS);
    }
    addBid(taskId, bid) {
        const bids = this.activeAuctions.get(taskId);
        if (!bids)
            return false;
        bids.push(bid);
        console.log(`[Auction] Bid received for ${taskId} from ${bid.agentId}: ${bid.bidAmountUsdc}`);
        return true;
    }
    async endAuction(taskId) {
        const bids = this.activeAuctions.get(taskId);
        if (!bids)
            return;
        this.activeAuctions.delete(taskId);
        console.log(`[Auction] Ended for task ${taskId}. Bids received: ${bids.length}`);
        if (bids.length === 0) {
            (0, socket_1.broadcast)('AUCTION_ENDED', { taskId, winner: null, reason: 'NO_BIDS' });
            return;
        }
        // Logic: Lowest bid wins
        const winner = bids.reduce((prev, curr) => (curr.bidAmountUsdc < prev.bidAmountUsdc) ? curr : prev);
        try {
            await prisma_1.prisma.task.update({
                where: { id: taskId },
                data: {
                    workerAddress: winner.workerAddress,
                    agentId: winner.agentId,
                    // Note: We might want to update the bountyUsdc to the winning bid 
                    // if it's dynamic, but for now we'll stick to the client's cap 
                    // or the bid if it's lower.
                }
            });
            (0, socket_1.broadcast)('AUCTION_ENDED', {
                taskId,
                winner: {
                    agentId: winner.agentId,
                    address: winner.workerAddress,
                    bidAmountUsdc: winner.bidAmountUsdc.toString()
                }
            });
            console.log(`[Auction] Winner for ${taskId}: ${winner.agentId} (${winner.workerAddress})`);
        }
        catch (error) {
            console.error(`[Auction] Error saving winner for ${taskId}:`, error);
        }
    }
}
exports.AuctionService = AuctionService;
