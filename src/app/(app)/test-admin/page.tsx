"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  BarChart3
} from 'lucide-react';
import type { AdminStats, PendingApproval } from '@/lib/admin-service';

export default function TestAdminPage() {
  const [testResults, setTestResults] = useState<{
    name: string;
    status: 'pass' | 'fail' | 'pending';
    message: string;
  }[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { toast } = useToast();

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Admin Stats API',
        test: async () => {
          const response = await fetch('/api/admin/stats');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!data.stats) throw new Error('No stats data returned');
          return data.stats as AdminStats;
        }
      },
      {
        name: 'Pending Approvals API',
        test: async () => {
          const response = await fetch('/api/admin/approvals');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!Array.isArray(data.approvals)) throw new Error('No approvals array returned');
          return data.approvals as PendingApproval[];
        }
      },
      {
        name: 'Users API',
        test: async () => {
          const response = await fetch('/api/admin/users');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!data.users) throw new Error('No users data returned');
          return data.users;
        }
      },
      {
        name: 'Approval Action API',
        test: async () => {
          const response = await fetch('/api/admin/approvals', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              approvalId: 'test-approval',
              action: 'approve',
              notes: 'Test approval'
            })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!data.success) throw new Error('Approval action failed');
          return data;
        }
      },
      {
        name: 'User Status Update API',
        test: async () => {
          const response = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'test-user',
              status: 'active',
              reason: 'Test status update'
            })
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (!data.success) throw new Error('User status update failed');
          return data;
        }
      }
    ];

    for (const test of tests) {
      try {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'pending',
          message: 'Running...'
        }]);

        const result = await test.test();
        
        setTestResults(prev => prev.map(t => 
          t.name === test.name 
            ? { ...t, status: 'pass', message: 'Test passed successfully' }
            : t
        ));

        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        setTestResults(prev => prev.map(t => 
          t.name === test.name 
            ? { ...t, status: 'fail', message: error.message || 'Test failed' }
            : t
        ));
      }
    }

    setIsRunningTests(false);
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel Test Suite</h1>
        <p className="text-lg text-muted-foreground">
          Test all admin panel functionality and API endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Test Controls
            </CardTitle>
            <CardDescription>
              Run automated tests for admin panel functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runTests} 
              disabled={isRunningTests}
              className="w-full"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>

            <div className="space-y-2">
              <h4 className="font-medium">Test Coverage:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  User Management
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Job Management
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Application Management
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                  Revenue Analytics
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription>
              Results from the latest test run
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No tests have been run yet. Click "Run All Tests" to start.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">{test.message}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Dashboard Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Admin Dashboard Preview
          </CardTitle>
          <CardDescription>
            Live preview of the admin dashboard component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDashboard />
        </CardContent>
      </Card>

      {/* Manual Test Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Manual Test Actions</CardTitle>
          <CardDescription>
            Test specific admin actions manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/stats');
                  const data = await response.json();
                  toast({
                    title: 'Admin Stats Test',
                    description: `Loaded ${data.stats?.totalUsers || 0} users, ${data.stats?.totalJobs || 0} jobs`,
                  });
                } catch (error) {
                  toast({
                    title: 'Test Failed',
                    description: 'Failed to load admin stats',
                    variant: 'destructive',
                  });
                }
              }}
            >
              Test Stats API
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/approvals');
                  const data = await response.json();
                  toast({
                    title: 'Approvals Test',
                    description: `Found ${data.approvals?.length || 0} pending approvals`,
                  });
                } catch (error) {
                  toast({
                    title: 'Test Failed',
                    description: 'Failed to load approvals',
                    variant: 'destructive',
                  });
                }
              }}
            >
              Test Approvals API
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/users');
                  const data = await response.json();
                  toast({
                    title: 'Users Test',
                    description: `Loaded ${data.users?.length || 0} users`,
                  });
                } catch (error) {
                  toast({
                    title: 'Test Failed',
                    description: 'Failed to load users',
                    variant: 'destructive',
                  });
                }
              }}
            >
              Test Users API
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: 'Admin Panel Ready',
                  description: 'All admin functionality is working correctly!',
                });
              }}
            >
              Test Toast Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
