import { DataEncryption, SecureStorage } from './encryption';
import { logSecurityEvent } from './security';

// Storage configuration
const STORAGE_CONFIG = {
  TYPE: 'local', // 'local', 's3', 'gcs', 'azure'
  LOCAL_PATH: process.env.STORAGE_LOCAL_PATH || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.STORAGE_MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv'
  ],
  BACKUP_ENABLED: process.env.STORAGE_BACKUP_ENABLED === 'true',
  BACKUP_RETENTION_DAYS: parseInt(process.env.STORAGE_BACKUP_RETENTION_DAYS || '30'),
  ENCRYPTION_ENABLED: process.env.STORAGE_ENCRYPTION_ENABLED === 'true'
};

// File metadata interface
export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url?: string;
  uploadedBy: string;
  uploadedAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  tags: string[];
  checksum: string;
  encrypted: boolean;
  compressionRatio?: number;
}

// Storage bucket interface
export interface StorageBucket {
  id: string;
  name: string;
  type: 'public' | 'private' | 'temp';
  maxSize: number;
  currentSize: number;
  fileCount: number;
  createdAt: Date;
  updatedAt: Date;
  policies: StoragePolicy[];
}

// Storage policy interface
export interface StoragePolicy {
  id: string;
  name: string;
  type: 'size_limit' | 'file_type' | 'retention' | 'encryption';
  value: any;
  enabled: boolean;
}

// Backup configuration interface
export interface BackupConfig {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  schedule: string; // cron expression
  retention: number; // days
  compression: boolean;
  encryption: boolean;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

// Storage manager class
export class StorageManager {
  private static instance: StorageManager;
  private files: Map<string, FileMetadata> = new Map();
  private buckets: Map<string, StorageBucket> = new Map();
  private backups: Map<string, BackupConfig> = new Map();
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Initialize storage manager
  private async initialize(): Promise<void> {
    try {
      // Initialize storage buckets
      await this.initializeBuckets();
      
      // Initialize backup configurations
      await this.initializeBackups();
      
      // Load existing files
      await this.loadExistingFiles();
      
      this.isInitialized = true;
      
      logSecurityEvent('storage_initialized', {
        timestamp: new Date().toISOString(),
        config: {
          type: STORAGE_CONFIG.TYPE,
          maxFileSize: STORAGE_CONFIG.MAX_FILE_SIZE,
          encryptionEnabled: STORAGE_CONFIG.ENCRYPTION_ENABLED
        }
      });
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new Error('Storage initialization failed');
    }
  }

  // Initialize storage buckets
  private async initializeBuckets(): Promise<void> {
    try {
      // Create default buckets
      const defaultBuckets: StorageBucket[] = [
        {
          id: 'public',
          name: 'Public Files',
          type: 'public',
          maxSize: 1024 * 1024 * 1024, // 1GB
          currentSize: 0,
          fileCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          policies: [
            {
              id: 'public_size_limit',
              name: 'Size Limit',
              type: 'size_limit',
              value: 10 * 1024 * 1024, // 10MB
              enabled: true
            },
            {
              id: 'public_file_types',
              name: 'Allowed File Types',
              type: 'file_type',
              value: ['image/jpeg', 'image/png', 'image/gif'],
              enabled: true
            }
          ]
        },
        {
          id: 'private',
          name: 'Private Files',
          type: 'private',
          maxSize: 5 * 1024 * 1024 * 1024, // 5GB
          currentSize: 0,
          fileCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          policies: [
            {
              id: 'private_size_limit',
              name: 'Size Limit',
              type: 'size_limit',
              value: 50 * 1024 * 1024, // 50MB
              enabled: true
            },
            {
              id: 'private_encryption',
              name: 'Encryption Required',
              type: 'encryption',
              value: true,
              enabled: true
            }
          ]
        },
        {
          id: 'temp',
          name: 'Temporary Files',
          type: 'temp',
          maxSize: 100 * 1024 * 1024, // 100MB
          currentSize: 0,
          fileCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          policies: [
            {
              id: 'temp_retention',
              name: 'Retention Policy',
              type: 'retention',
              value: 24 * 60 * 60 * 1000, // 24 hours
              enabled: true
            }
          ]
        }
      ];

      for (const bucket of defaultBuckets) {
        this.buckets.set(bucket.id, bucket);
        await SecureStorage.setItem(`storage_bucket_${bucket.id}`, bucket);
      }
    } catch (error) {
      console.error('Failed to initialize storage buckets:', error);
      throw new Error('Storage bucket initialization failed');
    }
  }

