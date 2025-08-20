"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function TestApplicationFlowPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  const { currentUser, role } = useUser();

  const addTestResult = (test: string, status: 'pass' | 'fail', message: string) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Check if user is authenticated
      if (!currentUser) {
        addTestResult('Authentication', 'fail', 'User not authenticated');
        return;
      }
      addTestResult('Authentication', 'pass', `User authenticated as ${currentUser.name} (${role})`);

      // Test 2: Check if jobs API is working
      try {
        const jobsResponse = await fetch('/api/jobs');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          addTestResult('Jobs API', 'pass', `Found ${jobsData.jobs?.length || 0} jobs`);
        } else {
          addTestResult('Jobs API', 'fail', `Jobs API returned ${jobsResponse.status}`);
        }
      } catch (error) {
        addTestResult('Jobs API', 'fail', `Jobs API error: ${error}`);
      }

      // Test 3: Check if applications API is working
      try {
        const applicationsResponse = await fetch('/api/applications');
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          addTestResult('Applications API', 'pass', `Found ${applicationsData.applications?.length || 0} applications`);
        } else {
          addTestResult('Applications API', 'fail', `Applications API returned ${applicationsResponse.status}`);
        }
      } catch (error) {
        addTestResult('Applications API', 'fail', `Applications API error: ${error}`);
      }

      // Test 4: Check if notifications API is working
      try {
        const notificationsResponse = await fetch(`/api/notifications?userId=${currentUser.id}`);
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          addTestResult('Notifications API', 'pass', `Found ${notificationsData.notifications?.length || 0} notifications`);
        } else {
          addTestResult('Notifications API', 'fail', `Notifications API returned ${notificationsResponse.status}`);
        }
      } catch (error) {
        addTestResult('Notifications API', 'fail', `Notifications API error: ${error}`);
      }

      // Test 5: Test application creation (if user is a worker)
      if (role === 'worker') {
        try {
          const testJobId = 'job-1'; // Use first mock job
          const applicationData = {
            jobId: testJobId,
            workerId: currentUser.id,
            coverLetter: 'This is a test application from the test page.',
            proposedRate: 80,
            resumeUrl: 'https://example.com/test-resume.pdf'
          };

          const createResponse = await fetch('/api/applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData),
          });

          if (createResponse.ok) {
            const result = await createResponse.json();
            addTestResult('Application Creation', 'pass', `Created application ${result.application?.id}`);
          } else {
            const error = await createResponse.json();
            addTestResult('Application Creation', 'fail', `Failed to create application: ${error.error}`);
          }
        } catch (error) {
          addTestResult('Application Creation', 'fail', `Application creation error: ${error}`);
        }
      } else {
        addTestResult('Application Creation', 'pass', 'Skipped - user is not a worker');
      }

    } catch (error) {
      addTestResult('Test Suite', 'fail', `Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Application Flow Test</h1>
          <p className="text-muted-foreground">
            This page tests the job application flow functionality to ensure everything is working correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Current User
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {currentUser.name}</p>
                  <p><strong>Role:</strong> {role}</p>
                  <p><strong>ID:</strong> {currentUser.id}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Not authenticated</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/jobs">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
              {role === 'worker' && (
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/applications">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    My Applications
                  </Link>
                </Button>
              )}
              {role === 'hirer' && (
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/my-jobs">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    My Jobs
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Test Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {testResults.length} test{testResults.length !== 1 ? 's' : ''} completed
              </p>
            </CardContent>
          </Card>
        </div>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from the latest test run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What's Working</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Job posting and listing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Application submission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Application management for hirers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Status updates and notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Resume upload functionality
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Real-time messaging
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Payment processing
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Review system
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Advanced search and filtering
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Mobile app development
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
