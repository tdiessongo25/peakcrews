"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Loader2, Send } from 'lucide-react';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import type { Job } from '@/lib/types';

interface ApplicationFormProps {
  job: Job;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ApplicationForm({ job, onSuccess, onCancel }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedRate, setProposedRate] = useState(job.rate.toString());
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useUser();

  const handleResumeUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'resume');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload resume');
    }

    const data = await response.json();
    setResumeUrl(data.url);
    return data.url;
  };

  const handleResumeRemove = () => {
    setResumeUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to apply for jobs.',
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

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          workerId: currentUser.id,
          coverLetter,
          proposedRate: parseFloat(proposedRate) || job.rate,
          resumeUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Application Submitted!',
          description: 'Your application has been sent to the contractor.',
        });
        onSuccess?.();
      } else {
        toast({
          title: 'Application Failed',
          description: data.error || 'Failed to submit application',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: 'Application Failed',
        description: 'An error occurred while submitting your application.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for {job.title}</CardTitle>
        <CardDescription>
          Submit your application for this job. Make sure to highlight your relevant experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Describe your relevant experience and why you're the best fit for this job..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposedRate">Proposed Rate (per hour or total)</Label>
            <Input
              id="proposedRate"
              type="number"
              placeholder={job.rate.toString()}
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              min="0"
              step="0.01"
            />
            <p className="text-sm text-muted-foreground">
              Job rate: ${job.rate} {job.duration.includes('hour') ? 'per hour' : 'total'}
            </p>
          </div>

          <div>
            <ResumeUpload
              currentResumeUrl={null}
              onUpload={handleResumeUpload}
              onRemove={handleResumeRemove}
              required={true}
              className="mt-4"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Please upload your resume to complete your application.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 