"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const dojo_contracts_artifacts_1 = require("@0rca/dojo-contracts-artifacts");
const contracts_1 = require("../algorand/contracts");
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
class VerificationService {
    /**
     * Verify a task result using real Kite AI and perform on-chain settlement or slashing.
     */
    static async verifyAndSettle(taskId, provenanceHash, result) {
        console.log(`[VerificationService] Starting verification for task ${taskId}`);
        // 1. Call Kite AI for verification
        const kiteResult = await this.callKiteAI(provenanceHash, taskId);
        // 2. Harden the settlement admin setup
        const mnemonic = process.env.ADMIN_MNEMONIC;
        if (!mnemonic)
            throw new Error('ADMIN_MNEMONIC is not set');
        const account = algosdk_1.default.mnemonicToSecretKey(mnemonic);
        const signer = algosdk_1.default.makeBasicAccountTransactionSigner(account);
        const algodClient = (0, contracts_1.getAlgodClient)();
        const client = new dojo_contracts_artifacts_1.EscrowVaultClient({
            algod: algodClient,
            sender: account.addr,
            signer
        });
        // 3. Handle verification results and trigger on-chain actions
        if (kiteResult.valid) {
            console.log(`[VerificationService] Kite AI returned valid=true for task ${taskId}`);
            try {
                // Perform on-chain settlement
                await client.verifyAndSettle({ taskId });
                // Update task state on successful settlement
                await prisma_1.prisma.task.update({
                    where: { id: taskId },
                    data: {
                        state: client_1.TaskState.SETTLED,
                        kiteHash: provenanceHash,
                        settledAt: new Date()
                    }
                });
                console.log(`[VerificationService] Task ${taskId} successfully settled on-chain.`);
            }
            catch (error) {
                console.error(`[VerificationService] ERROR: On-chain settlement (verifyAndSettle) failed for task ${taskId}:`, error);
                await prisma_1.prisma.task.update({
                    where: { id: taskId },
                    data: { state: client_1.TaskState.VERIFIED }
                });
            }
        }
        else {
            console.warn(`[VerificationService] Kite validation failed for task ${taskId}. Triggering slashWorker. Reason: ${kiteResult.error ?? 'invalid hash'}`);
            try {
                // Perform on-chain slashing
                await client.slashWorker({ taskId });
                // Update task state on successful slashing
                await prisma_1.prisma.task.update({
                    where: { id: taskId },
                    data: {
                        state: client_1.TaskState.SLASHED,
                        kiteHash: provenanceHash,
                        settledAt: new Date()
                    }
                });
                console.log(`[VerificationService] Task ${taskId} successfully slashed on-chain.`);
            }
            catch (error) {
                console.error(`[VerificationService] ERROR: On-chain slashing (slashWorker) failed for task ${taskId}:`, error);
                await prisma_1.prisma.task.update({
                    where: { id: taskId },
                    data: { state: client_1.TaskState.VERIFIED }
                });
            }
        }
    }
    /**
     * Real Kite AI Verification call using official API.
     */
    static async callKiteAI(kiteHash, taskId) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);
        try {
            const response = await fetch('https://api.kiteai.io/v1/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.KITE_API_KEY}`
                },
                body: JSON.stringify({ hash: kiteHash, taskId }),
                signal: controller.signal
            });
            if (!response.ok) {
                const body = await response.text();
                console.error(`[VerificationService] Kite AI returned ${response.status}: ${body}`);
                return { valid: false, error: `Kite API error: ${response.status}` };
            }
            const data = await response.json();
            return { valid: data.valid };
        }
        catch (e) {
            if (e.name === 'AbortError') {
                console.error(`[VerificationService] Kite AI timeout for task ${taskId}`);
                return { valid: false, error: 'Kite AI timeout' };
            }
            console.error(`[VerificationService] Kite AI request failed for task ${taskId}:`, e);
            return { valid: false, error: e.message };
        }
        finally {
            clearTimeout(timeout);
        }
    }
}
exports.VerificationService = VerificationService;
