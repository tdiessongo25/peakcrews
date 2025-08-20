"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  MessageSquare,
  Star,
  Download
} from 'lucide-react';
import type { JobApplication } from '@/lib/types';

interface JobApplicationsProps {
  jobId: string;
  jobTitle: string;
}

const getStatusInfo = (status: JobApplication['status']) => {
  switch (status) {
    case 'applied':
      return { 
        icon: <Clock className="h-4 w-4" />, 
        label: 'Applied', 
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        count: 0
      };
    case 'selected':
      return { 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: 'Selected', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        count: 0
      };
    case 'confirmed':
      return { 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: 'Confirmed', 
        color: 'bg-green-100 text-green-700 border-green-300',
        count: 0
      };
    case 'rejected':
      return { 
        icon: <XCircle className="h-4 w-4" />, 
        label: 'Rejected', 
        color: 'bg-red-100 text-red-700 border-red-300',
        count: 0
      };
    case 'cancelled_by_worker':
      return { 
        icon: <XCircle className="h-4 w-4" />, 
        label: 'Cancelled by Worker', 
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        count: 0
      };
    case 'cancelled_by_hirer':
      return { 
        icon: <XCircle className="h-4 w-4" />, 
        label: 'Cancelled by You', 
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        count: 0
      };
    default:
      return { 
        icon: <AlertCircle className="h-4 w-4" />, 
        label: 'Unknown', 
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        count: 0
      };
  }
};

export function JobApplications({ jobId, jobTitle }: JobApplicationsProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const { toast } = useToast();
  const { currentUser } = useUser();

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications?jobId=${jobId}`);
      
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
        description: 'An error occurred while loading applications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: JobApplication['status'], message?: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          message,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Application Updated',
          description: `Application status updated to ${getStatusInfo(status).label.toLowerCase()}.`,
        });
        fetchApplications(); // Refresh the list
        setSelectedApplication(null);
      } else {
        toast({
          title: 'Failed to update application',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      toast({
        title: 'Failed to update application',
        description: 'An error occurred while updating the application.',
        variant: 'destructive',
      });
    }
  };

  const getStatusCounts = () => {
    const counts = {
      applied: 0,
      selected: 0,
      confirmed: 0,
      rejected: 0,
      cancelled_by_worker: 0,
      cancelled_by_hirer: 0,
    };

    applications.forEach(app => {
      counts[app.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading applications...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Applications for {jobTitle}</h2>
          <p className="text-muted-foreground">
            {applications.length} total application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={fetchApplications} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground">
              No workers have applied to this job yet. Share the job posting to attract applicants.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({statusCounts.applied})</TabsTrigger>
            <TabsTrigger value="selected">Selected ({statusCounts.selected})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({statusCounts.confirmed})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({statusCounts.cancelled_by_worker + statusCounts.cancelled_by_hirer})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ApplicationsList 
              applications={applications} 
              onSelectApplication={setSelectedApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          </TabsContent>

          <TabsContent value="applied" className="space-y-4">
            <ApplicationsList 
              applications={applications.filter(app => app.status === 'applied')} 
              onSelectApplication={setSelectedApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          </TabsContent>

          <TabsContent value="selected" className="space-y-4">
            <ApplicationsList 
              applications={applications.filter(app => app.status === 'selected')} 
              onSelectApplication={setSelectedApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <ApplicationsList 
              applications={applications.filter(app => app.status === 'confirmed')} 
              onSelectApplication={setSelectedApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <ApplicationsList 
              applications={applications.filter(app => app.status === 'rejected')} 
              onSelectApplication={setSelectedApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <ApplicationsList 
              applications={applications.filter(app => app.status === 'cancelled_by_worker' || app.status === 'cancelled_by_hirer')} 
              onSelectApplication={setSelectedApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      )}
    </div>
  );
}

interface ApplicationsListProps {
  applications: JobApplication[];
  onSelectApplication: (application: JobApplication) => void;
  onUpdateStatus: (applicationId: string, status: JobApplication['status'], message?: string) => void;
}

function ApplicationsList({ applications, onSelectApplication, onUpdateStatus }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No applications in this category.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const statusInfo = getStatusInfo(application.status);
        return (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {application.workerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{application.workerName}</CardTitle>
                    <CardDescription>
                      Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectApplication(application)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                
                {(application.status === 'applied') && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onUpdateStatus(application.id, 'selected')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Select
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onUpdateStatus(application.id, 'rejected')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}

                {(application.status === 'selected') && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onUpdateStatus(application.id, 'confirmed')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface ApplicationDetailProps {
  application: JobApplication;
  onClose: () => void;
  onUpdateStatus: (applicationId: string, status: JobApplication['status'], message?: string) => void;
}

function ApplicationDetail({ application, onClose, onUpdateStatus }: ApplicationDetailProps) {
  const [message, setMessage] = useState(application.message || '');
  const statusInfo = getStatusInfo(application.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Application Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback>
                {application.workerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{application.workerName}</h3>
              <p className="text-sm text-muted-foreground">
                Applied on {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={`px-3 py-1 ${statusInfo.color} flex items-center gap-1 ml-auto`}>
              {statusInfo.icon} {statusInfo.label}
            </Badge>
          </div>

          {application.coverLetter && (
            <div>
              <h4 className="font-semibold mb-2">Cover Letter</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {application.proposedRate && (
            <div>
              <h4 className="font-semibold mb-1">Proposed Rate</h4>
              <p className="text-lg font-medium text-green-600">
                ${application.proposedRate}
              </p>
            </div>
          )}

          {application.resumeUrl && (
            <div>
              <h4 className="font-semibold mb-2">Resume</h4>
              <Button variant="outline" size="sm" asChild>
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Message to Worker</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to the worker..."
              className="w-full p-3 border rounded-md min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {(application.status === 'applied') && (
              <>
                <Button
                  variant="default"
                  onClick={() => onUpdateStatus(application.id, 'selected', message)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Select Worker
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onUpdateStatus(application.id, 'rejected', message)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}

            {(application.status === 'selected') && (
              <Button
                variant="default"
                onClick={() => onUpdateStatus(application.id, 'confirmed', message)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Worker
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
