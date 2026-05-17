export interface ValidationInput {
  output: string;
  task: {
    description: string;
    lane: string;
    title: string;
  };
}

export interface ValidationOutput {
  score: number;
  issues: string[];
  decision: 'auto-approve' | 'flag' | 'retry';
  details: {
    ruleCheckPassed: boolean;
    llmScore?: number;
    laneChecksPassed: number;
    totalLaneChecks: number;
  };
}

export class ResolutionAgent {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || '';
  }

  async validate(input: ValidationInput): Promise<ValidationOutput> {
    const { output, task } = input;
    
    const ruleResult = this.runRuleChecks(output);
    const laneResult = this.runLaneChecks(output, task.lane);
    
    let llmScore: number | undefined;
    let llmFailed = false;
    
    if (ruleResult.passed && laneResult.passed) {
      try {
        llmScore = await this.llmJudgeScore(output, task.description, task.lane);
      } catch (error) {
        console.warn('[ResolutionAgent] LLM scoring failed, using fallback:', error);
        llmFailed = true;
      }
    }

    return this.calculateFinal(ruleResult, laneResult, llmScore, llmFailed);
  }

  private runRuleChecks(output: string): { passed: boolean; issues: string[]; score: number } {
    const issues: string[] = [];
    let score = 4;

    if (!output || output.trim().length === 0) {
      issues.push('empty_output');
      score = 0;
      return { passed: false, issues, score };
    }

    const length = output.trim().length;
    if (length < 50) {
      issues.push('too_short');
      score -= 2;
    } else if (length > 50000) {
      issues.push('too_long');
      score -= 1;
    } else {
      score += 1;
    }

    const errorKeywords = ['error', 'failed', 'exception', 'crash', 'cannot', 'unable to'];
    const hasErrorKeywords = errorKeywords.some(kw => output.toLowerCase().includes(kw));
    if (hasErrorKeywords) {
      const hasActualError = output.toLowerCase().includes('error:') || 
                             output.toLowerCase().includes('failed:');
      if (hasActualError) {
        issues.push('contains_error');
        score -= 2;
      }
    }

    const languageCheck = this.checkLanguageMatch(output, '');
    if (!languageCheck.matches) {
      issues.push('language_mismatch');
      score -= 1;
    }

    return {
      passed: score >= 2,
      issues,
      score: Math.max(0, Math.min(4, score))
    };
  }

  private runLaneChecks(output: string, lane: string): { passed: boolean; issues: string[]; score: number; total: number } {
    const issues: string[] = [];
    let score = 0;
    let total = 0;

    switch (lane) {
      case 'RESEARCH':
        total = 5;
        const hasCitations = /\[?\d+\]?|\(source|from:|according to/i.test(output);
        if (hasCitations) { score += 2; }
        else { issues.push('no_citations'); }

        const hasStructure = /#{1,3}|[-*•]|\d+\.|\n\n/.test(output);
        if (hasStructure) { score += 1; }
        else { issues.push('no_structure'); }

        const answerMatches = output.toLowerCase().length > 100;
        if (answerMatches) { score += 2; }
        break;

      case 'CODE':
        total = 5;
        const hasCodeBlock = /```[\s\S]*```/.test(output) || /function|const|let|var|import|export|def |class /i.test(output);
        if (hasCodeBlock) { score += 2; }
        else { issues.push('no_code_found'); }

        const hasComments = /\/\/ |# |\/\*|\*\/|"""'''/.test(output);
        if (hasComments) { score += 1; }

        const hasPlaceholders = /TODO|FIXME|XXX|HACK/i.test(output);
        if (hasPlaceholders) {
          issues.push('has_placeholders');
          score -= 1;
        } else {
          score += 2;
        }
        break;

      case 'DATA':
        total = 5;
        const hasJsonOrCsv = /\{.*\}|\[.*\]|,/.test(output);
        if (hasJsonOrCsv) { score += 3; }
        else { issues.push('invalid_format'); }

        const hasHeaders = /^"?\w+"?[,|]/m.test(output);
        if (hasHeaders) { score += 1; }
        else { issues.push('no_headers'); }

        const hasNulls = /null|undefined|N\/A|none/i.test(output);
        if (hasNulls) { score -= 1; }
        break;

      case 'OUTREACH':
        total = 5;
        const outLength = output.length;
        if (outLength > 0 && outLength < 500) { score += 2; }
        else if (outLength > 500) { issues.push('too_long'); score += 1; }

        const hasCTA = /click|sign up|visit|call|contact|join|register/i.test(output);
        if (hasCTA) { score += 2; }
        else { issues.push('no_call_to_action'); }

        const hasProfessionalTone = !/(lol|lmao|omg|wtf|damn)/i.test(output);
        if (hasProfessionalTone) { score += 1; }
        else { issues.push('unprofessional_tone'); }

        const hasSpamKeywords = /buy now|act now|limited time|free money|winner|prize/i.test(output);
        if (hasSpamKeywords) {
          issues.push('spam_keywords');
          score -= 2;
        }
        break;

      default:
        total = 3;
        if (output.trim().length > 50) { score = 2; }
    }

    return {
      passed: issues.length < 2,
      issues,
      score: Math.max(0, score),
      total
    };
  }

  private async llmJudgeScore(output: string, description: string, lane: string): Promise<number> {
    if (!this.openaiApiKey) {
      console.warn('[ResolutionAgent] No API key configured, using fallback scoring');
      return 5;
    }

    const prompt = `You are a quality reviewer. Rate this AI output 1-10 for:
- Completeness: Did it fully answer the request?
- Accuracy: Are the facts and logic correct?
- Quality: Is it well-structured and professional?

Task description: ${description.substring(0, 200)}
Lane: ${lane}

Output to review:
${output.substring(0, 1000)}

Respond with ONLY a JSON object:
{"score": X, "issues": ["issue1", "issue2"]}
Score 8-10 = excellent, 5-7 = average, below 5 = poor.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API failed: ${response.status}`);
    }

    const data = await response.json() as any;
    const content = data.choices[0]?.message?.content || '{"score": 5, "issues": []}';

    try {
      const parsed = JSON.parse(content);
      return Math.max(0, Math.min(10, parsed.score || 5));
    } catch {
      return 5;
    }
  }

  private calculateFinal(
    ruleResult: { passed: boolean; issues: string[]; score: number },
    laneResult: { passed: boolean; issues: string[]; score: number; total: number },
    llmScore?: number,
    llmFailed?: boolean
  ): ValidationOutput {
    const allIssues = [...ruleResult.issues, ...laneResult.issues];

    let finalScore: number;
    let decision: 'auto-approve' | 'flag' | 'retry';

    if (llmScore !== undefined) {
      finalScore = Math.round((ruleResult.score * 2 + laneResult.score + llmScore) / 4);
    } else {
      const maxPossible = 4 + laneResult.total;
      finalScore = Math.round(((ruleResult.score + laneResult.score) / maxPossible) * 10);
    }

    finalScore = Math.max(0, Math.min(10, finalScore));

    if (finalScore >= 8) {
      decision = 'auto-approve';
    } else if (finalScore >= 5) {
      decision = 'flag';
    } else {
      decision = 'retry';
    }

    return {
      score: finalScore,
      issues: allIssues,
      decision,
      details: {
        ruleCheckPassed: ruleResult.passed,
        llmScore,
        laneChecksPassed: laneResult.score,
        totalLaneChecks: laneResult.total
      }
    };
  }

  private checkLanguageMatch(output: string, expected: string): { matches: boolean; detected?: string } {
    const englishChars = /[a-zA-Z]/.test(output) ? output.match(/[a-zA-Z]/g)?.length || 0 : 0;
    const totalChars = output.length;
    
    if (englishChars / totalChars > 0.5) {
      return { matches: true, detected: 'en' };
    }
    
    return { matches: true };
  }
}

export const resolutionAgent = new ResolutionAgent();