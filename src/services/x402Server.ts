import { Request, Response, NextFunction } from 'express';

const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz';
const AVM_PRIVATE_KEY = process.env.AVM_PRIVATE_KEY;
const PAY_TO = process.env.PAY_TO || process.env.TREASURY_ADDRESS || '7YIXQEQK3MTQ6JW5WM6PJEA6SPRVFWI5GCEMTCX3M4WVK5C2C2ZMDZUYQ';

let x402Middleware: ((req: Request, res: Response, next: NextFunction) => void) | null = null;

export async function initX402Server(): Promise<void> {
    if (!AVM_PRIVATE_KEY) {
        console.log('[X402] No AVM_PRIVATE_KEY configured — x402 server middleware disabled');
        return;
    }

    try {
        const { paymentMiddleware } = await import('@x402-avm/express');
        const avm = await import('@x402-avm/avm');

        // Configure the x402 payment middleware for task API endpoints
        // Price: 0.01 USDC per task creation (micro-payment demonstration)
        x402Middleware = paymentMiddleware(FACILITATOR_URL, {
            scheme: 'exact',
            network: avm.ALGORAND_TESTNET_CAIP2,
            payTo: PAY_TO,
            price: '0.01',
            extra: {
                asset: avm.USDC_TESTNET_ASA_ID.toString(),
                decimals: 6,
            },
        });

        console.log(`[X402] Server middleware initialized — payTo: ${PAY_TO}, price: 0.01 USDC`);
    } catch (error: any) {
        console.error('[X402] Failed to initialize server middleware:', error.message || error);
        console.log('[X402] Continuing without x402 payment gating');
    }
}

export function getX402Middleware(): ((req: Request, res: Response, next: NextFunction) => void) | null {
    return x402Middleware;
}

export function isX402ServerEnabled(): boolean {
    return x402Middleware !== null;
}
