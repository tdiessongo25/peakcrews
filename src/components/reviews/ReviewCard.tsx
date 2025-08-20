"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MessageSquare, 
  Award, 
  Clock, 
  UserCheck,
  MoreVertical,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import type { Review } from '@/lib/review-service';

interface ReviewCardProps {
  review: Review;
  reviewerName?: string;
  revieweeName?: string;
  jobTitle?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showActions?: boolean;
}

const CATEGORY_CONFIG = {
  overall: { label: 'Overall Experience', icon: Star, color: 'bg-blue-100 text-blue-800' },
  communication: { label: 'Communication', icon: MessageSquare, color: 'bg-green-100 text-green-800' },
  quality: { label: 'Work Quality', icon: Award, color: 'bg-purple-100 text-purple-800' },
  timeliness: { label: 'Timeliness', icon: Clock, color: 'bg-orange-100 text-orange-800' },
  professionalism: { label: 'Professionalism', icon: UserCheck, color: 'bg-indigo-100 text-indigo-800' },
};

export function ReviewCard({ 
  review, 
  reviewerName, 
  revieweeName, 
  jobTitle,
  onEdit,
  onDelete,
  onReport,
  showActions = true 
}: ReviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { currentUser } = useUser();
  
  const isOwner = currentUser?.id === review.reviewerId;
  const canEdit = isOwner && showActions;
  const canDelete = isOwner && showActions;
  const canReport = !isOwner && showActions;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getCategoryConfig = (category: Review['category']) => {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.overall;
  };

  const categoryConfig = getCategoryConfig(review.category);
  const CategoryIcon = categoryConfig.icon;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>
                {reviewerName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">
                  {reviewerName || 'Anonymous User'}
                </h4>
                {review.updatedAt && (
                  <Badge variant="secondary" className="text-xs">
                    Edited
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.rating)}
                <span className="text-sm text-muted-foreground">
                  {review.rating}.0
                </span>
                <Badge className={`text-xs ${categoryConfig.color}`}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {categoryConfig.label}
                </Badge>
              </div>
              {jobTitle && (
                <p className="text-xs text-muted-foreground">
                  Review for: {jobTitle}
                </p>
              )}
            </div>
          </div>
          
          {showActions && (canEdit || canDelete || canReport) && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {canEdit && (
                      <button
                        onClick={() => {
                          onEdit?.(review);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Review
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          onDelete?.(review.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Review
                      </button>
                    )}
                    {canReport && (
                      <button
                        onClick={() => {
                          onReport?.(review.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-orange-600 hover:bg-orange-50"
                      >
                        <Flag className="h-4 w-4" />
                        Report Review
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-base mb-2">{review.title}</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatDate(review.createdAt)}
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <span className="ml-2">(edited {formatDate(review.updatedAt)})</span>
              )}
            </span>
            {revieweeName && (
              <span>
                Review for {revieweeName}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
