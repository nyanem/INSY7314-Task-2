// Import Necessary Modules
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

// Convert the hex string from .env into a 32-byte Buffer
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex'); // 32 bytes
const HMAC_KEY = process.env.HMAC_KEY || ''; // any length, keep secret

const IV_LENGTH = 12; // 96-bit which is recommended for GCM
const TAG_LENGTH = 16; // 128-bit auth tag

// Validate the length of the encryption key
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    'ENCRYPTION_KEY must be 32 bytes (hex). Example: export ENCRYPTION_KEY=$(openssl rand -hex 32)'
  );
}

// Authenticated encryption using AES-256-GCM
export function encrypt(plaintext) {
  if (plaintext === undefined || plaintext === null) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    ENCRYPTION_KEY,
    iv,
    { authTagLength: TAG_LENGTH }
  );
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Returned as hex: iv:tag:ciphertext
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

// Decrypt function - gets input format is iv:tag:ciphertext in hex
export function decrypt(payload) {
  // Handle null/undefined
  if (!payload) return '';
  const parts = payload.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted payload format');
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    ENCRYPTION_KEY,
    iv,
    { authTagLength: TAG_LENGTH }
  );
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

// Deterministic HMAC for lookup/index (hex string)
export function hmacHex(text) {
  if (text === undefined || text === null) return '';
  return crypto.createHmac('sha256', HMAC_KEY).update(String(text)).digest('hex');
}
//-------------------------------------------------------------------End of File----------------------------------------------------------//