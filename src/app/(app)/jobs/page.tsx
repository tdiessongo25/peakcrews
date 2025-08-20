"use client";

import JobCard from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ListFilter, AlertCircle, Loader2, Search, ArrowRight } from "lucide-react";
import { DataService } from "@/lib/data-service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import type { Job } from "@/lib/types";

export default function JobFeedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await DataService.getJobs();
        setJobs(fetchedJobs);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch jobs:', err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-headline mb-2">Find Your Next Job</h1>
          <p className="text-lg text-muted-foreground">Browse available jobs posted by hirers in your area.</p>
          <div className="mt-4">
            <Link href="/search">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Advanced Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="sticky top-[65px] bg-background z-10 py-4 mb-6 border-b">
          <JobFilters />
        </div>
        
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading jobs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-headline mb-2">Find Your Next Job</h1>
          <p className="text-lg text-muted-foreground">Browse available jobs posted by hirers in your area.</p>
          <div className="mt-4">
            <Link href="/search">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Advanced Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="sticky top-[65px] bg-background z-10 py-4 mb-6 border-b">
          <JobFilters />
        </div>
        
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Failed to Load Jobs</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline mb-2">Find Your Next Job</h1>
        <p className="text-lg text-muted-foreground">Browse available jobs posted by hirers in your area.</p>
        <div className="mt-4">
          <Link href="/search">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Advanced Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="sticky top-[65px] bg-background z-10 py-4 mb-6 border-b">
        <JobFilters />
      </div>
      
      {jobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onApply={() => {
                // Handle job application
                toast({
                  title: "Application Submitted",
                  description: `Your application for ${job.title} has been submitted successfully.`,
                });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Jobs
              </Button>
              <Link href="/search">
                <Button className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
