/**
 * Unit tests for the type system and enum definitions.
 * Ensures all enums have the correct values and are used consistently.
 */
import { describe, it, expect } from 'vitest';
import { LaneType, AgentStatus, TaskState, CommitmentStatus, RecipientRole } from '../../src/lib/types';

describe('Type Definitions', () => {
  describe('LaneType', () => {
    it('has exactly 4 lanes', () => {
      const lanes = Object.values(LaneType);
      expect(lanes).toHaveLength(4);
    });

    it('contains all expected lanes', () => {
      expect(LaneType.RESEARCH).toBe('RESEARCH');
      expect(LaneType.CODE).toBe('CODE');
      expect(LaneType.DATA).toBe('DATA');
      expect(LaneType.OUTREACH).toBe('OUTREACH');
    });
  });

  describe('AgentStatus', () => {
    it('has exactly 4 statuses', () => {
      const statuses = Object.values(AgentStatus);
      expect(statuses).toHaveLength(4);
    });

    it('contains all expected statuses', () => {
      expect(AgentStatus.INACTIVE).toBe('INACTIVE');
      expect(AgentStatus.ACTIVE).toBe('ACTIVE');
      expect(AgentStatus.LISTED).toBe('LISTED');
      expect(AgentStatus.SUSPENDED).toBe('SUSPENDED');
    });
  });

  describe('TaskState', () => {
    it('has exactly 6 states', () => {
      const states = Object.values(TaskState);
      expect(states).toHaveLength(6);
    });

    it('contains all lifecycle states', () => {
      expect(TaskState.CREATED).toBe('CREATED');
      expect(TaskState.LOCKED).toBe('LOCKED');
      expect(TaskState.SUBMITTED).toBe('SUBMITTED');
      expect(TaskState.VERIFIED).toBe('VERIFIED');
      expect(TaskState.SETTLED).toBe('SETTLED');
      expect(TaskState.SLASHED).toBe('SLASHED');
    });

    it('follows the correct state machine order', () => {
      const expectedOrder = ['CREATED', 'LOCKED', 'SUBMITTED', 'VERIFIED', 'SETTLED', 'SLASHED'];
      const actualValues = Object.values(TaskState);
      expect(actualValues).toEqual(expectedOrder);
    });
  });

  describe('CommitmentStatus', () => {
    it('has exactly 4 statuses', () => {
      expect(Object.values(CommitmentStatus)).toHaveLength(4);
    });

    it('contains expected values', () => {
      expect(CommitmentStatus.ACTIVE).toBe('ACTIVE');
      expect(CommitmentStatus.RELEASED_CLEAN).toBe('RELEASED_CLEAN');
      expect(CommitmentStatus.RELEASED_EARLY).toBe('RELEASED_EARLY');
      expect(CommitmentStatus.EXPIRED).toBe('EXPIRED');
    });
  });

  describe('RecipientRole', () => {
    it('has exactly 4 roles', () => {
      expect(Object.values(RecipientRole)).toHaveLength(4);
    });

    it('contains expected values', () => {
      expect(RecipientRole.WORKER).toBe('WORKER');
      expect(RecipientRole.COLLABORATOR).toBe('COLLABORATOR');
      expect(RecipientRole.SENSEI).toBe('SENSEI');
      expect(RecipientRole.TREASURY).toBe('TREASURY');
    });
  });
});
