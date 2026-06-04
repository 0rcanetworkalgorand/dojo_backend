/**
 * Unit tests for the AuctionService.
 * Tests bid lifecycle: starting auctions, accepting bids, and bid rejection.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuctionService } from '../../src/services/AuctionService';

// Mock prisma and socket
vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    task: { update: vi.fn().mockResolvedValue({}) },
  },
}));
vi.mock('../../src/lib/socket', () => ({
  broadcast: vi.fn(),
}));

describe('AuctionService', () => {
  let service: AuctionService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new AuctionService();
  });

  describe('startAuction', () => {
    it('creates an auction that accepts bids', () => {
      service.startAuction('task-1');
      const result = service.addBid('task-1', {
        agentId: 'agent-1',
        bidAmountUsdc: BigInt(5000000),
        workerAddress: 'ALGO_ADDRESS_1',
      });
      expect(result).toBe(true);
    });
  });

  describe('addBid', () => {
    it('accepts bids on active auctions', () => {
      service.startAuction('task-2');
      const result = service.addBid('task-2', {
        agentId: 'agent-1',
        bidAmountUsdc: BigInt(5000000),
        workerAddress: 'ALGO_ADDRESS_1',
      });
      expect(result).toBe(true);
    });

    it('accepts multiple bids', () => {
      service.startAuction('task-3');
      const bid1 = service.addBid('task-3', {
        agentId: 'agent-1',
        bidAmountUsdc: BigInt(5000000),
        workerAddress: 'ADDR_1',
      });
      const bid2 = service.addBid('task-3', {
        agentId: 'agent-2',
        bidAmountUsdc: BigInt(3000000),
        workerAddress: 'ADDR_2',
      });
      expect(bid1).toBe(true);
      expect(bid2).toBe(true);
    });

    it('rejects bids on non-existent auctions', () => {
      const result = service.addBid('nonexistent', {
        agentId: 'agent-1',
        bidAmountUsdc: BigInt(5000000),
        workerAddress: 'ALGO_ADDRESS_1',
      });
      expect(result).toBe(false);
    });

    it('rejects bids after auction ends', async () => {
      service.startAuction('task-4');
      
      // Advance time past auction duration (30s)
      await vi.advanceTimersByTimeAsync(31000);
      
      const result = service.addBid('task-4', {
        agentId: 'agent-1',
        bidAmountUsdc: BigInt(5000000),
        workerAddress: 'ADDR_1',
      });
      expect(result).toBe(false);
    });
  });

  describe('endAuction (via timeout)', () => {
    it('selects lowest bidder as winner', async () => {
      const { prisma } = await import('../../src/lib/prisma');
      
      service.startAuction('task-5');
      service.addBid('task-5', {
        agentId: 'agent-expensive',
        bidAmountUsdc: BigInt(10000000),
        workerAddress: 'ADDR_EXP',
      });
      service.addBid('task-5', {
        agentId: 'agent-cheap',
        bidAmountUsdc: BigInt(2000000),
        workerAddress: 'ADDR_CHEAP',
      });

      await vi.advanceTimersByTimeAsync(31000);

      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'task-5' },
          data: expect.objectContaining({
            agentId: 'agent-cheap',
            workerAddress: 'ADDR_CHEAP',
          }),
        })
      );
    });

    it('broadcasts event when no bids received', async () => {
      const { broadcast } = await import('../../src/lib/socket');
      
      service.startAuction('task-6');
      await vi.advanceTimersByTimeAsync(31000);

      expect(broadcast).toHaveBeenCalledWith('AUCTION_ENDED', {
        taskId: 'task-6',
        winner: null,
        reason: 'NO_BIDS',
      });
    });
  });
});
