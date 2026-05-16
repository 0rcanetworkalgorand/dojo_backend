import algosdk from 'algosdk';

const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz';
const AVM_PRIVATE_KEY = process.env.AVM_PRIVATE_KEY;

let x402Fetch: typeof globalThis.fetch | null = null;

export interface PaymentConfig {
    price: string;
    payTo: string;
    description: string;
}

export async function initX402Client(): Promise<void> {
    if (!AVM_PRIVATE_KEY) {
        console.log('[X402] No AVM_PRIVATE_KEY - payments will use on-chain fallback');
        return;
    }

    try {
        const { wrapFetchWithPayment, x402Client } = await import('@x402-avm/fetch');
        const avm = await import('@x402-avm/avm');
        
        const signer = avm.toClientAvmSigner(AVM_PRIVATE_KEY);

        const client = new x402Client();
        const ExactAvmScheme = (avm as any).ExactAvmScheme;
        client.register(avm.ALGORAND_TESTNET_CAIP2, new ExactAvmScheme(signer));

        x402Fetch = wrapFetchWithPayment(fetch, client);

        console.log('[X402] Client initialized - payments enabled');
    } catch (error) {
        console.error('[X402] Failed to initialize:', error);
    }
}

export function getX402Fetch(): typeof globalThis.fetch | null {
    return x402Fetch;
}

export function isX402Enabled(): boolean {
    return x402Fetch !== null;
}

export async function payAndRequest(
    url: string,
    options: RequestInit,
    paymentConfig: PaymentConfig
): Promise<Response> {
    if (!x402Fetch) {
        throw new Error('X402 not initialized - payments disabled');
    }

    const avm = await import('@x402-avm/avm');

    const paymentRequirements = {
        scheme: 'exact',
        network: avm.ALGORAND_TESTNET_CAIP2,
        payTo: paymentConfig.payTo,
        price: paymentConfig.price,
        extra: {
            asset: avm.USDC_TESTNET_ASA_ID.toString(),
            decimals: 6,
        },
    };

    console.log('[X402] Creating payment requirements:', paymentRequirements);

    const response = await x402Fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
        },
    });

    return response;
}