import { useState, useEffect, useCallback } from 'react';
import { DataEncryption, SecureStorage, DataProtection } from '@/lib/encryption';
import { secureApiClient } from '@/lib/secure-api-client';
import { logSecurityEvent } from '@/lib/security';

interface UseSecureDataOptions {
  autoEncrypt?: boolean;
  sensitiveFields?: string[];
  persistToStorage?: boolean;
  storageKey?: string;
}

interface SecureDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isEncrypted: boolean;
}

export function useSecureData<T>(
  initialData?: T,
  options: UseSecureDataOptions = {}
) {
  const {
    autoEncrypt = false,
    sensitiveFields = [],
    persistToStorage = false,
    storageKey
  } = options;

  const [state, setState] = useState<SecureDataState<T>>({
    data: initialData || null,
    isLoading: false,
    error: null,
    isEncrypted: false
  });

  // Initialize encryption on mount
  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        await DataEncryption.initialize();
        
        // Load persisted data if requested
        if (persistToStorage && storageKey) {
          const persistedData = await SecureStorage.getItem<T>(storageKey);
          if (persistedData) {
            setState(prev => ({
              ...prev,
              data: persistedData,
              isEncrypted: true
            }));
          }
        }
      } catch (error) {
        console.error('Failed to initialize encryption:', error);
        setState(prev => ({
          ...prev,
          error: 'Encryption initialization failed'
        }));
      }
    };

    initializeEncryption();
  }, [persistToStorage, storageKey]);

  // Set data with optional encryption
  const setData = useCallback(async (newData: T) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      let processedData = newData;
      let isEncrypted = false;

      // Auto-encrypt if enabled
      if (autoEncrypt) {
        processedData = await DataProtection.encryptSensitiveFields(newData);
        isEncrypted = true;
      }

      // Persist to storage if requested
      if (persistToStorage && storageKey) {
        await SecureStorage.setItem(storageKey, processedData);
      }

      setState(prev => ({
        ...prev,
        data: processedData,
        isLoading: false,
        isEncrypted
      }));

      logSecurityEvent('secure_data_updated', {
        key: storageKey,
        encrypted: isEncrypted,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to set secure data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process data securely'
      }));
    }
  }, [autoEncrypt, persistToStorage, storageKey]);

  // Update specific fields securely
  const updateField = useCallback(async (field: keyof T, value: any) => {
    if (!state.data) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const updatedData = { ...state.data, [field]: value };
      let processedData = updatedData;
      let isEncrypted = state.isEncrypted;

      // Encrypt sensitive fields if needed
      if (sensitiveFields.includes(field as string)) {
        processedData = await DataProtection.encryptSensitiveFields(updatedData);
        isEncrypted = true;
      }

      // Persist to storage if requested
      if (persistToStorage && storageKey) {
        await SecureStorage.setItem(storageKey, processedData);
      }

      setState(prev => ({
        ...prev,
        data: processedData,
        isLoading: false,
        isEncrypted
      }));
    } catch (error) {
      console.error('Failed to update field securely:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update field securely'
      }));
    }
  }, [state.data, state.isEncrypted, sensitiveFields, persistToStorage, storageKey]);

  // Clear data and storage
  const clearData = useCallback(async () => {
    try {
      if (persistToStorage && storageKey) {
        await SecureStorage.removeItem(storageKey);
      }

      setState({
        data: null,
        isLoading: false,
        error: null,
        isEncrypted: false
      });

      logSecurityEvent('secure_data_cleared', {
        key: storageKey,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to clear secure data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to clear data securely'
      }));
    }
  }, [persistToStorage, storageKey]);

  // Decrypt data if needed
  const getDecryptedData = useCallback(async (): Promise<T | null> => {
    if (!state.data) return null;

    try {
      if (state.isEncrypted) {
        const decryptedData = await DataProtection.decryptSensitiveFields(state.data);
        return decryptedData;
      }
      return state.data;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to decrypt data'
      }));
      return null;
    }
  }, [state.data, state.isEncrypted]);

  // Validate data integrity
  const validateIntegrity = useCallback(async (checksum: string): Promise<boolean> => {
    if (!state.data) return false;

    try {
      return DataProtection.validateDataIntegrity(state.data, checksum);
    } catch (error) {
      console.error('Data integrity validation failed:', error);
      return false;
    }
  }, [state.data]);

  return {
    ...state,
    setData,
    updateField,
    clearData,
    getDecryptedData,
    validateIntegrity
  };
}

// Hook for secure API operations
export function useSecureApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secureRequest = useCallback(async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    options?: {
      encryptData?: boolean;
      sensitiveFields?: string[];
    }
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await secureApiClient.request<T>({
        method,
        endpoint,
        data,
        encryptData: options?.encryptData,
        sensitiveFields: options?.sensitiveFields
      });

      if (!response.success) {
        throw new Error(response.error || 'Request failed');
      }

      return response.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      setError(errorMessage);
      logSecurityEvent('secure_api_request_failed', {
        method,
        endpoint,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const secureGet = useCallback(<T>(endpoint: string): Promise<T | null> => {
    return secureRequest<T>('GET', endpoint);
  }, [secureRequest]);

  const securePost = useCallback(<T>(
    endpoint: string,
    data?: any,
    options?: { encryptData?: boolean; sensitiveFields?: string[] }
  ): Promise<T | null> => {
    return secureRequest<T>('POST', endpoint, data, options);
  }, [secureRequest]);

  const securePut = useCallback(<T>(
    endpoint: string,
    data?: any,
    options?: { encryptData?: boolean; sensitiveFields?: string[] }
  ): Promise<T | null> => {
    return secureRequest<T>('PUT', endpoint, data, options);
  }, [secureRequest]);

  const secureDelete = useCallback(<T>(endpoint: string): Promise<T | null> => {
    return secureRequest<T>('DELETE', endpoint);
  }, [secureRequest]);

  return {
    isLoading,
    error,
    secureRequest,
    secureGet,
    securePost,
    securePut,
    secureDelete
  };
}

// Hook for secure file operations
export function useSecureFiles() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encryptFile = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);

      const { SecureFileHandler } = await import('@/lib/secure-api-client');
      const result = await SecureFileHandler.encryptFile(file);

      logSecurityEvent('file_encrypted', {
        fileName: file.name,
        fileSize: file.size,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'File encryption failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const decryptFile = useCallback(async (encryptedData: string, metadata: any) => {
    try {
      setIsProcessing(true);
      setError(null);

      const { SecureFileHandler } = await import('@/lib/secure-api-client');
      const file = await SecureFileHandler.decryptFile(encryptedData, metadata);

      logSecurityEvent('file_decrypted', {
        fileName: metadata.originalName,
        timestamp: new Date().toISOString()
      });

      return file;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'File decryption failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    error,
    encryptFile,
    decryptFile
  };
}
