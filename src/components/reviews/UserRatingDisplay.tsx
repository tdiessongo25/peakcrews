"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  MessageSquare, 
  Award, 
  Clock, 
  UserCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import type { UserRating } from '@/lib/review-service';

interface UserRatingDisplayProps {
  rating: UserRating;
  userName?: string;
  showDetails?: boolean;
  className?: string;
}

const CATEGORY_CONFIG = {
  communication: { label: 'Communication', icon: MessageSquare, color: 'text-green-600' },
  quality: { label: 'Work Quality', icon: Award, color: 'text-purple-600' },
  timeliness: { label: 'Timeliness', icon: Clock, color: 'text-orange-600' },
  professionalism: { label: 'Professionalism', icon: UserCheck, color: 'text-indigo-600' },
  overall: { label: 'Overall', icon: Star, color: 'text-blue-600' },
};

export function UserRatingDisplay({ 
  rating, 
  userName, 
  showDetails = true,
  className = "" 
}: UserRatingDisplayProps) {
  const renderStars = (ratingValue: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= ratingValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Fair';
    return 'Poor';
  };

  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-400" />
          {userName ? `${userName}'s Rating` : 'User Rating'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {renderStars(rating.averageRating, 'lg')}
            <span className={`text-2xl font-bold ${getRatingColor(rating.averageRating)}`}>
              {rating.averageRating.toFixed(1)}
            </span>
          </div>
          <p className={`text-sm font-medium ${getRatingColor(rating.averageRating)}`}>
            {getRatingLabel(rating.averageRating)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {rating.totalReviews} review{rating.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {showDetails && (
          <>
            {/* Rating Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = rating.ratingBreakdown[star as keyof typeof rating.ratingBreakdown];
                  const percentage = calculatePercentage(count, rating.totalReviews);
                  
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-xs font-medium">{star}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Ratings */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Category Ratings</h4>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(rating.categoryAverages).map(([category, average]) => {
                  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                  if (!config) return null;
                  
                  const Icon = config.icon;
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span className="text-sm font-medium">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(average, 'sm')}
                        <span className="text-sm font-medium">{average.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {((rating.ratingBreakdown[5] / rating.totalReviews) * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">5-Star Reviews</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">
                    {rating.totalReviews}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Total Reviews</p>
              </div>
            </div>

            {/* Last Review */}
            {rating.lastReviewDate && (
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Last review: {new Date(rating.lastReviewDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
