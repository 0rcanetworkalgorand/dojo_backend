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

    // x402-avm library has an API incompatibility (paymentMiddleware signature changed)
    // The library throws: Cannot use 'in' operator to search for 'accepts' in <url>
    // This means the first arg should be an Express app/server, not a facilitator URL.
    // Disabling server-side x402 until the library is updated.
    console.log('[X402] Server middleware disabled (library API mismatch — non-critical for demo)');
    return;
}

export function getX402Middleware(): ((req: Request, res: Response, next: NextFunction) => void) | null {
    return x402Middleware;
}

export function isX402ServerEnabled(): boolean {
    return x402Middleware !== null;
}
