/**
 * End-to-end encryption utilities using Web Crypto API.
 * Uses AES-GCM for authenticated encryption and PBKDF2 for password-based key derivation.
 */

// Constants for encryption
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

// Magic bytes to identify encrypted data (ASCII: "SYCE" - Sync Your Cookie Encrypted)
const MAGIC_BYTES = new Uint8Array([0x53, 0x59, 0x43, 0x45]);
const VERSION = 1;

/**
 * Derives a cryptographic key from a password using PBKDF2.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveKey',
  ]);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypts data using AES-GCM with a password-derived key.
 *
 * Output format:
 * [MAGIC_BYTES (4)] [VERSION (1)] [SALT (16)] [IV (12)] [CIPHERTEXT (...)]
 *
 * @param data - The data to encrypt (Uint8Array)
 * @param password - The password to derive the encryption key from
 * @returns Promise<Uint8Array> - The encrypted data with header
 */
export async function encrypt(data: Uint8Array, password: string): Promise<Uint8Array> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Encrypt the data
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    key,
    data,
  );

  // Combine: MAGIC + VERSION + SALT + IV + CIPHERTEXT
  const result = new Uint8Array(MAGIC_BYTES.length + 1 + SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
  let offset = 0;

  result.set(MAGIC_BYTES, offset);
  offset += MAGIC_BYTES.length;

  result[offset] = VERSION;
  offset += 1;

  result.set(salt, offset);
  offset += SALT_LENGTH;

  result.set(iv, offset);
  offset += IV_LENGTH;

  result.set(new Uint8Array(ciphertext), offset);

  return result;
}

/**
 * Decrypts data that was encrypted with the encrypt() function.
 *
 * @param encryptedData - The encrypted data with header (Uint8Array)
 * @param password - The password to derive the decryption key from
 * @returns Promise<Uint8Array> - The decrypted data
 * @throws Error if decryption fails or data is invalid
 */
export async function decrypt(encryptedData: Uint8Array, password: string): Promise<Uint8Array> {
  let offset = 0;

  // Verify magic bytes
  const magic = encryptedData.slice(offset, offset + MAGIC_BYTES.length);
  offset += MAGIC_BYTES.length;

  if (!magic.every((byte, i) => byte === MAGIC_BYTES[i])) {
    throw new Error('Invalid encrypted data: magic bytes mismatch');
  }

  // Check version
  const version = encryptedData[offset];
  offset += 1;

  if (version !== VERSION) {
    throw new Error(`Unsupported encryption version: ${version}`);
  }

  // Extract salt
  const salt = encryptedData.slice(offset, offset + SALT_LENGTH);
  offset += SALT_LENGTH;

  // Extract IV
  const iv = encryptedData.slice(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  // Extract ciphertext
  const ciphertext = encryptedData.slice(offset);

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Decrypt the data
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      ciphertext,
    );

    return new Uint8Array(decrypted);
  } catch {
    throw new Error('Decryption failed: incorrect password or corrupted data');
  }
}

/**
 * Checks if data appears to be encrypted (starts with magic bytes).
 *
 * @param data - The data to check (Uint8Array)
 * @returns boolean - True if data appears to be encrypted
 */
export function isEncrypted(data: Uint8Array): boolean {
  if (data.length < MAGIC_BYTES.length) {
    return false;
  }
  return data.slice(0, MAGIC_BYTES.length).every((byte, i) => byte === MAGIC_BYTES[i]);
}

/**
 * Encrypts a base64 string using the provided password.
 * Returns a new base64 string containing the encrypted data.
 *
 * @param base64Data - The base64-encoded data to encrypt
 * @param password - The password to use for encryption
 * @returns Promise<string> - The encrypted data as a base64 string
 */
export async function encryptBase64(base64Data: string, password: string): Promise<string> {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const encrypted = await encrypt(bytes, password);
  return arrayBufferToBase64ForEncryption(encrypted);
}

/**
 * Decrypts a base64 string that was encrypted with encryptBase64().
 * Returns the original base64-encoded data.
 *
 * @param encryptedBase64 - The encrypted base64 string
 * @param password - The password to use for decryption
 * @returns Promise<string> - The decrypted data as a base64 string
 */
export async function decryptBase64(encryptedBase64: string, password: string): Promise<string> {
  const binaryString = atob(encryptedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decrypted = await decrypt(bytes, password);
  return arrayBufferToBase64ForEncryption(decrypted);
}

/**
 * Checks if a base64 string appears to be encrypted data.
 *
 * @param base64Data - The base64 string to check
 * @returns boolean - True if the data appears to be encrypted
 */
export function isBase64Encrypted(base64Data: string): boolean {
  try {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(Math.min(binaryString.length, MAGIC_BYTES.length));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return isEncrypted(bytes);
  } catch {
    return false;
  }
}

// Helper function for base64 encoding (to avoid circular dependency)
function arrayBufferToBase64ForEncryption(arrayBuffer: ArrayBuffer | Uint8Array) {
  let base64 = '';
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const bytes = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a, b, c, d;
  let chunk;

  for (let i = 0; i < mainLength; i = i + 3) {
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  if (byteRemainder == 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}
