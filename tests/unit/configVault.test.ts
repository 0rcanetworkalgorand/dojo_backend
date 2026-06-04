/**
 * Unit tests for the config vault encryption/decryption.
 * Validates AES-256-GCM encryption round-trip for agent secrets.
 */
import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

// Replicate vault encryption logic for testing (from configVault.ts / agentRoutes.ts)
function encryptConfig(config: Record<string, unknown>, vaultKeyHex: string): string {
  const vaultKey = Buffer.from(vaultKeyHex, 'hex');
  const salt = Buffer.from('0rca_swarm_dojo_salt');
  const derivedKey = crypto.pbkdf2Sync(vaultKey, salt, 100000, 32, 'sha256');
  
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, nonce);
  
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(config), 'utf8'),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  
  return Buffer.concat([nonce, ciphertext, authTag]).toString('base64');
}

function decryptConfig(encryptedBlob: string, vaultKeyHex: string): Record<string, unknown> {
  const vaultKey = Buffer.from(vaultKeyHex, 'hex');
  const salt = Buffer.from('0rca_swarm_dojo_salt');
  const derivedKey = crypto.pbkdf2Sync(vaultKey, salt, 100000, 32, 'sha256');
  
  const raw = Buffer.from(encryptedBlob, 'base64');
  const nonce = raw.subarray(0, 12);
  const authTag = raw.subarray(raw.length - 16);
  const ciphertext = raw.subarray(12, raw.length - 16);
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, nonce);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);
  
  return JSON.parse(decrypted.toString('utf8'));
}

describe('Config Vault Encryption', () => {
  const testVaultKey = 'a'.repeat(64); // 32-byte key as hex

  describe('encrypt/decrypt round-trip', () => {
    it('encrypts and decrypts a simple config', () => {
      const config = { lane: 'CODE', llmTier: 'Standard', openai_api_key: 'sk-test123' };
      const encrypted = encryptConfig(config, testVaultKey);
      const decrypted = decryptConfig(encrypted, testVaultKey);
      expect(decrypted).toEqual(config);
    });

    it('produces different ciphertext each time (random nonce)', () => {
      const config = { lane: 'RESEARCH', key: 'value' };
      const enc1 = encryptConfig(config, testVaultKey);
      const enc2 = encryptConfig(config, testVaultKey);
      expect(enc1).not.toBe(enc2);
    });

    it('handles complex nested configs', () => {
      const config = {
        lane: 'DATA',
        llmTier: 'Elite',
        biddingStrategy: 'Volume',
        openai_api_key: 'gsk_LongApiKeyWithSpecialChars!@#$%',
        private_key: 'base64EncodedPrivateKey==',
        agent_address: 'WOLFRIK6TQ3Z4QH7UJJY3XESX5AI76GJRRHO47QWOZB6XIOWCQVJCG6NME',
      };
      const encrypted = encryptConfig(config, testVaultKey);
      const decrypted = decryptConfig(encrypted, testVaultKey);
      expect(decrypted).toEqual(config);
    });
  });

  describe('security properties', () => {
    it('fails decryption with wrong key', () => {
      const config = { secret: 'data' };
      const encrypted = encryptConfig(config, testVaultKey);
      const wrongKey = 'b'.repeat(64);
      expect(() => decryptConfig(encrypted, wrongKey)).toThrow();
    });

    it('fails decryption with tampered ciphertext', () => {
      const config = { secret: 'data' };
      const encrypted = encryptConfig(config, testVaultKey);
      const raw = Buffer.from(encrypted, 'base64');
      // Tamper with a byte in the middle
      raw[20] = raw[20] ^ 0xff;
      const tampered = raw.toString('base64');
      expect(() => decryptConfig(tampered, testVaultKey)).toThrow();
    });

    it('output is base64 encoded', () => {
      const config = { test: true };
      const encrypted = encryptConfig(config, testVaultKey);
      expect(() => Buffer.from(encrypted, 'base64')).not.toThrow();
      // Re-encoding should match (valid base64)
      expect(Buffer.from(encrypted, 'base64').toString('base64')).toBe(encrypted);
    });
  });
});
