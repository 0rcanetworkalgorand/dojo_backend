import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

async function test() {
    const commitmentLockAppId = Number(process.env.COMMITMENT_LOCK_APP_ID || 761941684);
    
    // Create random accounts for testing
    const senseiAcc = algosdk.generateAccount();
    
    const stakeId = "STK-" + Date.now();
    const stakeAmountAlgo = 1000000n; // 1 ALGO

    const sp = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();
    const appAddr = algosdk.getApplicationAddress(BigInt(commitmentLockAppId));

    const stakeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: senseiAcc.addr,
        receiver: typeof appAddr === 'string' ? appAddr : appAddr.toString(),
        amount: stakeAmountAlgo,
        suggestedParams: sp,
    });

    const abi = new algosdk.ABIInterface({
        name: 'CommitmentLock',
        methods: [
            {
                name: 'stake',
                args: [
                    { type: 'string', name: 'stake_id' },
                    { type: 'address', name: 'sensei' },
                    { type: 'uint64', name: 'amount' },
                    { type: 'uint64', name: 'lock_days' },
                    { type: 'pay', name: 'stake_txn' }
                ],
                returns: { type: 'bool' }
            }
        ]
    });

    const signer = algosdk.makeBasicAccountTransactionSigner(senseiAcc);

    atc.addMethodCall({
        appID: commitmentLockAppId,
        method: abi.getMethodByName('stake'),
        methodArgs: [
            stakeId,
            senseiAcc.addr,
            stakeAmountAlgo,
            30n,
            { txn: stakeTxn, signer }
        ],
        sender: senseiAcc.addr,
        signer,
        suggestedParams: sp,
        boxes: [
            { appIndex: commitmentLockAppId, name: new Uint8Array(Buffer.from(stakeId)) }
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
