import OpenAI from 'openai';
import { prisma } from '../lib/prisma';
import { AgentStatus } from '../lib/types';

const LANE_SYSTEM_PROMPT = `You are Rei, an intelligent agent selector for Swarm Dojo.
Your job is to analyze a task description and determine which
specialized AI agent lanes are needed to complete it.
The available lanes are:
- RESEARCH: gathering information, summarizing, competitive analysis
- CODE: writing code, debugging, building software components
- DATA: processing datasets, analysis, transformations
- OUTREACH: writing emails, messages, communication sequences

Rules:
- Select ONLY the lanes that are genuinely needed for this task
- Minimum 1 lane, maximum 4 lanes
- Do not select a lane unless the task clearly requires it
- Order the selected lanes by which should execute first (logical sequence)

Respond ONLY with a valid JSON object in this exact format:
{
  "lanes": ["RESEARCH", "CODE"],
  "reasoning": "This task needs research first to gather information, then code to implement the findings",
  "taskSummaryPerLane": {
    "RESEARCH": "specific sub-task for research agent",
    "CODE": "specific sub-task for code agent"
  }
}`;

function getOpenAIClient(): OpenAI {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    return new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1"
    });
}

function scoreAgent(
    tasksCompleted: bigint,
    tasksFailed: bigint
): { score: number; successRate: number } {
    const totalTasks = Number(tasksCompleted) + Number(tasksFailed);
    const successRate = totalTasks > 0
        ? Number(tasksCompleted) / totalTasks
        : 0.5;
    const taskCountWeight = Math.min(Number(tasksCompleted) / 100, 1.0);
    const score = (successRate * 0.7) + (taskCountWeight * 0.3);
    return { score, successRate };
}

export async function analyzeTask(description: string): Promise<{
    lanes: string[];
    reasoning: string;
    taskSummaryPerLane: Record<string, string>;
}> {
    const client = getOpenAIClient();

    try {
        const completion = await client.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            max_tokens: 500,
            temperature: 0.3,
            messages: [
                { role: 'system', content: LANE_SYSTEM_PROMPT },
                { role: 'user', content: description }
            ]
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn('[Rei] Failed to parse LLM response, defaulting to RESEARCH');
            return {
                lanes: ['RESEARCH'],
                reasoning: 'Could not determine lanes from description, defaulting to RESEARCH.',
                taskSummaryPerLane: { RESEARCH: description }
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            lanes: Array.isArray(parsed.lanes) ? parsed.lanes : ['RESEARCH'],
            reasoning: parsed.reasoning || '',
            taskSummaryPerLane: parsed.taskSummaryPerLane || {}
        };
    } catch (err) {
        console.error('[Rei] analyzeTask error:', err);
        return {
            lanes: ['RESEARCH'],
            reasoning: 'Analysis failed, defaulting to RESEARCH.',
            taskSummaryPerLane: { RESEARCH: description }
        };
    }
}

export interface SelectedAgent {
    agentAddress: string;
    senseiAddress: string;
    lane: string;
    score: number;
    successRate: number;
    tasksCompleted: bigint | string | number;
    tasksFailed: bigint | string | number;
    subTask: string;
    taskId?: string;
}

export async function selectBestAgents(lanes: string[]): Promise<SelectedAgent[]> {
    const results: SelectedAgent[] = [];

    for (const lane of lanes) {
        const candidates = await prisma.agent.findMany({
            where: {
                lane,
                status: { in: ['ACTIVE', 'LISTED'] }
            }
        });

        if (candidates.length === 0) {
            console.log(`[Rei] No agents found for lane: ${lane} — skipping`);
            continue;
        }

        const scored = candidates.map(candidate => {
            const { score, successRate } = scoreAgent(
                candidate.tasksCompleted,
                candidate.tasksFailed
            );
            return { candidate, score, successRate };
        });

        scored.sort((a, b) => b.score - a.score);
        const best = scored[0];

        console.log(`[Rei] Lane: ${lane} → Selected agent: ${best.candidate.address}`);
        console.log(`      Sensei wallet: ${best.candidate.senseiAddress}`);
        console.log(`      Score: ${best.score.toFixed(3)} | Success rate: ${best.successRate.toFixed(2)}`);
        console.log(`      Tasks completed: ${best.candidate.tasksCompleted}`);

        results.push({
            agentAddress: best.candidate.address,
            senseiAddress: best.candidate.senseiAddress,
            lane,
            score: best.score,
            successRate: best.successRate,
            tasksCompleted: best.candidate.tasksCompleted,
            tasksFailed: best.candidate.tasksFailed,
            subTask: ''
        });
    }

    return results;
}

export interface ReiRecommendation {
    analyzedLanes: string[];
    reasoning: string;
    selectedAgents: {
        agentAddress: string;
        senseiAddress: string;
        lane: string;
        score: number;
        successRate: number;
        tasksCompleted: string;
        tasksFailed: string;
        subTask: string;
        taskId: string;
    }[];
}

export async function getReiRecommendation(description: string): Promise<ReiRecommendation> {
    const analysis = await analyzeTask(description);
    const agentsWithSubtasks = await selectBestAgents(analysis.lanes);

    return {
        analyzedLanes: analysis.lanes,
        reasoning: analysis.reasoning,
        selectedAgents: agentsWithSubtasks.map(agent => ({
            agentAddress: agent.agentAddress,
            senseiAddress: agent.senseiAddress,
            lane: agent.lane,
            score: agent.score,
            successRate: agent.successRate,
            tasksCompleted: String(agent.tasksCompleted),
            tasksFailed: String(agent.tasksFailed),
            subTask: agent.subTask || analysis.taskSummaryPerLane[agent.lane] || description,
            taskId: agent.taskId || `T-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        }))
    };
}
