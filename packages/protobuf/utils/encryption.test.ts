import { describe, it, expect } from 'vitest';
import {
  encrypt,
  decrypt,
  isEncrypted,
  encryptBase64,
  decryptBase64,
  isBase64Encrypted,
} from './encryption';

// Helper to create test data
function createTestData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = i % 256;
  }
  return data;
}

// Helper to convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper to convert Uint8Array to string
function uint8ArrayToString(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

describe('Encryption Module', () => {
  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt small data correctly', async () => {
      const originalData = stringToUint8Array('Hello, World!');
      const password = 'test-password-123';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(uint8ArrayToString(decrypted)).toBe('Hello, World!');
    });

    it('should encrypt and decrypt empty data', async () => {
      const originalData = new Uint8Array(0);
      const password = 'test-password';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted.length).toBe(0);
    });

    it('should encrypt and decrypt large data (1MB)', async () => {
      const originalData = createTestData(1024 * 1024); // 1MB
      const password = 'strong-password-456';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toEqual(originalData);
    });

    it('should encrypt and decrypt binary data', async () => {
      const originalData = new Uint8Array([0, 1, 2, 255, 254, 253, 128, 127]);
      const password = 'binary-test';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(decrypted).toEqual(originalData);
    });

    it('should produce different ciphertext for same plaintext (random IV)', async () => {
      const originalData = stringToUint8Array('Same message');
      const password = 'same-password';

      const encrypted1 = await encrypt(originalData, password);
      const encrypted2 = await encrypt(originalData, password);

      // Ciphertexts should be different due to random IV and salt
      expect(encrypted1).not.toEqual(encrypted2);

      // But both should decrypt to the same plaintext
      const decrypted1 = await decrypt(encrypted1, password);
      const decrypted2 = await decrypt(encrypted2, password);

      expect(decrypted1).toEqual(decrypted2);
    });

    it('should fail decryption with wrong password', async () => {
      const originalData = stringToUint8Array('Secret message');
      const correctPassword = 'correct-password';
      const wrongPassword = 'wrong-password';

      const encrypted = await encrypt(originalData, correctPassword);

      await expect(decrypt(encrypted, wrongPassword)).rejects.toThrow(
        'Decryption failed: incorrect password or corrupted data',
      );
    });

    it('should fail decryption with corrupted data', async () => {
      const originalData = stringToUint8Array('Test data');
      const password = 'test-password';

      const encrypted = await encrypt(originalData, password);

      // Corrupt the ciphertext (modify bytes after the header)
      encrypted[encrypted.length - 1] ^= 0xff;

      await expect(decrypt(encrypted, password)).rejects.toThrow();
    });

    it('should fail decryption with invalid magic bytes', async () => {
      const fakeEncrypted = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x01, ...new Array(33).fill(0)]);

      await expect(decrypt(fakeEncrypted, 'any-password')).rejects.toThrow(
        'Invalid encrypted data: magic bytes mismatch',
      );
    });

    it('should fail decryption with unsupported version', async () => {
      // Create data with correct magic bytes but wrong version
      const fakeEncrypted = new Uint8Array([
        0x53,
        0x59,
        0x43,
        0x45, // SYCE magic bytes
        0x99, // Invalid version
        ...new Array(33).fill(0),
      ]);

      await expect(decrypt(fakeEncrypted, 'any-password')).rejects.toThrow('Unsupported encryption version: 153');
    });

    it('should handle unicode strings correctly', async () => {
      const originalData = stringToUint8Array('Hello 世界 🌍 Привет');
      const password = 'unicode-test-密码';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(uint8ArrayToString(decrypted)).toBe('Hello 世界 🌍 Привет');
    });

    it('should handle special characters in password', async () => {
      const originalData = stringToUint8Array('Test data');
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?`~"\'\\';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(uint8ArrayToString(decrypted)).toBe('Test data');
    });

    it('should handle very long passwords', async () => {
      const originalData = stringToUint8Array('Test data');
      const password = 'a'.repeat(10000);

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(uint8ArrayToString(decrypted)).toBe('Test data');
    });

    it('should handle empty password', async () => {
      const originalData = stringToUint8Array('Test data');
      const password = '';

      const encrypted = await encrypt(originalData, password);
      const decrypted = await decrypt(encrypted, password);

      expect(uint8ArrayToString(decrypted)).toBe('Test data');
    });
  });

  describe('isEncrypted', () => {
    it('should return true for encrypted data', async () => {
      const originalData = stringToUint8Array('Test');
      const encrypted = await encrypt(originalData, 'password');

      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should return false for non-encrypted data', () => {
      const plainData = stringToUint8Array('Plain text data');

      expect(isEncrypted(plainData)).toBe(false);
    });

    it('should return false for data shorter than magic bytes', () => {
      const shortData = new Uint8Array([0x53, 0x59]); // Only 2 bytes

      expect(isEncrypted(shortData)).toBe(false);
    });

    it('should return false for empty data', () => {
      const emptyData = new Uint8Array(0);

      expect(isEncrypted(emptyData)).toBe(false);
    });

    it('should return false for data with partial magic bytes match', () => {
      const partialMatch = new Uint8Array([0x53, 0x59, 0x43, 0x00]); // SYCA instead of SYCE

      expect(isEncrypted(partialMatch)).toBe(false);
    });
  });

  describe('encryptBase64 and decryptBase64', () => {
    it('should encrypt and decrypt base64 strings', async () => {
      const originalBase64 = btoa('Hello, World!');
      const password = 'test-password';

      const encryptedBase64 = await encryptBase64(originalBase64, password);
      const decryptedBase64 = await decryptBase64(encryptedBase64, password);

      expect(decryptedBase64).toBe(originalBase64);
    });

    it('should handle complex base64 data', async () => {
      // Create some binary data and convert to base64
      const binaryData = new Uint8Array([0, 127, 128, 255, 1, 2, 3]);
      const originalBase64 = btoa(String.fromCharCode(...binaryData));
      const password = 'complex-test';

      const encryptedBase64 = await encryptBase64(originalBase64, password);
      const decryptedBase64 = await decryptBase64(encryptedBase64, password);

      expect(decryptedBase64).toBe(originalBase64);
    });

    it('should fail with wrong password', async () => {
      const originalBase64 = btoa('Secret data');

      const encryptedBase64 = await encryptBase64(originalBase64, 'correct-password');

      await expect(decryptBase64(encryptedBase64, 'wrong-password')).rejects.toThrow();
    });

    it('should handle empty base64 string', async () => {
      const originalBase64 = btoa('');
      const password = 'test';

      const encryptedBase64 = await encryptBase64(originalBase64, password);
      const decryptedBase64 = await decryptBase64(encryptedBase64, password);

      expect(decryptedBase64).toBe(originalBase64);
    });
  });

  describe('isBase64Encrypted', () => {
    it('should return true for encrypted base64 data', async () => {
      const originalBase64 = btoa('Test data');
      const encryptedBase64 = await encryptBase64(originalBase64, 'password');

      expect(isBase64Encrypted(encryptedBase64)).toBe(true);
    });

    it('should return false for plain base64 data', () => {
      const plainBase64 = btoa('Plain text');

      expect(isBase64Encrypted(plainBase64)).toBe(false);
    });

    it('should return false for invalid base64 string', () => {
      const invalidBase64 = '!!!not-valid-base64!!!';

      expect(isBase64Encrypted(invalidBase64)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isBase64Encrypted('')).toBe(false);
    });

    it('should return false for JSON-like base64', () => {
      const jsonBase64 = btoa('{"key": "value"}');

      expect(isBase64Encrypted(jsonBase64)).toBe(false);
    });
  });

  describe('Security properties', () => {
    it('encrypted data should be larger than original due to header', async () => {
      const originalData = stringToUint8Array('Test');
      const encrypted = await encrypt(originalData, 'password');

      // Header size: 4 (magic) + 1 (version) + 16 (salt) + 12 (IV) = 33 bytes
      // Plus authentication tag from GCM (16 bytes)
      expect(encrypted.length).toBeGreaterThan(originalData.length + 33);
    });

    it('should have correct magic bytes at the start', async () => {
      const originalData = stringToUint8Array('Test');
      const encrypted = await encrypt(originalData, 'password');

      // Check SYCE magic bytes
      expect(encrypted[0]).toBe(0x53); // S
      expect(encrypted[1]).toBe(0x59); // Y
      expect(encrypted[2]).toBe(0x43); // C
      expect(encrypted[3]).toBe(0x45); // E
    });

    it('should have version 1 in the header', async () => {
      const originalData = stringToUint8Array('Test');
      const encrypted = await encrypt(originalData, 'password');

      expect(encrypted[4]).toBe(1); // Version
    });
  });
});
