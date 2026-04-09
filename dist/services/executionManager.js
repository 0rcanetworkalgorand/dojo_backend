"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionManager = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const verificationService_1 = require("./verificationService");
class ExecutionManager {
    static activeAgents = new Map();
    /**
     * Spawns or retrieves an agent process and assigns a task via IPC.
     */
    static async startAgentForTask(agentId, taskId, taskPayload) {
        const vaultKey = process.env.VAULT_KEY;
        if (!vaultKey || vaultKey.length !== 64) {
            throw new Error('VAULT_KEY must be set and be exactly 64 hex characters ' +
                'before agent processes can be spawned.');
        }
        console.log(`[ExecutionManager] Assigning task ${taskId} to agent ${agentId}`);
        let agentProcess = this.activeAgents.get(agentId);
        if (!agentProcess || agentProcess.killed) {
            const scriptPath = path_1.default.resolve(__dirname, '../../../dojo-agents/main.py');
            // Ensure the script exists
            if (!fs.existsSync(scriptPath)) {
                console.error(`[ExecutionManager] Agent script not found at ${scriptPath}`);
                return;
            }
            agentProcess = (0, child_process_1.spawn)('python', [scriptPath, '--agent-id', agentId]);
            this.activeAgents.set(agentId, agentProcess);
            agentProcess.stdout?.on('data', async (data) => {
                const lines = data.toString().split('\n');
                for (const line of lines) {
                    if (!line.trim())
                        continue;
                    try {
                        const msg = JSON.parse(line);
                        console.log(`[Agent ${agentId}]`, msg);
                        if (msg.type === 'TASK_COMPLETE') {
                            await verificationService_1.VerificationService.verifyAndSettle(msg.taskId, msg.provenanceHash, msg.result);
                        }
                        else if (msg.type === 'TASK_FAILED') {
                            console.error(`[Agent ${agentId}] Task failed:`, msg.message);
                        }
                    }
                    catch (e) {
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
    static stopAgent(agentId) {
        const process = this.activeAgents.get(agentId);
        if (process) {
            process.kill();
            this.activeAgents.delete(agentId);
        }
    }
}
exports.ExecutionManager = ExecutionManager;
