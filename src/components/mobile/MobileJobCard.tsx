"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { useMobile } from '@/hooks/use-mobile';
import { mobileUtils } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Share2, 
  Heart, 
  MessageCircle,
  Phone,
  Calendar,
  User,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/types';

interface MobileJobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onShare?: (job: Job) => void;
  onFavorite?: (jobId: string) => void;
  isFavorite?: boolean;
  showActions?: boolean;
}

export function MobileJobCard({
  job,
  onApply,
  onShare,
  onFavorite,
  isFavorite = false,
  showActions = true,
}: MobileJobCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useUser();
  const mobileInfo = useMobile();
  const { toast } = useToast();

  const handleApply = async () => {
    if (!currentUser) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to apply for jobs.',
        variant: 'destructive',
      });
      return;
    }

    if (currentUser.role !== 'worker') {
      toast({
        title: 'Worker Account Required',
        description: 'Only workers can apply for jobs.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      onApply?.(job.id);
      toast({
        title: 'Application Submitted',
        description: `Your application for ${job.title} has been submitted.`,
      });
    } catch (error) {
      toast({
        title: 'Application Failed',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const success = await mobileUtils.share({
      title: job.title,
      text: `${job.title} - ${job.description.substring(0, 100)}...`,
      url: `${window.location.origin}/jobs/${job.id}`,
    });

    if (success) {
      onShare?.(job);
      toast({
        title: 'Job Shared',
        description: 'Job has been shared successfully.',
      });
    } else {
      toast({
        title: 'Share Failed',
        description: 'Unable to share job. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFavorite = () => {
    onFavorite?.(job.id);
    mobileUtils.vibrate(50); // Haptic feedback
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'ASAP':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Urgent':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Job Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={job.hirerProfileImage} />
                  <AvatarFallback>
                    {job.hirerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{job.hirerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(job.postedAt)}
                  </p>
                </div>
              </div>
              
              <h3 className="font-semibold text-base mb-2 line-clamp-2">
                {job.title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {job.description}
              </p>
            </div>

            {/* Favorite Button */}
            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                onClick={handleFavorite}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </Button>
            )}
          </div>

          {/* Job Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              <Briefcase className="h-3 w-3 mr-1" />
              {job.trade}
            </Badge>
            <Badge className={`text-xs ${getJobTypeColor(job.jobType)}`}>
              {job.jobType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {job.duration}
            </Badge>
          </div>

          {/* Job Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{job.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">${job.rate}/hr</span>
            </div>

            {job.scheduledDateTime && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  {new Date(job.scheduledDateTime).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        {showActions && (
          <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-auto"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
                
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={isLoading}
                  className="min-w-[80px]"
                >
                  {isLoading ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