  // Initialize backup configurations
  private async initializeBackups(): Promise<void> {
    try {
      const backupConfigs: BackupConfig[] = [
        {
          id: 'daily_backup',
          name: 'Daily Backup',
          type: 'full',
          schedule: '0 2 * * *', // Daily at 2 AM
          retention: 7,
          compression: true,
          encryption: true,
          enabled: true
        },
        {
          id: 'weekly_backup',
          name: 'Weekly Backup',
          type: 'full',
          schedule: '0 3 * * 0', // Weekly on Sunday at 3 AM
          retention: 30,
          compression: true,
          encryption: true,
          enabled: true
        },
        {
          id: 'monthly_backup',
          name: 'Monthly Backup',
          type: 'full',
          schedule: '0 4 1 * *', // Monthly on 1st at 4 AM
          retention: 365,
          compression: true,
          encryption: true,
          enabled: true
        }
      ];

      for (const config of backupConfigs) {
        this.backups.set(config.id, config);
        await SecureStorage.setItem(`backup_config_${config.id}`, config);
      }
    } catch (error) {
      console.error('Failed to initialize backup configurations:', error);
      throw new Error('Backup configuration initialization failed');
    }
  }

  // Load existing files
  private async loadExistingFiles(): Promise<void> {
    try {
      // In a real implementation, this would load files from the storage system
      // For now, we'll start with an empty file collection
      console.log('Loading existing files...');
    } catch (error) {
      console.error('Failed to load existing files:', error);
      throw new Error('File loading failed');
    }
  }

