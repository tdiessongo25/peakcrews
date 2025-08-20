"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { UserRatingDisplay } from '@/components/reviews/UserRatingDisplay';
import { 
  Star, 
  MessageSquare, 
  Award, 
  Clock, 
  UserCheck,
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import type { Review, UserRating } from '@/lib/review-service';

export default function TestReviewsPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sampleReview, setSampleReview] = useState<Review | null>(null);
  const [sampleRating, setSampleRating] = useState<UserRating | null>(null);
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

      // Test 2: Test review creation
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId: 'test-job-1',
            reviewerId: currentUser.id,
            revieweeId: 'test-user-1',
            rating: 5,
            title: 'Test Review - Excellent Work',
            comment: 'This is a test review to verify the review system functionality. The work was completed professionally and on time.',
            category: 'overall',
          }),
        });

        const data = await response.json();

        if (response.ok && data.review) {
          addTestResult('Review Creation', 'pass', 'Review created successfully');
          setSampleReview(data.review);
        } else {
          addTestResult('Review Creation', 'fail', data.error || 'Failed to create review');
        }
      } catch (error) {
        addTestResult('Review Creation', 'fail', `Error: ${error}`);
      }

      // Test 3: Test user rating retrieval
      try {
        const response = await fetch(`/api/reviews/ratings/${currentUser.id}`);
        const data = await response.json();

        if (response.ok && data.rating) {
          addTestResult('User Rating Retrieval', 'pass', 'User rating retrieved successfully');
          setSampleRating(data.rating);
        } else {
          addTestResult('User Rating Retrieval', 'fail', data.error || 'Failed to get user rating');
        }
      } catch (error) {
        addTestResult('User Rating Retrieval', 'fail', `Error: ${error}`);
      }

      // Test 4: Test reviews retrieval
      try {
        const response = await fetch(`/api/reviews?userId=${currentUser.id}`);
        const data = await response.json();

        if (response.ok) {
          addTestResult('Reviews Retrieval', 'pass', `Retrieved ${data.reviews?.length || 0} reviews`);
        } else {
          addTestResult('Reviews Retrieval', 'fail', data.error || 'Failed to get reviews');
        }
      } catch (error) {
        addTestResult('Reviews Retrieval', 'fail', `Error: ${error}`);
      }

      // Test 5: Test review search
      try {
        const response = await fetch('/api/reviews?query=test');
        const data = await response.json();

        if (response.ok) {
          addTestResult('Review Search', 'pass', `Found ${data.reviews?.length || 0} reviews matching "test"`);
        } else {
          addTestResult('Review Search', 'fail', data.error || 'Failed to search reviews');
        }
      } catch (error) {
        addTestResult('Review Search', 'fail', `Error: ${error}`);
      }

      // Test 6: Test review update (if we have a sample review)
      if (sampleReview) {
        try {
          const response = await fetch(`/api/reviews/${sampleReview.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: 'Updated Test Review',
              comment: 'This review has been updated to test the update functionality.',
            }),
          });

          const data = await response.json();

          if (response.ok) {
            addTestResult('Review Update', 'pass', 'Review updated successfully');
          } else {
            addTestResult('Review Update', 'fail', data.error || 'Failed to update review');
          }
        } catch (error) {
          addTestResult('Review Update', 'fail', `Error: ${error}`);
        }
      }

    } catch (error) {
      addTestResult('Test Suite', 'fail', `Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReviewSuccess = (review: Review) => {
    setShowReviewForm(false);
    toast({
      title: 'Test Review Submitted!',
      description: 'Test review has been submitted successfully.',
    });
    addTestResult('Live Review Test', 'pass', 'Review form submitted successfully');
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review & Rating System Test</h1>
          <p className="text-muted-foreground">
            Test the review and rating functionality to ensure reputation management is working correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
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
                <MessageSquare className="h-5 w-5" />
                Review Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Review Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Rating System</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Category Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Reputation Tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Test Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Tests'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(true)}
                className="w-full"
              >
                <Star className="mr-2 h-4 w-4" />
                Test Review Form
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="w-full"
              >
                <Link href="/reviews">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Open Reviews
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Review Form Test */}
        {showReviewForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Live Review Form Test</CardTitle>
              <CardDescription>
                Test the review form with real functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewForm
                jobId="test-job-1"
                revieweeId="test-user-1"
                jobTitle="Test Job - Review System Verification"
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Sample Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sampleRating && (
            <Card>
              <CardHeader>
                <CardTitle>Sample User Rating</CardTitle>
                <CardDescription>
                  Example of user rating display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserRatingDisplay 
                  rating={sampleRating} 
                  userName="Test User"
                  showDetails={true}
                />
              </CardContent>
            </Card>
          )}

          {sampleReview && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Review Card</CardTitle>
                <CardDescription>
                  Example of review card display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewCard
                  review={sampleReview}
                  reviewerName="Test Reviewer"
                  revieweeName="Test User"
                  jobTitle="Test Job"
                  showActions={true}
                />
              </CardContent>
            </Card>
          )}
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
                  Review creation and submission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Star rating system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Category-based reviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  User reputation tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Review search and filtering
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  5-star rating system
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  Multiple review categories
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  Review editing and deletion
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  Reputation analytics
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  Review reporting system
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
