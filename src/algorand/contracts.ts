import algosdk from 'algosdk';
import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { DojoRegistryClient } from './DojoRegistryClient';
import { EscrowVaultClient } from './EscrowVaultClient';
import { CommitmentLockClient } from './CommitmentLockClient';
import { PayoutSplitterClient } from './PayoutSplitterClient';
import dotenv from 'dotenv';

dotenv.config();

const {
    ADMIN_MNEMONIC,
    ALGOD_SERVER,
    ALGOD_TOKEN,
    ALGOD_PORT,
    DOJO_REGISTRY_APP_ID,
    ESCROW_VAULT_APP_ID,
    COMMITMENT_LOCK_APP_ID,
    PAYOUT_SPLITTER_APP_ID
} = process.env;

if (!ADMIN_MNEMONIC) {
    throw new Error('ADMIN_MNEMONIC env var is missing');
}

const adminAccount = algosdk.mnemonicToSecretKey(ADMIN_MNEMONIC);
const adminAddress = adminAccount.addr.toString();
const signer = algosdk.makeBasicAccountTransactionSigner(adminAccount);

// Initialize AlgorandClient for TestNet
export const algorand = AlgorandClient.fromConfig({
    algodConfig: {
        server: ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
        token: ALGOD_TOKEN || '',
        port: ALGOD_PORT || '443'
    }
});

// Set the global signer for the admin account
algorand.account.setSigner(adminAddress, signer);

// Export typed clients using pre-set App IDs
export const registryClient = new DojoRegistryClient({
    appId: BigInt(DOJO_REGISTRY_APP_ID || '0'),
    algorand,
    defaultSender: adminAddress
});

export const escrowClient = new EscrowVaultClient({
    appId: BigInt(ESCROW_VAULT_APP_ID || '0'),
    algorand,
    defaultSender: adminAddress
});

export const commitmentClient = new CommitmentLockClient({
    appId: BigInt(COMMITMENT_LOCK_APP_ID || '0'),
    algorand,
    defaultSender: adminAddress
});

export const payoutClient = new PayoutSplitterClient({
    appId: BigInt(PAYOUT_SPLITTER_APP_ID || '0'),
    algorand,
    defaultSender: adminAddress
});

export { adminAddress, signer };
export const algodClient = algorand.client.algod;
