
"use client";

import JobCard from "@/components/jobs/JobCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListOrdered, PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/lib/types";
import { useEffect, useState } from "react";

export default function MyJobsPage() {
  const { currentUser, role } = useUser();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && role === 'hirer') {
      fetchMyJobs();
    } else {
      setMyJobs([]);
      setIsLoading(false);
    }
  }, [currentUser, role]);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs?hirerId=${currentUser?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setMyJobs(data.jobs);
        
        // Fetch application counts for each job
        const counts: Record<string, number> = {};
        for (const job of data.jobs) {
          const appResponse = await fetch(`/api/applications?jobId=${job.id}`);
          if (appResponse.ok) {
            const appData = await appResponse.json();
            counts[job.id] = appData.applications.length;
          }
        }
        setApplicationCounts(counts);
      } else {
        toast({
          title: 'Failed to load jobs',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast({
        title: 'Failed to load jobs',
        description: 'An error occurred while loading your jobs.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (role !== 'hirer') {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You must be logged in as a Contractor to view your posted jobs.
          </CardDescription>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Login as Contractor</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your jobs...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold font-headline mb-2">My Posted Jobs</h1>
          <p className="text-lg text-muted-foreground">Manage your job listings and view applicants for your projects.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/post-job"><PlusCircle className="mr-2 h-5 w-5" /> Post a New Job</Link>
        </Button>
      </div>
      
      {myJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              showApplicationCount={true}
              applicationCount={applicationCounts[job.id] || 0}
            /> 
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-md">
          <CardHeader>
            <ListOrdered size={48} className="mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Jobs Posted Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-6">
              You haven't posted any jobs. Get started by posting your first job opening for your project.
            </CardDescription>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/post-job"><PlusCircle className="mr-2 h-5 w-5" /> Post Your First Job</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
