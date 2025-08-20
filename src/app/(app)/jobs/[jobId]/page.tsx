
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { JobApplications } from '@/components/applications/JobApplications';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  User, 
  Briefcase,
  ArrowLeft,
  Loader2,
  Users
} from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/types';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      } else {
        toast({
          title: 'Job not found',
          description: 'The job you are looking for does not exist.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch job:', error);
      toast({
        title: 'Failed to load job',
        description: 'An error occurred while loading the job details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to apply for this job.',
        variant: 'destructive',
      });
      return;
    }

    if (currentUser.role !== 'worker') {
      toast({
        title: 'Access Denied',
        description: 'Only workers can apply for jobs.',
        variant: 'destructive',
      });
      return;
    }

    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    toast({
      title: 'Application Submitted!',
      description: 'Your application has been sent to the contractor.',
    });
  };

  const handleViewApplications = () => {
    setShowApplications(true);
  };

  const formatSalary = (rate: number) => {
    return `$${rate.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case 'urgent':
      case 'asap':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'short-term project':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'full-time temporary':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The job you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      {showApplicationForm ? (
        <ApplicationForm 
          job={job} 
          onSuccess={handleApplicationSuccess}
          onCancel={() => setShowApplicationForm(false)}
        />
      ) : showApplications ? (
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setShowApplications(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Details
            </Button>
          </div>
          <JobApplications jobId={job.id} jobTitle={job.title} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
                    <Badge variant="outline" className={`text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                      {job.jobType}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg">
                    Posted by {job.hirerName} • {formatDate(job.postedAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {job.trade}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">{job.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Rate</p>
                        <p className="text-sm text-muted-foreground">
                          {formatSalary(job.rate)} {job.duration.includes('hour') ? 'per hour' : 'total'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Posted</p>
                        <p className="text-sm text-muted-foreground">{formatDate(job.postedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Apply Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentUser?.role === 'hirer' ? 'Manage Applications' : 'Apply for this Job'}
                  </CardTitle>
                  <CardDescription>
                    {currentUser?.role === 'hirer' 
                      ? 'View and manage applications for this job.'
                      : 'Submit your application to be considered for this position.'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentUser?.role === 'worker' ? (
                    <Button onClick={handleApply} className="w-full btn-gradient">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                  ) : currentUser?.role === 'hirer' ? (
                    <div className="space-y-3">
                      <Button onClick={handleViewApplications} className="w-full btn-gradient">
                        <Users className="mr-2 h-4 w-4" />
                        View Applications
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/my-jobs">View My Jobs</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-3">
                        Please log in to interact with this job.
                      </p>
                      <Button asChild>
                        <Link href="/login">Log In</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About the Contractor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{job.hirerName}</p>
                      <p className="text-sm text-muted-foreground">Contractor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
