import { Metadata } from 'next';
import { DatabaseDashboard } from '@/components/database/DatabaseDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, HardDrive, Activity, TrendingUp, Shield, Settings, Archive, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Database & Storage Management - PeakCrews',
  description: 'Comprehensive database and storage management system',
};

export default function DatabaseStoragePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Database & Storage Management</h1>
          <p className="text-muted-foreground">
            Comprehensive database performance monitoring and storage management system
          </p>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Overview
            </CardTitle>
            <CardDescription>
              PeakCrews database and storage infrastructure overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">PostgreSQL Database</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade relational database with connection pooling
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Encrypted file storage with automated backup management
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Performance Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time performance metrics and query optimization
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-medium">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive backup, encryption, and security measures
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Dashboard */}
        <DatabaseDashboard showDetails={true} refreshInterval={30000} />

        {/* Database Schema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Database Schema
            </CardTitle>
            <CardDescription>
              Core database tables and relationships for PeakCrews platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Core Tables</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">users</h4>
                        <p className="text-sm text-muted-foreground">User accounts and authentication</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">Primary</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">worker_profiles</h4>
                        <p className="text-sm text-muted-foreground">Worker profiles and skills</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">Related</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">hirer_profiles</h4>
                        <p className="text-sm text-muted-foreground">Hirer profiles and company info</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">Related</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">jobs</h4>
                        <p className="text-sm text-muted-foreground">Job postings and requirements</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-orange-100 text-orange-800">Core</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Supporting Tables</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">applications</h4>
                        <p className="text-sm text-muted-foreground">Job applications and proposals</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-red-100 text-red-800">Core</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">sessions</h4>
                        <p className="text-sm text-muted-foreground">User sessions and authentication</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-indigo-100 text-indigo-800">Security</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                        <Database className="h-4 w-4 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">security_events</h4>
                        <p className="text-sm text-muted-foreground">Security monitoring and logging</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-pink-100 text-pink-800">Security</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Features
            </CardTitle>
            <CardDescription>
              Advanced storage capabilities and management features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">File Management</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Secure file upload with validation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Automatic file encryption and compression
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    File type and size restrictions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Access control and permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    File metadata and tagging system
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Backup & Recovery</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Automated daily, weekly, and monthly backups
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Encrypted backup storage
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Configurable retention policies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Point-in-time recovery capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Disaster recovery procedures
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators and optimization metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Database Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Query Response Time</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">2.3ms avg</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Connection Pool Usage</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">45%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Hit Rate</span>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">98.5%</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Storage Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Speed</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">50 MB/s</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Download Speed</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">100 MB/s</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Compression Ratio</span>
                    <Badge variant="default" className="bg-orange-100 text-orange-800">75%</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">System Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">99.99%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">0.01%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Backup Success</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">100%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Features
            </CardTitle>
            <CardDescription>
              Comprehensive security measures for data protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Database Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SSL/TLS encrypted connections</li>
                  <li>• Parameterized queries to prevent SQL injection</li>
                  <li>• Role-based access control (RBAC)</li>
                  <li>• Query logging and monitoring</li>
                  <li>• Connection pooling with authentication</li>
                  <li>• Database-level encryption at rest</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Storage Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AES-256 encryption for all files</li>
                  <li>• Secure file upload validation</li>
                  <li>• Access control and permissions</li>
                  <li>• Secure file deletion with overwrite</li>
                  <li>• Backup encryption and integrity checks</li>
                  <li>• Audit logging for all file operations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Management Tools
            </CardTitle>
            <CardDescription>
              Administrative tools and utilities for system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Database Tools</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Query performance analyzer</li>
                  <li>• Database schema migration</li>
                  <li>• Connection pool monitoring</li>
                  <li>• Query log analysis</li>
                  <li>• Database health checks</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Storage Tools</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• File management interface</li>
                  <li>• Backup scheduling and management</li>
                  <li>• Storage quota management</li>
                  <li>• File cleanup utilities</li>
                  <li>• Storage analytics</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Monitoring Tools</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time performance monitoring</li>
                  <li>• Alert and notification system</li>
                  <li>• Capacity planning tools</li>
                  <li>• Security event monitoring</li>
                  <li>• System health dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Database & Storage Support
            </CardTitle>
            <CardDescription>
              Technical support and maintenance information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Technical Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Database Support:</span>
                    <span className="font-medium">db-support@peakcrews.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Support:</span>
                    <span className="font-medium">storage-support@peakcrews.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Hotline:</span>
                    <span className="font-medium">+1-800-DB-SUPPORT</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Maintenance Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Database Maintenance:</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">Weekly</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Maintenance:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Daily</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Verification:</span>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">Monthly</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
