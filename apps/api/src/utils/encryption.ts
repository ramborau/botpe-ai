import crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;

  constructor() {
    // Ensure encryption key is set
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY must be set in environment variables');
    }

    // Create 32-byte key from environment variable
    this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
  }

  /**
   * Encrypt a string value
   * @param text - Plain text to encrypt
   * @returns Encrypted string with IV and auth tag
   */
  encrypt(text: string): string {
    try {
      // Generate random initialization vector
      const iv = crypto.randomBytes(16);

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

      // Encrypt the text
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get the authentication tag
      const authTag = cipher.getAuthTag();

      // Combine IV, auth tag, and encrypted data
      // Format: iv:authTag:encryptedData
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt an encrypted string
   * @param encryptedText - Encrypted string with IV and auth tag
   * @returns Decrypted plain text
   */
  decrypt(encryptedText: string): string {
    try {
      // Split the encrypted text to get IV, auth tag, and encrypted data
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);

      // Decrypt the text
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Generate a secure random string
   * @param length - Length of the random string
   * @returns Random hex string
   */
  generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash a value using SHA-256
   * @param value - Value to hash
   * @returns Hashed value
   */
  hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();
