import { DataEncryption, SecureStorage, DataProtection } from './encryption';
import { logSecurityEvent } from './security';

// API configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.cursor.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Request/Response types
interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  encryptData?: boolean;
  sensitiveFields?: string[];
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  headers: Record<string, string>;
}

// Secure API client
export class SecureApiClient {
  private static instance: SecureApiClient;
  private sessionToken: string | null = null;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): SecureApiClient {
    if (!SecureApiClient.instance) {
      SecureApiClient.instance = new SecureApiClient();
    }
    return SecureApiClient.instance;
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize encryption
      await DataEncryption.initialize();
      
      // Load session token from secure storage
      this.sessionToken = await SecureStorage.getItem<string>('session_token');
      
      // Set up request interceptor for rate limiting
      this.setupRequestQueue();
      
      logSecurityEvent('api_client_initialized', { timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to initialize secure API client:', error);
      throw new Error('API client initialization failed');
    }
  }

  private setupRequestQueue(): void {
    // Process requests sequentially to prevent rate limiting
    setInterval(() => {
      this.processRequestQueue();
    }, 100);
  }

  private async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  private async queueRequest<T>(requestFn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await requestFn();
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async request<T>(config: ApiRequest): Promise<ApiResponse<T>> {
    return this.queueRequest(async () => {
      try {
        // Prepare request data
        let requestData = config.data;
        let requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers
        };

        // Add authentication header
        if (this.sessionToken) {
          requestHeaders['Authorization'] = `Bearer ${this.sessionToken}`;
        }

        // Encrypt sensitive data if requested
        if (config.encryptData && requestData) {
          requestData = await this.encryptRequestData(requestData, config.sensitiveFields);
          requestHeaders['X-Data-Encrypted'] = 'true';
        }

        // Add security headers
        requestHeaders = {
          ...requestHeaders,
          'X-Request-ID': DataEncryption.generateSecureId(),
          'X-Timestamp': new Date().toISOString(),
          'X-Client-Version': '1.0.0'
        };

        // Make the request
        const response = await this.makeRequest<T>(config.method, config.endpoint, requestData, requestHeaders);

        // Decrypt response data if needed
        if (response.data && response.headers['X-Data-Encrypted'] === 'true') {
          response.data = await this.decryptResponseData(response.data);
        }

        // Log security event
        logSecurityEvent('api_request_success', {
          method: config.method,
          endpoint: config.endpoint,
          status: response.status,
          timestamp: new Date().toISOString()
        });

        return response;
      } catch (error) {
        logSecurityEvent('api_request_failed', {
          method: config.method,
          endpoint: config.endpoint,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    });
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        return {
          success: response.ok,
          data: responseData,
          error: responseData.error,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Request failed');
        
        if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
          await this.delay(API_CONFIG.RETRY_DELAY * attempt);
        }
      }
    }

    throw lastError || new Error('Request failed after all retry attempts');
  }

  private async encryptRequestData(data: any, sensitiveFields?: string[]): Promise<any> {
    if (!sensitiveFields) {
      // Encrypt entire data object
      return await DataEncryption.encryptObject(data);
    }

    // Encrypt only sensitive fields
    const encryptedData = { ...data };
    for (const field of sensitiveFields) {
      if (data[field] && typeof data[field] === 'string') {
        encryptedData[field] = await DataEncryption.encrypt(data[field]);
      }
    }
    return encryptedData;
  }

  private async decryptResponseData(data: any): Promise<any> {
    if (typeof data === 'string') {
      return await DataEncryption.decrypt(data);
    }
    return await DataEncryption.decryptObject(data);
  }

  async setSessionToken(token: string): Promise<void> {
    this.sessionToken = token;
    await SecureStorage.setItem('session_token', token);
  }

  async clearSessionToken(): Promise<void> {
    this.sessionToken = null;
    await SecureStorage.removeItem('session_token');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Convenience methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', endpoint, headers });
  }

  async post<T>(endpoint: string, data?: any, options?: { encryptData?: boolean; sensitiveFields?: string[]; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      encryptData: options?.encryptData,
      sensitiveFields: options?.sensitiveFields,
      headers: options?.headers
    });
  }

  async put<T>(endpoint: string, data?: any, options?: { encryptData?: boolean; sensitiveFields?: string[]; headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data,
      encryptData: options?.encryptData,
      sensitiveFields: options?.sensitiveFields,
      headers: options?.headers
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', endpoint, headers });
  }
}

// Secure data transmission utilities
export class SecureDataTransmission {
  static async encryptForTransmission(data: any, recipientPublicKey?: string): Promise<string> {
    try {
      // For now, use symmetric encryption
      // In production, implement asymmetric encryption with recipient's public key
      const encryptedData = await DataEncryption.encryptObject(data);
      
      // Add integrity check
      const checksum = DataProtection.computeChecksum(JSON.stringify(data));
      const transmissionData = {
        data: encryptedData,
        checksum,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      return await DataEncryption.encryptObject(transmissionData);
    } catch (error) {
      console.error('Failed to encrypt data for transmission:', error);
      throw new Error('Data encryption failed');
    }
  }

  static async decryptFromTransmission(encryptedData: string): Promise<any> {
    try {
      const transmissionData = await DataEncryption.decryptObject(encryptedData) as any;
      
      // Verify integrity
      const decryptedData = await DataEncryption.decryptObject(transmissionData.data);
      const computedChecksum = DataProtection.computeChecksum(JSON.stringify(decryptedData));
      
      if (computedChecksum !== transmissionData.checksum) {
        throw new Error('Data integrity check failed');
      }

      return decryptedData;
    } catch (error) {
      console.error('Failed to decrypt data from transmission:', error);
      throw new Error('Data decryption failed');
    }
  }

  static async createSecureChannel(): Promise<{ channelId: string; publicKey: string; privateKey: string }> {
    const keyPair = await DataEncryption.generateKeyPair();
    const channelId = DataEncryption.generateSecureId();
    
    return {
      channelId,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  }
}

// Secure file handling
export class SecureFileHandler {
  static async encryptFile(file: File): Promise<{ encryptedData: string; metadata: any }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Data = btoa(String.fromCharCode(...uint8Array));
      
      const encryptedData = await DataEncryption.encrypt(base64Data);
      
      const metadata = {
        originalName: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        checksum: DataProtection.computeChecksum(base64Data)
      };

      return { encryptedData, metadata };
    } catch (error) {
      console.error('Failed to encrypt file:', error);
      throw new Error('File encryption failed');
    }
  }

  static async decryptFile(encryptedData: string, metadata: any): Promise<File> {
    try {
      const decryptedBase64 = await DataEncryption.decrypt(encryptedData);
      
      // Verify checksum
      const computedChecksum = DataProtection.computeChecksum(decryptedBase64);
      if (computedChecksum !== metadata.checksum) {
        throw new Error('File integrity check failed');
      }

      // Convert base64 back to file
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new File([bytes], metadata.originalName, {
        type: metadata.type,
        lastModified: metadata.lastModified
      });
    } catch (error) {
      console.error('Failed to decrypt file:', error);
      throw new Error('File decryption failed');
    }
  }
}

// Export singleton instance
export const secureApiClient = SecureApiClient.getInstance();
