"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.algodClient = exports.signer = exports.adminAddress = exports.payoutClient = exports.commitmentClient = exports.escrowClient = exports.registryClient = exports.algorand = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const DojoRegistryClient_1 = require("./DojoRegistryClient");
const EscrowVaultClient_1 = require("./EscrowVaultClient");
const CommitmentLockClient_1 = require("./CommitmentLockClient");
const PayoutSplitterClient_1 = require("./PayoutSplitterClient");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { ADMIN_MNEMONIC, ALGOD_SERVER, ALGOD_TOKEN, ALGOD_PORT, DOJO_REGISTRY_APP_ID, ESCROW_VAULT_APP_ID, COMMITMENT_LOCK_APP_ID, PAYOUT_SPLITTER_APP_ID } = process.env;
if (!ADMIN_MNEMONIC) {
    throw new Error('ADMIN_MNEMONIC env var is missing');
}
const adminAccount = algosdk_1.default.mnemonicToSecretKey(ADMIN_MNEMONIC);
const adminAddress = adminAccount.addr.toString();
exports.adminAddress = adminAddress;
const signer = algosdk_1.default.makeBasicAccountTransactionSigner(adminAccount);
exports.signer = signer;
// Initialize AlgorandClient for TestNet
exports.algorand = algokit_utils_1.AlgorandClient.fromConfig({
    algodConfig: {
        server: ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
        token: ALGOD_TOKEN || '',
        port: ALGOD_PORT || '443'
    }
});
// Set the global signer for the admin account
exports.algorand.account.setSigner(adminAddress, signer);
// Export typed clients using pre-set App IDs
exports.registryClient = new DojoRegistryClient_1.DojoRegistryClient({
    appId: BigInt(DOJO_REGISTRY_APP_ID || '0'),
    algorand: exports.algorand,
    defaultSender: adminAddress
});
exports.escrowClient = new EscrowVaultClient_1.EscrowVaultClient({
    appId: BigInt(ESCROW_VAULT_APP_ID || '0'),
    algorand: exports.algorand,
    defaultSender: adminAddress
});
exports.commitmentClient = new CommitmentLockClient_1.CommitmentLockClient({
    appId: BigInt(COMMITMENT_LOCK_APP_ID || '0'),
    algorand: exports.algorand,
    defaultSender: adminAddress
});
exports.payoutClient = new PayoutSplitterClient_1.PayoutSplitterClient({
    appId: BigInt(PAYOUT_SPLITTER_APP_ID || '0'),
    algorand: exports.algorand,
    defaultSender: adminAddress
});
exports.algodClient = exports.algorand.client.algod;
