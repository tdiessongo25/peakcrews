"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { 
  Shield, 
  Users, 
  Briefcase, 
  FileText, 
  AlertTriangle,
  Settings,
  BarChart3,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { PendingApproval } from '@/lib/admin-service';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();

  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Shield className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin panel.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const fetchPendingApprovals = async () => {
    try {
      setIsLoadingApprovals(true);
      const response = await fetch('/api/admin/approvals');
      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(data.approvals);
      }
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    } finally {
      setIsLoadingApprovals(false);
    }
  };

  const handleApprovalAction = async (approvalId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await fetch('/api/admin/approvals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalId, action, notes }),
      });

      if (response.ok) {
        toast({
          title: `Approval ${action}d`,
          description: `Successfully ${action}d the request.`,
        });
        fetchPendingApprovals(); // Refresh the list
      } else {
        toast({
          title: 'Error',
          description: 'Failed to process approval.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to process approval:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while processing the approval.',
        variant: 'destructive',
      });
    }
  };

  const getApprovalIcon = (type: PendingApproval['type']) => {
    switch (type) {
      case 'worker_verification':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'job_approval':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'payment_release':
        return <DollarSign className="h-4 w-4 text-yellow-600" />;
      case 'dispute_resolution':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: PendingApproval['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-lg text-muted-foreground">
          Manage your platform, users, and monitor system performance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Approvals
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage platform users, view profiles, and control access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage all platform users, their status, and permissions.
                </p>
                <Button>
                  View All Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Management
              </CardTitle>
              <CardDescription>
                Monitor and manage all job postings on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Job Management</h3>
                <p className="text-muted-foreground mb-4">
                  Review job postings, monitor activity, and manage job status.
                </p>
                <Button>
                  View All Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Management
              </CardTitle>
              <CardDescription>
                Track and manage job applications across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Application Management</h3>
                <p className="text-muted-foreground mb-4">
                  Monitor job applications, track success rates, and manage disputes.
                </p>
                <Button>
                  View All Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Review and process pending user verifications and job approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingApprovals ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading approvals...</p>
                </div>
              ) : pendingApprovals.length > 0 ? (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getApprovalIcon(approval.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{approval.description}</h4>
                          <Badge className={`text-xs ${getPriorityColor(approval.priority)}`}>
                            {approval.priority}
                          </Badge>
                        </div>
                        {approval.userName && (
                          <p className="text-sm text-muted-foreground mb-1">
                            User: {approval.userName}
                          </p>
                        )}
                        {approval.jobTitle && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Job: {approval.jobTitle}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Submitted: {formatDate(approval.submittedDate)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprovalAction(approval.id, 'approve')}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApprovalAction(approval.id, 'reject')}
                          className="flex items-center gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                  <p className="text-muted-foreground">
                    All approvals have been processed. Check back later for new requests.
                  </p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <Button onClick={fetchPendingApprovals} variant="outline">
                  Refresh Approvals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>
                View detailed analytics, revenue reports, and platform insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive analytics, revenue tracking, and business insights.
                </p>
                <Button>
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 