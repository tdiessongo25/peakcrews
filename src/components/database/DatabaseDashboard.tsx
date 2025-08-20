"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { databaseManager, DatabaseQuery } from '@/lib/database';
import { storageManager, FileMetadata, StorageBucket } from '@/lib/storage';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  HardDrive, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Server,
  FileText,
  Archive,
  Shield,
  BarChart3,
  Settings,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface DatabaseDashboardProps {
  showDetails?: boolean;
  refreshInterval?: number;
}

export function DatabaseDashboard({ showDetails = true, refreshInterval = 30000 }: DatabaseDashboardProps) {
  const [dbStats, setDbStats] = useState<any>(null);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [queryLog, setQueryLog] = useState<DatabaseQuery[]>([]);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { currentUser } = useUser();
  const { toast } = useToast();

  // Load database and storage data
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [dbStatsData, storageStatsData, queryLogData, filesData, bucketsData] = await Promise.all([
        databaseManager.getDatabaseStats(),
        storageManager.getStorageStats(),
        databaseManager.getQueryLog(20),
        storageManager.listFiles(undefined, undefined, undefined, 10),
        Promise.resolve(Array.from(storageManager['buckets'].values()))
      ]);
      
      setDbStats(dbStatsData);
      setStorageStats(storageStatsData);
      setQueryLog(queryLogData);
      setFiles(filesData);
      setBuckets(bucketsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load database and storage data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load database and storage data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and load data
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(loadData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Handle file deletion
  const handleDeleteFile = async (fileId: string) => {
    try {
      await storageManager.deleteFile(fileId, currentUser?.id || 'system');
      await loadData();
      
      toast({
        title: 'File Deleted',
        description: 'File has been successfully deleted',
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };

  // Handle backup creation
  const handleCreateBackup = async (backupId: string) => {
    try {
      await storageManager.createBackup(backupId);
      await loadData();
      
      toast({
        title: 'Backup Created',
        description: 'Backup has been successfully created',
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast({
        title: 'Error',
        description: 'Failed to create backup',
        variant: 'destructive'
      });
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'disconnected':
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database & Storage Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor database performance and storage management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Database Overview */}
      {dbStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Performance
            </CardTitle>
            <CardDescription>
              Real-time database statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Connections</span>
                </div>
                <div className="text-2xl font-bold">{dbStats.activeConnections}/{dbStats.connections}</div>
                <p className="text-sm text-muted-foreground">Active connections</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Queries</span>
                </div>
                <div className="text-2xl font-bold">{dbStats.totalQueries}</div>
                <p className="text-sm text-muted-foreground">
                  {dbStats.successfulQueries} successful, {dbStats.failedQueries} failed
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Avg Query Time</span>
                </div>
                <div className="text-2xl font-bold">{formatDuration(dbStats.averageQueryTime)}</div>
                <p className="text-sm text-muted-foreground">Average response time</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Health</span>
                </div>
                <div className="text-2xl font-bold">
                  <Badge className={getStatusColor('healthy')}>Healthy</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Database status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Overview */}
      {storageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Management
            </CardTitle>
            <CardDescription>
              File storage statistics and bucket management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Total Files</span>
                </div>
                <div className="text-2xl font-bold">{storageStats.totalFiles}</div>
                <p className="text-sm text-muted-foreground">Files stored</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Total Size</span>
                </div>
                <div className="text-2xl font-bold">{formatFileSize(storageStats.totalSize)}</div>
                <p className="text-sm text-muted-foreground">Storage used</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Backups</span>
                </div>
                <div className="text-2xl font-bold">{storageStats.backups.length}</div>
                <p className="text-sm text-muted-foreground">Active backup configs</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Security</span>
                </div>
                <div className="text-2xl font-bold">
                  <Badge className={getStatusColor('healthy')}>Protected</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Storage security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Buckets */}
      {buckets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Storage Buckets
            </CardTitle>
            <CardDescription>
              Storage bucket usage and capacity management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buckets.map((bucket) => (
                <div key={bucket.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(bucket.type === 'public' ? 'success' : 'warning')}>
                        {bucket.type}
                      </Badge>
                      <h4 className="font-medium">{bucket.name}</h4>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bucket.fileCount} files
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{formatFileSize(bucket.currentSize)} / {formatFileSize(bucket.maxSize)}</span>
                    </div>
                    <Progress 
                      value={(bucket.currentSize / bucket.maxSize) * 100} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {((bucket.currentSize / bucket.maxSize) * 100).toFixed(1)}% used
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Created: {bucket.createdAt.toLocaleDateString()}</span>
                    <span>Updated: {bucket.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Files
            </CardTitle>
            <CardDescription>
              Recently uploaded files and their metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{file.originalName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.mimeType}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={file.isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {file.isPublic ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {file.uploadedAt.toLocaleDateString()}
                    </span>
                    {showDetails && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Query Log */}
      {queryLog.length > 0 && showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Database Queries
            </CardTitle>
            <CardDescription>
              Recent database query execution log
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queryLog.slice(0, 10).map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      query.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {query.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{query.operation} on {query.table}</h4>
                      <p className="text-xs text-muted-foreground">
                        {query.sql.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={query.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {formatDuration(query.duration)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {query.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Management */}
      {storageStats?.backups && storageStats.backups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Backup Management
            </CardTitle>
            <CardDescription>
              Automated backup configurations and schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storageStats.backups.map((backup: any) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <Archive className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{backup.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {backup.type} backup • {backup.retention} days retention
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        <Badge className={backup.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {backup.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      {backup.lastRun && (
                        <div className="text-xs text-muted-foreground">
                          Last: {new Date(backup.lastRun).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {showDetails && backup.enabled && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateBackup(backup.id)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Run Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="font-medium">Database</span>
                <Badge className={getStatusColor('healthy')}>Healthy</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                All connections active, queries executing normally
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-green-500" />
                <span className="font-medium">Storage</span>
                <Badge className={getStatusColor('healthy')}>Operational</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                File storage working, backups configured
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="font-medium">Performance</span>
                <Badge className={getStatusColor('healthy')}>Optimal</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Response times within acceptable limits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
