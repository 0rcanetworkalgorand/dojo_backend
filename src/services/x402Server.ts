const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz';
const AVM_PRIVATE_KEY = process.env.AVM_PRIVATE_KEY;
const PAY_TO = process.env.PAY_TO || '7YIXQEQK3MTQ6JW5WM6PJEA6SPRVFWI5GCEMTCX3M4WVK5C2C2ZMDZUYQ';

let x402Middleware: any = null;

export async function initX402Server(): Promise<void> {
    console.log('[X402] Server middleware disabled (client-side payments only for now)');
}

export function getX402Middleware(): any | null {
    return x402Middleware;
}

export function isX402ServerEnabled(): boolean {
    return false;
}