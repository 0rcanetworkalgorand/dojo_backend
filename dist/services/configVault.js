"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigVault = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT = Buffer.from('0rca_swarm_dojo_salt');
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
class ConfigVault {
    /**
     * Derives a key from the master VAULT_KEY using PBKDF2.
     */
    static getDerivedKey() {
        const masterKeyHex = process.env.VAULT_KEY;
        if (!masterKeyHex) {
            throw new Error('VAULT_KEY not found in environment');
        }
        const masterKey = Buffer.from(masterKeyHex, 'hex');
        return crypto_1.default.pbkdf2Sync(masterKey, SALT, ITERATIONS, KEY_LENGTH, 'sha256');
    }
    /**
     * Encrypts a string (e.g. JSON) and returns a base64 string.
     * Format: base64(nonce + ciphertext + authTag)
     */
    static encrypt(data) {
        const nonce = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv(ALGORITHM, this.getDerivedKey(), nonce);
        const ciphertext = Buffer.concat([
            cipher.update(data, 'utf8'),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([nonce, ciphertext, authTag]).toString('base64');
    }
    /**
     * Decrypts a base64 string produced by the above encrypt() or agentRoutes.
     */
    static decrypt(sealedBase64) {
        const data = Buffer.from(sealedBase64, 'base64');
        // Nonce is first 12 bytes, Tag is last 16 bytes, Ciphertext is in between
        const nonce = data.subarray(0, IV_LENGTH);
        const authTag = data.subarray(data.length - 16);
        const ciphertext = data.subarray(IV_LENGTH, data.length - 16);
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, this.getDerivedKey(), nonce);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(ciphertext, undefined, 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
exports.ConfigVault = ConfigVault;
