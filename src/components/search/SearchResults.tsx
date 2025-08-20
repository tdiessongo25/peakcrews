"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  User,
  Briefcase,
  Award,
  MessageSquare,
  Heart,
  Share2,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { JobSearchResult, WorkerSearchResult, SearchFilters } from '@/lib/search-service';

interface SearchResultsProps {
  jobs?: JobSearchResult[];
  workers?: WorkerSearchResult[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  filters: SearchFilters;
  isLoading: boolean;
  onLoadMore: () => void;
  onJobClick?: (job: JobSearchResult) => void;
  onWorkerClick?: (worker: WorkerSearchResult) => void;
  className?: string;
}

export function SearchResults({
  jobs,
  workers,
  total,
  page,
  totalPages,
  hasMore,
  filters,
  isLoading,
  onLoadMore,
  onJobClick,
  onWorkerClick,
  className = ""
}: SearchResultsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast({
          title: 'Removed from favorites',
          description: 'Item removed from your favorites.',
        });
      } else {
        newFavorites.add(id);
        toast({
          title: 'Added to favorites',
          description: 'Item added to your favorites.',
        });
      }
      return newFavorites;
    });
  };

  const shareItem = (item: JobSearchResult | WorkerSearchResult) => {
    const url = window.location.href;
    const text = 'job' in item ? item.title : `${item.name} - ${item.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: text,
        text: 'job' in item ? item.description : item.bio,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied',
        description: 'Link copied to clipboard.',
      });
    }
  };

  const formatPrice = (price: number, priceType?: string) => {
    if (priceType === 'hourly') {
      return `$${price}/hr`;
    }
    return `$${price}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Searching...</span>
      </div>
    );
  }

  if (!jobs?.length && !workers?.length && !isLoading) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          {/* <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" /> */}
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters to find more results.
          </p>
          <Button variant="outline">
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {total} {jobs ? 'Jobs' : 'Workers'} Found
          </h2>
          {filters.query && (
            <p className="text-muted-foreground">
              Results for "{filters.query}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {/* Job Results */}
        {jobs?.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onJobClick?.(job)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {job.hirerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">{job.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(job.id);
                            }}
                          >
                            <Heart className={`h-4 w-4 ${favorites.has(job.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              shareItem(job);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatPrice(job.price, job.priceType)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {renderStars(job.hirerRating)}
                          <span className="text-sm font-medium">{job.hirerRating}</span>
                          <span className="text-sm text-muted-foreground">({job.hirerReviewCount})</span>
                        </div>
                        <Badge variant="secondary">{job.category}</Badge>
                        <Badge className={getUrgencyColor(job.urgency)}>
                          {job.urgency} urgency
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Worker Results */}
        {workers?.map((worker) => (
          <Card key={worker.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onWorkerClick?.(worker)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {worker.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{worker.name}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{worker.title}</p>
                          <p className="text-muted-foreground text-sm line-clamp-2">{worker.bio}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(worker.id);
                            }}
                          >
                            <Heart className={`h-4 w-4 ${favorites.has(worker.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              shareItem(worker);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{worker.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatPrice(worker.hourlyRate, 'hourly')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{worker.completedJobs} jobs</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {renderStars(worker.rating)}
                          <span className="text-sm font-medium">{worker.rating}</span>
                          <span className="text-sm text-muted-foreground">({worker.reviewCount})</span>
                        </div>
                        <Badge variant="secondary">{worker.experience}</Badge>
                        <Badge variant="outline">{worker.availability}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {worker.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {worker.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{worker.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && (jobs?.length || workers?.length) && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end of the results.</p>
        </div>
      )}
    </div>
  );
}
