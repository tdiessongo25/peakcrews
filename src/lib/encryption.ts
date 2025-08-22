import { generateSecureToken } from './security';

// Encryption configuration
const ENCRYPTION_CONFIG = {
  ALGORITHM: 'AES-GCM',
  KEY_LENGTH: 256,
  IV_LENGTH: 12,
  TAG_LENGTH: 16,
  KEY_DERIVATION_ITERATIONS: 100000,
  SALT_LENGTH: 16
};

// Key management
class KeyManager {
  private static masterKey: CryptoKey | null = null;
  private static keyCache = new Map<string, CryptoKey>();

  static async initialize(): Promise<void> {
    try {
      // Generate or retrieve master key
      const masterKeyString = localStorage.getItem('peakcrews_master_key');
      if (masterKeyString) {
        this.masterKey = await this.importKey(masterKeyString);
      } else {
        this.masterKey = await this.generateMasterKey();
        const exportedKey = await this.exportKey(this.masterKey);
        localStorage.setItem('peakcrews_master_key', exportedKey);
      }
    } catch (error) {
      console.error('Failed to initialize key manager:', error);
      throw new Error('Encryption initialization failed');
    }
  }

  private static async generateMasterKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: ENCRYPTION_CONFIG.KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private static async importKey(keyString: string): Promise<CryptoKey> {
    const keyData = this.base64ToArrayBuffer(keyString);
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'AES-GCM',
        length: ENCRYPTION_CONFIG.KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return this.arrayBufferToBase64(exported);
  }

  static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ENCRYPTION_CONFIG.KEY_DERIVATION_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: ENCRYPTION_CONFIG.KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static getMasterKey(): CryptoKey {
    if (!this.masterKey) {
      throw new Error('Key manager not initialized');
    }
    return this.masterKey;
  }

  static async getOrCreateKey(identifier: string): Promise<CryptoKey> {
    if (this.keyCache.has(identifier)) {
      return this.keyCache.get(identifier)!;
    }

    const key = await this.generateMasterKey();
    this.keyCache.set(identifier, key);
    return key;
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Data encryption utilities
export class DataEncryption {
  static async initialize(): Promise<void> {
    await KeyManager.initialize();
  }

  static async encrypt(data: string, key?: CryptoKey): Promise<string> {
    try {
      const encryptionKey = key || KeyManager.getMasterKey();
      const iv = crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.IV_LENGTH));
      const encodedData = new TextEncoder().encode(data);

      const encryptedData = await crypto.subtle.encrypt(
        {
          name: ENCRYPTION_CONFIG.ALGORITHM,
          iv: iv
        },
        encryptionKey,
        encodedData
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      return this.arrayBufferToBase64(combined.buffer);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static async decrypt(encryptedData: string, key?: CryptoKey): Promise<string> {
    try {
      const encryptionKey = key || KeyManager.getMasterKey();
      const combined = this.base64ToArrayBuffer(encryptedData);
      const combinedArray = new Uint8Array(combined);

      // Extract IV and encrypted data
      const iv = combinedArray.slice(0, ENCRYPTION_CONFIG.IV_LENGTH);
      const data = combinedArray.slice(ENCRYPTION_CONFIG.IV_LENGTH);

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: ENCRYPTION_CONFIG.ALGORITHM,
          iv: iv
        },
        encryptionKey,
        data
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static async encryptObject<T>(obj: T, key?: CryptoKey): Promise<string> {
    const jsonString = JSON.stringify(obj);
    return await this.encrypt(jsonString, key);
  }

  static async decryptObject<T>(encryptedData: string, key?: CryptoKey): Promise<T> {
    const decryptedString = await this.decrypt(encryptedData, key);
    return JSON.parse(decryptedString);
  }

  static async hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string; salt: string }> {
    const passwordSalt = salt || crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.SALT_LENGTH));
    const key = await KeyManager.deriveKey(password, passwordSalt);
    
    const hashBuffer = await crypto.subtle.exportKey('raw', key);
    const hash = this.arrayBufferToBase64(hashBuffer);
    const saltString = this.arrayBufferToBase64(passwordSalt.buffer as ArrayBuffer);

    return { hash, salt: saltString };
  }

  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    try {
      const saltBuffer = this.base64ToArrayBuffer(salt);
      const saltArray = new Uint8Array(saltBuffer);
      const { hash: computedHash } = await this.hashPassword(password, saltArray);
      return hash === computedHash;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  }

  static generateSecureId(): string {
    return generateSecureToken(32);
  }

  static async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: this.arrayBufferToBase64(publicKeyBuffer),
      privateKey: this.arrayBufferToBase64(privateKeyBuffer)
    };
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Secure storage utilities
export class SecureStorage {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const encryptedValue = await DataEncryption.encryptObject(value);
      localStorage.setItem(`encrypted_${key}`, encryptedValue);
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      throw new Error('Secure storage failed');
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const encryptedValue = localStorage.getItem(`encrypted_${key}`);
      if (!encryptedValue) return null;
      
