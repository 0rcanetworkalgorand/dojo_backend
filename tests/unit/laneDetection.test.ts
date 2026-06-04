/**
 * Unit tests for the keyword-based lane detection logic.
 * Validates that task descriptions are correctly routed to the appropriate lane.
 */
import { describe, it, expect } from 'vitest';

// Replicate the lane detection logic from taskRoutes.ts for unit testing
const LANE_KEYWORDS: Record<string, string[]> = {
  RESEARCH: ['research', 'analyze', 'analysis', 'report', 'study', 'investigate', 'sentiment', 'market', 'trend', 'scrape', 'survey', 'insight', 'whitepaper', 'summarize', 'explore', 'review', 'audit'],
  CODE: ['code', 'build', 'develop', 'debug', 'deploy', 'smart contract', 'frontend', 'backend', 'api', 'fix', 'implement', 'refactor', 'test', 'program', 'software', 'typescript', 'python', 'solidity', 'rust'],
  DATA: ['data', 'dataset', 'etl', 'clean', 'visualize', 'chart', 'graph', 'statistics', 'model', 'pipeline', 'sql', 'csv', 'database', 'dashboard', 'metric', 'analytics'],
  OUTREACH: ['outreach', 'social', 'twitter', 'community', 'marketing', 'campaign', 'content', 'post', 'engagement', 'growth', 'brand', 'influencer', 'newsletter', 'discord', 'telegram'],
};

function detectLane(description: string): { lane: string; confidence: number; scores: Record<string, number> } {
  const lower = description.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [lane, keywords] of Object.entries(LANE_KEYWORDS)) {
    scores[lane] = keywords.reduce((sum, kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = lower.match(regex);
      return sum + (matches ? matches.length : 0);
    }, 0);
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topLane = sorted[0][0];
  const topScore = sorted[0][1];
  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const confidence = totalScore > 0 ? Math.round((topScore / totalScore) * 100) : 0;

  return { lane: topScore > 0 ? topLane : 'RESEARCH', confidence: topScore > 0 ? confidence : 25, scores };
}

describe('Lane Detection', () => {
  describe('RESEARCH lane', () => {
    it('detects research keywords', () => {
      const result = detectLane('Analyze the sentiment of Algorand community discussions');
      expect(result.lane).toBe('RESEARCH');
      expect(result.confidence).toBeGreaterThan(50);
    });

    it('detects market research tasks', () => {
      const result = detectLane('Research the DeFi market trends for Q1 2026');
      expect(result.lane).toBe('RESEARCH');
    });

    it('detects whitepaper summarization', () => {
      const result = detectLane('Summarize this whitepaper and provide key insights');
      expect(result.lane).toBe('RESEARCH');
    });
  });

  describe('CODE lane', () => {
    it('detects coding tasks', () => {
      const result = detectLane('Build a smart contract for token vesting on Algorand');
      expect(result.lane).toBe('CODE');
    });

    it('detects debugging tasks', () => {
      const result = detectLane('Debug the TypeScript compilation errors in my frontend');
      expect(result.lane).toBe('CODE');
    });

    it('detects API development', () => {
      const result = detectLane('Implement a REST API endpoint for user authentication');
      expect(result.lane).toBe('CODE');
    });
  });

  describe('DATA lane', () => {
    it('detects data processing tasks', () => {
      const result = detectLane('Clean this CSV dataset and visualize the statistics');
      expect(result.lane).toBe('DATA');
    });

    it('detects ETL tasks', () => {
      const result = detectLane('Build an ETL pipeline for our SQL database metrics');
      expect(result.lane).toBe('DATA');
    });

    it('detects analytics tasks', () => {
      const result = detectLane('Create a dashboard with analytics from our data model');
      expect(result.lane).toBe('DATA');
    });
  });

  describe('OUTREACH lane', () => {
    it('detects social media tasks', () => {
      const result = detectLane('Write a Twitter campaign for community engagement and growth');
      expect(result.lane).toBe('OUTREACH');
    });

    it('detects marketing tasks', () => {
      const result = detectLane('Create a newsletter for our Discord community outreach');
      expect(result.lane).toBe('OUTREACH');
    });

    it('detects content creation', () => {
      const result = detectLane('Post content about our brand on social media for engagement');
      expect(result.lane).toBe('OUTREACH');
    });
  });

  describe('Edge cases', () => {
    it('defaults to RESEARCH for empty-ish input', () => {
      const result = detectLane('do something cool');
      expect(result.lane).toBe('RESEARCH');
      expect(result.confidence).toBe(25);
    });

    it('handles mixed-lane descriptions', () => {
      const result = detectLane('Research and analyze data trends then build a chart');
      expect(result.confidence).toBeLessThan(80);
    });

    it('is case-insensitive', () => {
      const upper = detectLane('RESEARCH the MARKET TRENDS');
      const lower = detectLane('research the market trends');
      expect(upper.lane).toBe(lower.lane);
      expect(upper.confidence).toBe(lower.confidence);
    });
  });
});