  // Upload file
  async uploadFile(
    file: File,
    bucketId: string = 'private',
    uploadedBy: string,
    isPublic: boolean = false,
    tags: string[] = []
  ): Promise<FileMetadata> {
    try {
      // Validate file
      await this.validateFile(file, bucketId);
      
      // Generate file ID and metadata
      const fileId = DataEncryption.generateSecureId();
      const checksum = await this.calculateChecksum(file);
      
      // Create file metadata
      const metadata: FileMetadata = {
        id: fileId,
        filename: `${fileId}_${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: `${bucketId}/${fileId}/${file.name}`,
        uploadedBy,
        uploadedAt: new Date(),
        isPublic,
        tags,
        checksum,
        encrypted: STORAGE_CONFIG.ENCRYPTION_ENABLED
      };

      // Process file (encrypt, compress, etc.)
      const processedFile = await this.processFile(file, metadata);
      
      // Store file
      await this.storeFile(processedFile, metadata);
      
      // Update bucket statistics
      await this.updateBucketStats(bucketId, file.size);
      
      // Store metadata
      this.files.set(fileId, metadata);
      await SecureStorage.setItem(`file_metadata_${fileId}`, metadata);
      
      // Log upload event
      logSecurityEvent('file_uploaded', {
        fileId,
        filename: file.name,
        size: file.size,
        uploadedBy,
        bucketId,
        timestamp: metadata.uploadedAt.toISOString()
      });

      return metadata;
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('File upload failed');
    }
  }

  // Validate file
  private async validateFile(file: File, bucketId: string): Promise<void> {
    const bucket = this.buckets.get(bucketId);
    if (!bucket) {
      throw new Error(`Bucket ${bucketId} not found`);
    }

    // Check file size
    const sizePolicy = bucket.policies.find(p => p.type === 'size_limit' && p.enabled);
    if (sizePolicy && file.size > sizePolicy.value) {
      throw new Error(`File size ${file.size} exceeds limit ${sizePolicy.value}`);
    }

    // Check file type
    const typePolicy = bucket.policies.find(p => p.type === 'file_type' && p.enabled);
    if (typePolicy && !typePolicy.value.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    // Check bucket capacity
    if (bucket.currentSize + file.size > bucket.maxSize) {
      throw new Error(`Bucket ${bucketId} is full`);
    }
  }

  // Calculate file checksum
  private async calculateChecksum(file: File): Promise<string> {
    // In a real implementation, this would calculate SHA-256 checksum
    return `checksum_${file.name}_${file.size}`;
  }

  // Process file (encrypt, compress, etc.)
  private async processFile(file: File, metadata: FileMetadata): Promise<File> {
    let processedFile = file;

    // Encrypt file if required
    if (STORAGE_CONFIG.ENCRYPTION_ENABLED) {
      processedFile = await this.encryptFile(file);
    }

    // Compress file if beneficial
    if (file.size > 1024 * 1024) { // 1MB
      processedFile = await this.compressFile(processedFile);
      metadata.compressionRatio = file.size / processedFile.size;
    }

    return processedFile;
  }

  // Encrypt file
  private async encryptFile(file: File): Promise<File> {
    // In a real implementation, this would encrypt the file
    // For now, we'll return the original file
    return file;
  }

  // Compress file
  private async compressFile(file: File): Promise<File> {
    // In a real implementation, this would compress the file
    // For now, we'll return the original file
    return file;
  }

  // Store file
  private async storeFile(file: File, metadata: FileMetadata): Promise<void> {
    // In a real implementation, this would store the file in the storage system
    // For now, we'll simulate storage
    console.log(`Storing file: ${metadata.filename} at ${metadata.path}`);
  }

  // Update bucket statistics
  private async updateBucketStats(bucketId: string, fileSize: number): Promise<void> {
    const bucket = this.buckets.get(bucketId);
    if (bucket) {
      bucket.currentSize += fileSize;
      bucket.fileCount += 1;
      bucket.updatedAt = new Date();
      
      this.buckets.set(bucketId, bucket);
      await SecureStorage.setItem(`storage_bucket_${bucketId}`, bucket);
    }
  }

  // Download file
  async downloadFile(fileId: string, userId?: string): Promise<FileMetadata> {
    try {
      const metadata = this.files.get(fileId);
      if (!metadata) {
        throw new Error('File not found');
      }

      // Check access permissions
      if (!metadata.isPublic && metadata.uploadedBy !== userId) {
        throw new Error('Access denied');
      }

      // Check if file has expired
      if (metadata.expiresAt && metadata.expiresAt < new Date()) {
        throw new Error('File has expired');
      }

      // Log download event
      logSecurityEvent('file_downloaded', {
        fileId,
        filename: metadata.originalName,
        downloadedBy: userId,
        timestamp: new Date().toISOString()
      });

      return metadata;
    } catch (error) {
      console.error('File download failed:', error);
      throw new Error('File download failed');
    }
  }

  // Delete file
  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      const metadata = this.files.get(fileId);
      if (!metadata) {
        throw new Error('File not found');
      }

      // Check permissions
      if (metadata.uploadedBy !== userId) {
        throw new Error('Access denied');
      }

      // Remove file from storage
      await this.removeFileFromStorage(metadata);

      // Update bucket statistics
      const bucket = this.buckets.get(metadata.path.split('/')[0]);
      if (bucket) {
        bucket.currentSize -= metadata.size;
        bucket.fileCount -= 1;
        bucket.updatedAt = new Date();
        
        this.buckets.set(bucket.id, bucket);
        await SecureStorage.setItem(`storage_bucket_${bucket.id}`, bucket);
      }

      // Remove metadata
      this.files.delete(fileId);
      await SecureStorage.removeItem(`file_metadata_${fileId}`);

      // Log deletion event
      logSecurityEvent('file_deleted', {
        fileId,
        filename: metadata.originalName,
        deletedBy: userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('File deletion failed:', error);
      throw new Error('File deletion failed');
    }
  }

  // Remove file from storage
  private async removeFileFromStorage(metadata: FileMetadata): Promise<void> {
    // In a real implementation, this would remove the file from the storage system
    console.log(`Removing file: ${metadata.filename} from ${metadata.path}`);
  }

  // List files
  async listFiles(
    bucketId?: string,
    uploadedBy?: string,
    tags?: string[],
    limit: number = 50,
    offset: number = 0
  ): Promise<FileMetadata[]> {
    try {
      let files = Array.from(this.files.values());

      // Filter by bucket
      if (bucketId) {
        files = files.filter(f => f.path.startsWith(bucketId));
      }

      // Filter by uploader
      if (uploadedBy) {
        files = files.filter(f => f.uploadedBy === uploadedBy);
      }

      // Filter by tags
      if (tags && tags.length > 0) {
        files = files.filter(f => tags.some(tag => f.tags.includes(tag)));
      }

      // Sort by upload date (newest first)
      files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

      // Apply pagination
      return files.slice(offset, offset + limit);
    } catch (error) {
      console.error('File listing failed:', error);
      throw new Error('File listing failed');
    }
  }

  // Create backup
  async createBackup(backupId: string): Promise<void> {
    try {
      const backupConfig = this.backups.get(backupId);
      if (!backupConfig) {
        throw new Error('Backup configuration not found');
      }

      if (!backupConfig.enabled) {
        throw new Error('Backup is disabled');
      }

      // Create backup
      const backupData = await this.prepareBackupData();
      const backupFile = await this.createBackupFile(backupData, backupConfig);
      
      // Store backup
      await this.storeBackup(backupFile, backupConfig);
      
      // Update backup config
      backupConfig.lastRun = new Date();
      backupConfig.nextRun = this.calculateNextRun(backupConfig.schedule);
      
      this.backups.set(backupId, backupConfig);
      await SecureStorage.setItem(`backup_config_${backupId}`, backupConfig);

      // Log backup event
      logSecurityEvent('backup_created', {
        backupId,
        type: backupConfig.type,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error('Backup creation failed');
    }
  }

  // Prepare backup data
  private async prepareBackupData(): Promise<any> {
    return {
      files: Array.from(this.files.values()),
      buckets: Array.from(this.buckets.values()),
      timestamp: new Date().toISOString()
    };
  }

  // Create backup file
  private async createBackupFile(data: any, config: BackupConfig): Promise<File> {
    // In a real implementation, this would create a backup file
    // For now, we'll simulate the backup file creation
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return new File([blob], `backup_${config.id}_${Date.now()}.json`);
  }

  // Store backup
  private async storeBackup(backupFile: File, config: BackupConfig): Promise<void> {
    // In a real implementation, this would store the backup
    console.log(`Storing backup: ${backupFile.name}`);
  }

  // Calculate next run time
  private calculateNextRun(schedule: string): Date {
    // In a real implementation, this would parse the cron expression
    // For now, we'll return a date 24 hours from now
    const nextRun = new Date();
    nextRun.setHours(nextRun.getHours() + 24);
    return nextRun;
  }

  // Get storage statistics
  async getStorageStats(): Promise<any> {
    const totalFiles = this.files.size;
    const totalSize = Array.from(this.files.values()).reduce((sum, f) => sum + f.size, 0);
    const bucketStats = Array.from(this.buckets.values()).map(b => ({
      id: b.id,
      name: b.name,
      currentSize: b.currentSize,
      maxSize: b.maxSize,
      fileCount: b.fileCount,
      usagePercentage: (b.currentSize / b.maxSize) * 100
    }));

    return {
      totalFiles,
      totalSize,
      buckets: bucketStats,
      backups: Array.from(this.backups.values()).map(b => ({
        id: b.id,
        name: b.name,
        enabled: b.enabled,
        lastRun: b.lastRun,
        nextRun: b.nextRun
      }))
    };
  }

  // Clean up expired files
  async cleanupExpiredFiles(): Promise<number> {
    try {
      const now = new Date();
      const expiredFiles = Array.from(this.files.values()).filter(f => 
        f.expiresAt && f.expiresAt < now
      );

      let deletedCount = 0;
      for (const file of expiredFiles) {
        try {
          await this.deleteFile(file.id, 'system');
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete expired file ${file.id}:`, error);
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Cleanup failed:', error);
      return 0;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const stats = await this.getStorageStats();
      return stats.totalFiles >= 0; // Basic health check
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();
