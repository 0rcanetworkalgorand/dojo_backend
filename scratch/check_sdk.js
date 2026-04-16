const algosdk = require('algosdk');
try {
    const method = { name: 'test', args: [], returns: { type: 'void' } };
    const abiMethod = new algosdk.ABIMethod(method);
    console.log('Algorand SDK Version:', algosdk.version || 'Unknown');
    console.log('ABIMethod Prototype keys:', Object.keys(Object.getPrototypeOf(abiMethod)));
    console.log('ABIMethod instance keys:', Object.keys(abiMethod));
} catch (e) {
    console.error('Error diagnosticating ABIMethod:', e);
}
