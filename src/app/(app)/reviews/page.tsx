"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { UserRatingDisplay } from '@/components/reviews/UserRatingDisplay';
import { 
  Star, 
  Search, 
  Plus, 
  Filter,
  MessageSquare,
  Award,
  Clock,
  UserCheck,
  Loader2
} from 'lucide-react';
import type { Review, UserRating } from '@/lib/review-service';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchReviews();
      fetchUserRating();
    }
  }, [currentUser]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews?userId=${currentUser?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      } else {
        toast({
          title: 'Failed to load reviews',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast({
        title: 'Failed to load reviews',
        description: 'An error occurred while loading reviews.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/reviews/ratings/${currentUser?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserRating(data.rating);
      }
    } catch (error) {
      console.error('Failed to fetch user rating:', error);
    }
  };

  const handleReviewSuccess = (review: Review) => {
    setShowReviewForm(false);
    fetchReviews();
    fetchUserRating();
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}?userId=${currentUser?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Review Deleted',
          description: 'Your review has been deleted successfully.',
        });
        fetchReviews();
        fetchUserRating();
      } else {
        toast({
          title: 'Failed to delete review',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: 'Failed to delete review',
        description: 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleReportReview = (reviewId: string) => {
    toast({
      title: 'Review Reported',
      description: 'Thank you for reporting this review. We will review it shortly.',
    });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || review.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      overall: Star,
      communication: MessageSquare,
      quality: Award,
      timeliness: Clock,
      professionalism: UserCheck,
    };
    return icons[category as keyof typeof icons] || Star;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      overall: 'Overall Experience',
      communication: 'Communication',
      quality: 'Work Quality',
      timeliness: 'Timeliness',
      professionalism: 'Professionalism',
    };
    return labels[category as keyof typeof labels] || category;
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8">
          <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You need to be logged in to view reviews.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviews & Ratings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your reviews and see your reputation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Rating Sidebar */}
        <div className="lg:col-span-1">
          {userRating && (
            <UserRatingDisplay 
              rating={userRating} 
              userName={currentUser.name}
              className="sticky top-6"
            />
          )}
        </div>

        {/* Reviews Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Reviews</CardTitle>
                  <CardDescription>
                    Reviews you've received from clients and workers
                  </CardDescription>
                </div>
                <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Write Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                      <DialogDescription>
                        Share your experience with a client or worker
                      </DialogDescription>
                    </DialogHeader>
                    <ReviewForm
                      jobId="sample-job"
                      revieweeId="sample-user"
                      jobTitle="Sample Job"
                      onSuccess={handleReviewSuccess}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="overall">Overall</TabsTrigger>
                      <TabsTrigger value="communication">Communication</TabsTrigger>
                      <TabsTrigger value="quality">Quality</TabsTrigger>
                      <TabsTrigger value="timeliness">Timeliness</TabsTrigger>
                      <TabsTrigger value="professionalism">Professionalism</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Reviews List */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading reviews...</span>
                </div>
              ) : filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      reviewerName="Anonymous User"
                      revieweeName={currentUser.name}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                      onReport={handleReportReview}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'No reviews match your search criteria.'
                      : 'You haven\'t received any reviews yet. Complete jobs to start building your reputation.'
                    }
                  </p>
                  {!searchQuery && selectedCategory === 'all' && (
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Write Your First Review
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
