import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

async function test() {
    const escrowVaultAppId = Number(process.env.ESCROW_VAULT_APP_ID || 761941677);
    
    // Create random accounts for testing
    const clientAcc = algosdk.generateAccount();
    const workerAcc = algosdk.generateAccount();
    const senseiAcc = algosdk.generateAccount();
    
    const taskId = "T-" + Date.now();
    const bountyAmountAlgo = 1000000n; // 1 ALGO

    const sp = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();
    const appAddr = algosdk.getApplicationAddress(BigInt(escrowVaultAppId));
    console.log({ client: clientAcc.addr, appAddr });

    const bountyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: clientAcc.addr,
        receiver: typeof appAddr === 'string' ? appAddr : appAddr.toString(),
        amount: bountyAmountAlgo,
        suggestedParams: sp,
    });

    const abi = new algosdk.ABIInterface({
        name: 'EscrowVault',
        methods: [
            {
                name: 'lock_bounty',
                args: [
                    { type: 'string', name: 'task_id' },
                    { type: 'address', name: 'client' },
                    { type: 'address', name: 'worker' },
                    { type: 'address', name: 'sensei' },
                    { type: 'uint64', name: 'bounty_amount' },
                    { type: 'pay', name: 'bounty_txn' }
                ],
                returns: { type: 'bool' }
            }
        ]
    });

    const signer = algosdk.makeBasicAccountTransactionSigner(clientAcc);

    atc.addMethodCall({
        appID: escrowVaultAppId,
        method: abi.getMethodByName('lock_bounty'),
        methodArgs: [
            taskId,
            clientAcc.addr,
            workerAcc.addr,
            senseiAcc.addr,
            bountyAmountAlgo,
            { txn: bountyTxn, signer }
        ],
        sender: clientAcc.addr,
        signer,
        suggestedParams: sp,
        boxes: [
            { appIndex: escrowVaultAppId, name: new Uint8Array(Buffer.from(taskId)) }
        ]
    });

    const signedGroup = await atc.gatherSignatures();
    const dr = await algosdk.createDryrun({
        client: algodClient,
        txns: signedGroup.map(stx => algosdk.decodeSignedTransaction(stx).txn)
    });
    
    const drResponse = await algodClient.dryrun(dr).do();
    console.log(JSON.stringify(drResponse.txns.map(t => t['app-call-messages']), null, 2));
}

test().catch(console.error);
