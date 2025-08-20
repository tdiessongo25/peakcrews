"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { JobApplication } from '@/lib/types';

const getStatusInfo = (status: JobApplication['status']) => {
  switch (status) {
    case 'applied':
      return { 
        icon: <Clock className="h-4 w-4" />, 
        label: 'Applied', 
        color: 'bg-blue-100 text-blue-700 border-blue-300' 
      };
    case 'selected':
      return { 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: 'Selected', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300' 
      };
    case 'confirmed':
      return { 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: 'Confirmed', 
        color: 'bg-green-100 text-green-700 border-green-300' 
      };
    case 'rejected':
      return { 
        icon: <XCircle className="h-4 w-4" />, 
        label: 'Not Selected', 
        color: 'bg-red-100 text-red-700 border-red-300' 
      };
    case 'cancelled_by_worker':
      return { 
        icon: <XCircle className="h-4 w-4" />, 
        label: 'Cancelled by You', 
        color: 'bg-gray-100 text-gray-700 border-gray-300' 
      };
    case 'cancelled_by_hirer':
      return { 
        icon: <XCircle className="h-4 w-4" />, 
        label: 'Cancelled by Contractor', 
        color: 'bg-gray-100 text-gray-700 border-gray-300' 
      };
    default:
      return { 
        icon: <AlertCircle className="h-4 w-4" />, 
        label: 'Unknown', 
        color: 'bg-gray-100 text-gray-700 border-gray-300' 
      };
  }
};

export function ApplicationList() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      fetchApplications();
    }
  }, [currentUser]);

  const fetchApplications = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications?workerId=${currentUser.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        toast({
          title: 'Failed to load applications',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: 'Failed to load applications',
        description: 'An error occurred while loading your applications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled_by_worker',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Application Cancelled',
          description: 'Your application has been cancelled.',
        });
        fetchApplications(); // Refresh the list
      } else {
        toast({
          title: 'Failed to cancel application',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to cancel application:', error);
      toast({
        title: 'Failed to cancel application',
        description: 'An error occurred while cancelling your application.',
        variant: 'destructive',
      });
    }
  };

  if (!currentUser) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Please log in to view your applications.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading applications...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Applications</h2>
        <Button onClick={fetchApplications} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't applied to any jobs yet. Start browsing available jobs to apply.
            </p>
            <Button asChild>
              <a href="/jobs">Browse Jobs</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const statusInfo = getStatusInfo(application.status);
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
                      <CardDescription>
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={`px-3 py-1 ${statusInfo.color} flex items-center gap-1`}>
                      {statusInfo.icon} {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {application.coverLetter && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Cover Letter:</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.coverLetter.length > 150 
                          ? `${application.coverLetter.substring(0, 150)}...`
                          : application.coverLetter
                        }
                      </p>
                    </div>
                  )}
                  
                  {application.proposedRate && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-1">Proposed Rate:</h4>
                      <p className="text-sm text-muted-foreground">
                        ${application.proposedRate}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {(application.status === 'applied' || application.status === 'selected') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelApplication(application.id)}
                      >
                        Cancel Application
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/jobs/${application.jobId}`}>View Job</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 