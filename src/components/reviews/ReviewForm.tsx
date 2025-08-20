"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  Star, 
  MessageSquare, 
  Award, 
  Clock, 
  UserCheck,
  Send,
  Loader2
} from 'lucide-react';
import type { Review } from '@/lib/review-service';

interface ReviewFormProps {
  jobId: string;
  revieweeId: string;
  jobTitle: string;
  onSuccess?: (review: Review) => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  { value: 'overall', label: 'Overall Experience', icon: Star },
  { value: 'communication', label: 'Communication', icon: MessageSquare },
  { value: 'quality', label: 'Work Quality', icon: Award },
  { value: 'timeliness', label: 'Timeliness', icon: Clock },
  { value: 'professionalism', label: 'Professionalism', icon: UserCheck },
];

export function ReviewForm({ jobId, revieweeId, jobTitle, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<Review['category']>('overall');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to submit a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          reviewerId: currentUser.id,
          revieweeId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Review Submitted!',
          description: 'Thank you for your review. It has been submitted successfully.',
        });
        onSuccess?.(data.review);
      } else {
        toast({
          title: 'Failed to Submit Review',
          description: data.error || 'An error occurred while submitting your review.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            className={`transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : ''
            }`}
            disabled={!interactive}
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.icon : Star;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience working on "{jobTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Overall Rating</Label>
            <div className="flex items-center gap-4">
              {renderStars(rating, true)}
              <span className="text-sm text-muted-foreground">
                {rating} out of 5 stars
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Review Category</Label>
            <Select value={category} onValueChange={(value: Review['category']) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in a few words"
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Review Comment *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience, what went well, and any areas for improvement..."
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Review Preview */}
          {title && comment && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h4 className="font-medium">Review Preview</h4>
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                <span className="text-sm text-muted-foreground">
                  {getCategoryIcon(category) && (
                    <getCategoryIcon(category) className="h-4 w-4" />
                  )}
                  {CATEGORIES.find(cat => cat.value === category)?.label}
                </span>
              </div>
              <div>
                <h5 className="font-medium">{title}</h5>
                <p className="text-sm text-muted-foreground mt-1">{comment}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !comment.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          {/* Guidelines */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Review Guidelines:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Be honest and constructive in your feedback</li>
              <li>Focus on the work quality and professionalism</li>
              <li>Avoid personal attacks or inappropriate language</li>
              <li>Reviews are public and help the community</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
