"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { Job } from '@/lib/types';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  User, 
  Briefcase, 
  ArrowRight,
  Star,
  Eye,
  Bookmark,
  Share2
} from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  onApply?: (jobId: string) => void;
  isApplied?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (jobId: string) => void;
  onShare?: (jobId: string) => void;
  applicationCount?: number;
  showApplicationCount?: boolean;
}

export default function JobCard({ 
  job, 
  showApplyButton = true, 
  onApply, 
  isApplied = false,
  isBookmarked = false,
  onBookmark,
  onShare,
  applicationCount = 0,
  showApplicationCount = false
}: JobCardProps) {
  const formatSalary = (rate: number) => {
    return `$${rate.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case 'urgent':
      case 'asap':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'short-term project':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'full-time temporary':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(job.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(job.id);
    }
  };

  return (
    <Card className="card-hover group overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-2">
               <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                 {job.title}
               </CardTitle>
               <Badge variant="outline" className={`text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
              {job.jobType}
            </Badge>
             </div>
             
             <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
               <div className="flex items-center gap-1">
                 <User className="h-4 w-4" />
                 <span>{job.hirerName}</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`h-8 w-8 p-0 ${isBookmarked ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
              >
                <Share2 className="h-4 w-4" />
              </Button>
          )}
          </div>
        </div>
        
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {job.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Job Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{job.location}</span>
          </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{job.duration}</span>
            </div>
                         <div className="flex items-center gap-2 text-muted-foreground">
               <DollarSign className="h-4 w-4 text-green-600" />
               <span className="font-medium text-foreground">
                 {formatSalary(job.rate)}
               </span>
             </div>
             <div className="flex items-center gap-2 text-muted-foreground">
               <Calendar className="h-4 w-4 text-primary" />
               <span>{formatDate(job.postedAt)}</span>
             </div>
           </div>
           
           {/* Trade and Application Count */}
           <div className="flex flex-wrap gap-1 items-center justify-between">
             <Badge variant="secondary" className="text-xs">
               {job.trade}
             </Badge>
             {showApplicationCount && applicationCount > 0 && (
               <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                                   <User className="mr-1 h-3 w-3" />
                 {applicationCount} application{applicationCount !== 1 ? 's' : ''}
               </Badge>
             )}
           </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {showApplyButton && (
              <Button 
                onClick={handleApply}
                disabled={isApplied}
                className={`flex-1 ${isApplied ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'btn-gradient'}`}
              >
                {isApplied ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Applied
                  </>
                ) : (
                  <>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
            
            <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/5">
              <Link href={`/jobs/${job.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
