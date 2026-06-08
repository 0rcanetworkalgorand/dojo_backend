import { TaskExecutor } from './taskExecutor';

/**
 * ExecutionManager - Routes tasks to the appropriate execution path.
 * 
 * Simplified architecture (no Redis):
 *   - DIRECT mode (default): Backend's TaskExecutor handles everything via LLM APIs
 *   - HTTP mode: Backend calls the Python agent server over HTTP for lane-specific processing
 *   - SUBPROCESS mode: Legacy local dev — spawns Python process via stdin/stdout
 * 
 * Set AGENT_MODE env var:
 *   - 'direct' (default) — TaskExecutor does everything in-process
 *   - 'http' — Calls Python agent server at AGENT_SERVER_URL
 *   - 'subprocess' — Legacy local dev mode
 */

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || 'http://localhost:5000';

export class ExecutionManager {
  /**
   * Start task execution for an agent.
   */
  static async startAgentForTask(agentId: string, taskId: string, taskPayload: any) {
    const mode = process.env.AGENT_MODE || 'direct';

    if (mode === 'http') {
      // Production: Call the Python agent server over HTTP
      await this.callAgentServer(agentId, taskId, taskPayload);
    } else if (mode === 'subprocess') {
      // Legacy local dev: spawn Python subprocess
      await this.spawnLocalAgent(agentId, taskId, taskPayload);
    } else {
      // Direct mode: TaskExecutor handles everything (LLM API calls from Node.js)
      console.log(`[ExecutionManager] Direct execution for task ${taskId} (agent: ${agentId})`);
      await TaskExecutor.executeTask(taskId);
    }
  }

  /**
   * Call the Python agent server over HTTP.
   * The Python server runs as a separate Heroku dyno with a Flask/FastAPI endpoint.
   */
  private static async callAgentServer(agentId: string, taskId: string, taskPayload: any) {
    console.log(`[ExecutionManager] Calling agent server for task ${taskId} (agent: ${agentId})`);

    try {
      const response = await fetch(`${AGENT_SERVER_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, taskId, payload: taskPayload }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent server returned ${response.status}: ${errorText}`);
      }

      const result = await response.json() as any;
      console.log(`[ExecutionManager] Agent server completed task ${taskId}`);

      // If the agent server returned a result, verify and settle
      if (result.type === 'TASK_COMPLETE' && result.provenanceHash) {
        const { VerificationService } = await import('./verificationService');
        await VerificationService.verifyAndSettle(taskId, result.provenanceHash, result.result);
      }
    } catch (err: any) {
      console.warn(`[ExecutionManager] Agent server call failed: ${err.message}. Falling back to direct execution...`);
      await TaskExecutor.executeTask(taskId);
    }
  }

  /**
   * Legacy subprocess mode for local development only.
   */
  private static async spawnLocalAgent(agentId: string, taskId: string, taskPayload: any) {
    const { spawn } = await import('child_process');
    const path = await import('path');
    const fs = await import('fs');
    const { VerificationService } = await import('./verificationService');

    const vaultKey = process.env.VAULT_KEY;
    if (!vaultKey || vaultKey.length !== 64) {
      throw new Error('VAULT_KEY must be set and be exactly 64 hex characters.');
    }

    const scriptPath = path.resolve(__dirname, '../../../dojo-agents/main.py');
    if (!fs.existsSync(scriptPath)) {
      console.error(`[ExecutionManager] Agent script not found at ${scriptPath}`);
      await TaskExecutor.executeTask(taskId);
      return;
    }

    console.log(`[ExecutionManager] [LOCAL] Spawning agent ${agentId} for task ${taskId}`);

    const agentProcess = spawn('python', [scriptPath, '--agent-id', agentId], {
      env: { ...process.env, VAULT_KEY: vaultKey },
    });

    agentProcess.stdout?.on('data', async (data: Buffer) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.type === 'TASK_COMPLETE') {
            await VerificationService.verifyAndSettle(msg.taskId, msg.provenanceHash, msg.result);
          } else if (msg.type === 'TASK_FAILED') {
            console.error(`[Agent ${agentId}] Task failed:`, msg.message);
          }
        } catch {
          console.log(`[Agent ${agentId}]`, line);
        }
      }
    });

    agentProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`[Agent ${agentId} STDERR]`, data.toString());
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    agentProcess.stdin?.write(
      JSON.stringify({ type: 'TASK_ASSIGN', taskId, payload: taskPayload }) + '\n'
    );
  }

  static stopAgent(agentId: string) {
    console.log(`[ExecutionManager] stopAgent called for ${agentId} (no-op)`);
  }
}
