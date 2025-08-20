"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { SearchResults } from '@/components/search/SearchResults';
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp,
  MapPin,
  Filter,
  Loader2
} from 'lucide-react';
import type { SearchFilters, JobSearchResult, WorkerSearchResult } from '@/lib/search-service';

export default function SearchPage() {
  const [searchType, setSearchType] = useState<'jobs' | 'workers'>('jobs');
  const [jobs, setJobs] = useState<JobSearchResult[]>([]);
  const [workers, setWorkers] = useState<WorkerSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchAnalytics, setSearchAnalytics] = useState<any>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    fetchSearchAnalytics();
  }, []);

  const fetchSearchAnalytics = async () => {
    try {
      const response = await fetch('/api/search/analytics');
      if (response.ok) {
        const data = await response.json();
        setSearchAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch search analytics:', error);
    }
  };

  const performSearch = async (searchFilters: SearchFilters, isLoadMore = false) => {
    try {
      setIsLoading(true);
      
      const currentPage = isLoadMore ? page + 1 : 1;
      const searchParams = new URLSearchParams();
      
      // Add filters to search params
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'priceRange' && typeof value === 'object') {
            searchParams.append('priceMin', value.min.toString());
            searchParams.append('priceMax', value.max.toString());
          } else if (key === 'skills' && Array.isArray(value)) {
            searchParams.append('skills', value.join(','));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
      
      searchParams.append('page', currentPage.toString());
      searchParams.append('limit', '10');

      const endpoint = searchType === 'jobs' ? '/api/search/jobs' : '/api/search/workers';
      const response = await fetch(`${endpoint}?${searchParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (searchType === 'jobs') {
          if (isLoadMore) {
            setJobs(prev => [...prev, ...data.items]);
          } else {
            setJobs(data.items);
          }
        } else {
          if (isLoadMore) {
            setWorkers(prev => [...prev, ...data.items]);
          } else {
            setWorkers(data.items);
          }
        }
        
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setHasMore(data.hasMore);
        setFilters(searchFilters);
        
        if (!isLoadMore) {
          toast({
            title: 'Search Complete',
            description: `Found ${data.total} ${searchType}`,
          });
        }
      } else {
        toast({
          title: 'Search Failed',
          description: 'Failed to perform search. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'An error occurred while searching.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchFilters: SearchFilters) => {
    setPage(1);
    performSearch(searchFilters);
  };

  const handleLoadMore = () => {
    performSearch(filters, true);
  };

  const handleClear = () => {
    setJobs([]);
    setWorkers([]);
    setTotal(0);
    setPage(1);
    setTotalPages(1);
    setHasMore(false);
    setFilters({});
  };

  const handleJobClick = (job: JobSearchResult) => {
    // Navigate to job details page
    window.location.href = `/jobs/${job.id}`;
  };

  const handleWorkerClick = (worker: WorkerSearchResult) => {
    // Navigate to worker profile page
    window.location.href = `/profile/${worker.id}`;
  };

  const handleTabChange = (value: string) => {
    setSearchType(value as 'jobs' | 'workers');
    setJobs([]);
    setWorkers([]);
    setTotal(0);
    setPage(1);
    setTotalPages(1);
    setHasMore(false);
    setFilters({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search & Discovery</h1>
        <p className="text-lg text-muted-foreground">
          Find the perfect jobs and workers for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Sidebar */}
        <div className="lg:col-span-1">
          <AdvancedSearch
            onSearch={handleSearch}
            onClear={handleClear}
            searchType={searchType}
            initialFilters={filters}
            className="sticky top-6"
          />

          {/* Search Analytics */}
          {searchAnalytics && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Search Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {searchAnalytics.totalSearches.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Total Searches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {searchAnalytics.searchSuccessRate}%
                    </div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Popular Searches</h4>
                  <div className="space-y-1">
                    {searchAnalytics.popularQueries.slice(0, 3).map((query: string, index: number) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        {query}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <Tabs value={searchType} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="workers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Workers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <SearchResults
                jobs={jobs}
                total={total}
                page={page}
                totalPages={totalPages}
                hasMore={hasMore}
                filters={filters}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                onJobClick={handleJobClick}
              />
            </TabsContent>

            <TabsContent value="workers">
              <SearchResults
                workers={workers}
                total={total}
                page={page}
                totalPages={totalPages}
                hasMore={hasMore}
                filters={filters}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                onWorkerClick={handleWorkerClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Quick Stats */}
      {total > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-sm text-muted-foreground">
                    {searchType === 'jobs' ? 'Jobs' : 'Workers'} Found
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filters.location ? '1' : 'All'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filters.location || 'Locations'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Object.keys(filters).filter(key => 
                      filters[key as keyof SearchFilters] !== undefined && 
                      filters[key as keyof SearchFilters] !== '' &&
                      key !== 'page' && key !== 'limit'
                    ).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active Filters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
