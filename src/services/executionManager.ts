import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import * as fs from 'fs';
import { VerificationService } from './verificationService';

export class ExecutionManager {
  private static activeAgents: Map<string, ChildProcess> = new Map();

  /**
   * Spawns or retrieves an agent process and assigns a task via IPC.
   */
  static async startAgentForTask(agentId: string, taskId: string, taskPayload: any) {
    const vaultKey = process.env.VAULT_KEY
    if (!vaultKey || vaultKey.length !== 64) {
      throw new Error(
        'VAULT_KEY must be set and be exactly 64 hex characters ' +
        'before agent processes can be spawned.'
      )
    }

    console.log(`[ExecutionManager] Assigning task ${taskId} to agent ${agentId}`);
    
    let agentProcess = this.activeAgents.get(agentId);

    if (!agentProcess || agentProcess.killed) {
        const scriptPath = path.resolve(__dirname, '../../../dojo-agents/main.py');
        
        // Ensure the script exists
        if (!fs.existsSync(scriptPath)) {
            console.error(`[ExecutionManager] Agent script not found at ${scriptPath}`);
            return;
        }

        agentProcess = spawn('python', [scriptPath, '--agent-id', agentId]);
        this.activeAgents.set(agentId, agentProcess);

        agentProcess.stdout?.on('data', async (data) => {
            const lines = data.toString().split('\n');
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const msg = JSON.parse(line);
                    console.log(`[Agent ${agentId}]`, msg);
                    
                    if (msg.type === 'TASK_COMPLETE') {
                        await VerificationService.verifyAndSettle(msg.taskId, msg.provenanceHash, msg.result);
                    } else if (msg.type === 'TASK_FAILED') {
                        console.error(`[Agent ${agentId}] Task failed:`, msg.message);
                    }
                } catch (e) {
                    // Not JSON, probably log message
                    console.log(`[Agent ${agentId} LOG]`, line);
                }
            }
        });

        agentProcess.stderr?.on('data', (data) => {
            console.error(`[Agent ${agentId} STDERR]`, data.toString());
        });

        agentProcess.on('close', (code) => {
            console.log(`[ExecutionManager] Agent ${agentId} exited with code ${code}`);
            this.activeAgents.delete(agentId);
        });

        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Send TASK_ASSIGN via stdin
    const assignMsg = JSON.stringify({
        type: 'TASK_ASSIGN',
        taskId: taskId,
        payload: taskPayload
    }) + '\n';

    agentProcess.stdin?.write(assignMsg);
  }

  static stopAgent(agentId: string) {
    const process = this.activeAgents.get(agentId);
    if (process) {
        process.kill();
        this.activeAgents.delete(agentId);
    }
  }
}
