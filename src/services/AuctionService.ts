import { prisma } from '../lib/prisma';
import { broadcast } from '../lib/socket';

interface Bid {
    agentId: string;
    bidAmountUsdc: bigint;
    workerAddress: string;
}

export class AuctionService {
    private activeAuctions: Map<string, Bid[]> = new Map();
    private readonly AUCTION_DURATION_MS = 30000; // 30 seconds for demo

    public startAuction(taskId: string) {
        console.log(`[Auction] Starting for task ${taskId}`);
        this.activeAuctions.set(taskId, []);

        setTimeout(async () => {
            await this.endAuction(taskId);
        }, this.AUCTION_DURATION_MS);
    }

    public addBid(taskId: string, bid: Bid): boolean {
        const bids = this.activeAuctions.get(taskId);
        if (!bids) return false;

        bids.push(bid);
        console.log(`[Auction] Bid received for ${taskId} from ${bid.agentId}: ${bid.bidAmountUsdc}`);
        return true;
    }

    private async endAuction(taskId: string) {
        const bids = this.activeAuctions.get(taskId);
        if (!bids) return;

        this.activeAuctions.delete(taskId);
        console.log(`[Auction] Ended for task ${taskId}. Bids received: ${bids.length}`);

        if (bids.length === 0) {
            broadcast('AUCTION_ENDED', { taskId, winner: null, reason: 'NO_BIDS' });
            return;
        }

        // Logic: Lowest bid wins
        const winner = bids.reduce((prev, curr) => 
            (curr.bidAmountUsdc < prev.bidAmountUsdc) ? curr : prev
        );

        try {
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    workerAddress: winner.workerAddress,
                    agentId: winner.agentId,
                    // Note: We might want to update the bountyUsdc to the winning bid 
                    // if it's dynamic, but for now we'll stick to the client's cap 
                    // or the bid if it's lower.
                }
            });

            broadcast('AUCTION_ENDED', {
                taskId,
                winner: {
                    agentId: winner.agentId,
                    address: winner.workerAddress,
                    bidAmountUsdc: winner.bidAmountUsdc.toString()
                }
            });
            
            console.log(`[Auction] Winner for ${taskId}: ${winner.agentId} (${winner.workerAddress})`);
        } catch (error) {
            console.error(`[Auction] Error saving winner for ${taskId}:`, error);
        }
    }
}
