"use client";

import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { MobileJobCard } from '@/components/mobile/MobileJobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { mobileUtils } from '@/hooks/use-mobile';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Clock,
  Plus,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import type { Job } from '@/lib/types';

export default function MobileJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const mobileInfo = useMobile();

  const trades = ['all', 'Electrician', 'Carpenter', 'Painter', 'Concrete Laborer', 'General Laborer', 'Plumber'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedTrade]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by trade
    if (selectedTrade !== 'all') {
      filtered = filtered.filter(job => job.trade === selectedTrade);
    }

    setFilteredJobs(filtered);
  };

  const handleLocationRequest = async () => {
    try {
      const position = await mobileUtils.requestLocation();
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      
      toast({
        title: 'Location Updated',
        description: 'Your location has been updated for nearby job searches.',
      });
    } catch (error) {
      toast({
        title: 'Location Access Denied',
        description: 'Please enable location access to find nearby jobs.',
        variant: 'destructive',
      });
    }
  };

  const handleJobApply = (jobId: string) => {
    // Handle job application
    console.log('Applying for job:', jobId);
  };

  const handleJobShare = (job: Job) => {
    // Handle job sharing
    console.log('Sharing job:', job.title);
  };

  const handleJobFavorite = (jobId: string) => {
    // Handle job favoriting
    console.log('Favoriting job:', jobId);
    mobileUtils.vibrate([50, 50]); // Haptic feedback
  };

  const handlePostJob = () => {
    // Navigate to post job page
    window.location.href = '/post-job';
  };

  const handleSearch = () => {
    // Focus search input or show search modal
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <MobileLayout
      title="Job Feed"
      showSearch={true}
      showLocation={true}
      showShare={false}
      showFloatingAction={true}
      floatingActionIcon={<Plus className="h-6 w-6" />}
      onFloatingAction={handlePostJob}
      onSearch={handleSearch}
      onLocation={handleLocationRequest}
    >
      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="job-search"
            placeholder="Search jobs, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Trade Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {trades.map((trade) => (
            <Button
              key={trade}
              variant={selectedTrade === trade ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTrade(trade)}
              className="whitespace-nowrap"
            >
              {trade === 'all' ? 'All Trades' : trade}
            </Button>
          ))}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchJobs}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredJobs.length} jobs found</span>
          {userLocation && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Nearby</span>
            </div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <MobileJobCard
              key={job.id}
              job={job}
              onApply={handleJobApply}
              onShare={handleJobShare}
              onFavorite={handleJobFavorite}
              isFavorite={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedTrade !== 'all'
              ? 'Try adjusting your search criteria'
              : 'Check back later for new opportunities'
            }
          </p>
          <Button onClick={fetchJobs} variant="outline">
            Refresh Jobs
          </Button>
        </div>
      )}

      {/* Mobile-specific features indicator */}
      {mobileInfo.isMobile && (
        <div className="fixed bottom-32 left-4 right-4 z-40">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-blue-700">📱 Mobile Optimized</span>
                {mobileInfo.hasGeolocation && (
                  <Badge variant="secondary" className="text-xs">
                    📍 Location
                  </Badge>
                )}
                {mobileInfo.hasCamera && (
                  <Badge variant="secondary" className="text-xs">
                    📷 Camera
                  </Badge>
                )}
              </div>
              <span className="text-blue-600">
                {mobileInfo.connectionType !== 'unknown' && `${mobileInfo.connectionType.toUpperCase()}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