      return await DataEncryption.decryptObject<T>(encryptedValue);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    localStorage.removeItem(`encrypted_${key}`);
  }

  static async clear(): Promise<void> {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('encrypted_')) {
        localStorage.removeItem(key);
      }
    }
  }

  static async setSensitiveData(key: string, value: any): Promise<void> {
    // For highly sensitive data, use additional encryption layer
    const sensitiveKey = await KeyManager.getOrCreateKey('sensitive_data');
    const encryptedValue = await DataEncryption.encryptObject(value, sensitiveKey);
    localStorage.setItem(`sensitive_${key}`, encryptedValue);
  }

  static async getSensitiveData<T>(key: string): Promise<T | null> {
    try {
      const encryptedValue = localStorage.getItem(`sensitive_${key}`);
      if (!encryptedValue) return null;
      
      const sensitiveKey = await KeyManager.getOrCreateKey('sensitive_data');
      return await DataEncryption.decryptObject<T>(encryptedValue, sensitiveKey);
    } catch (error) {
      console.error('Failed to retrieve sensitive data:', error);
      return null;
    }
  }
}

// Data sanitization and validation
export class DataProtection {
  static sanitizePersonalData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    } else if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveField(key)) {
          sanitized[key] = this.maskSensitiveData(value);
        } else {
          sanitized[key] = this.sanitizePersonalData(value);
        }
      }
      return sanitized;
    }
    return data;
  }

  private static sanitizeString(str: string): string {
    return str
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  private static isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'password', 'ssn', 'credit_card', 'card_number', 'cvv', 'pin',
      'social_security', 'tax_id', 'driver_license', 'passport',
      'bank_account', 'routing_number', 'account_number'
    ];
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field)
    );
  }

  private static maskSensitiveData(value: any): string {
    if (typeof value === 'string') {
      if (value.length <= 4) return '*'.repeat(value.length);
      return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }
    return '***';
  }

  static validateDataIntegrity(data: any, checksum: string): boolean {
    try {
      const dataString = JSON.stringify(data);
      const computedChecksum = this.computeChecksum(dataString);
      return computedChecksum === checksum;
    } catch (error) {
      console.error('Data integrity validation failed:', error);
      return false;
    }
  }

  static computeChecksum(data: string): string {
    // Simple checksum for demo - in production, use SHA-256
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  static async encryptSensitiveFields(data: any): Promise<any> {
    const sensitiveFields = ['email', 'phone', 'address', 'ssn', 'credit_card'];
    const encrypted: any = { ...data };

    for (const field of sensitiveFields) {
      if (data[field] && typeof data[field] === 'string') {
        encrypted[field] = await DataEncryption.encrypt(data[field]);
      }
    }

    return encrypted;
  }

  static async decryptSensitiveFields(data: any): Promise<any> {
    const sensitiveFields = ['email', 'phone', 'address', 'ssn', 'credit_card'];
    const decrypted: any = { ...data };

    for (const field of sensitiveFields) {
      if (data[field] && typeof data[field] === 'string' && data[field].length > 50) {
        try {
          decrypted[field] = await DataEncryption.decrypt(data[field]);
        } catch (error) {
          // Field might not be encrypted, keep original
          decrypted[field] = data[field];
        }
      }
    }

    return decrypted;
  }
}

// Initialize encryption system
export const initializeEncryption = async (): Promise<void> => {
  await DataEncryption.initialize();
};
