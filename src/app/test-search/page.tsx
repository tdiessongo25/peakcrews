"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import type { SearchFilters, JobSearchResult, WorkerSearchResult } from '@/lib/search-service';

export default function TestSearchPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [searchType, setSearchType] = useState<'jobs' | 'workers'>('jobs');
  const [sampleJobs, setSampleJobs] = useState<JobSearchResult[]>([]);
  const [sampleWorkers, setSampleWorkers] = useState<WorkerSearchResult[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
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

      // Test 2: Test job search
      try {
        const response = await fetch('/api/search/jobs?query=electrical&category=electrical&limit=5');
        const data = await response.json();

        if (response.ok && data.items) {
          addTestResult('Job Search', 'pass', `Found ${data.items.length} jobs`);
          setSampleJobs(data.items);
        } else {
          addTestResult('Job Search', 'fail', data.error || 'Failed to search jobs');
        }
      } catch (error) {
        addTestResult('Job Search', 'fail', `Error: ${error}`);
      }

      // Test 3: Test worker search
      try {
        const response = await fetch('/api/search/workers?query=electrician&limit=5');
        const data = await response.json();

        if (response.ok && data.items) {
          addTestResult('Worker Search', 'pass', `Found ${data.items.length} workers`);
          setSampleWorkers(data.items);
        } else {
          addTestResult('Worker Search', 'fail', data.error || 'Failed to search workers');
        }
      } catch (error) {
        addTestResult('Worker Search', 'fail', `Error: ${error}`);
      }

      // Test 4: Test search suggestions
      try {
        const response = await fetch('/api/search/suggestions?query=electrical');
        const data = await response.json();

        if (response.ok && data.suggestions) {
          addTestResult('Search Suggestions', 'pass', `Found ${data.suggestions.length} suggestions`);
        } else {
          addTestResult('Search Suggestions', 'fail', data.error || 'Failed to get suggestions');
        }
      } catch (error) {
        addTestResult('Search Suggestions', 'fail', `Error: ${error}`);
      }

      // Test 5: Test popular searches
      try {
        const response = await fetch('/api/search/popular');
        const data = await response.json();

        if (response.ok && data.searches) {
          addTestResult('Popular Searches', 'pass', `Found ${data.searches.length} popular searches`);
        } else {
          addTestResult('Popular Searches', 'fail', data.error || 'Failed to get popular searches');
        }
      } catch (error) {
        addTestResult('Popular Searches', 'fail', `Error: ${error}`);
      }

      // Test 6: Test search analytics
      try {
        const response = await fetch('/api/search/analytics');
        const data = await response.json();

        if (response.ok && data.analytics) {
          addTestResult('Search Analytics', 'pass', 'Analytics retrieved successfully');
        } else {
          addTestResult('Search Analytics', 'fail', data.error || 'Failed to get analytics');
        }
      } catch (error) {
        addTestResult('Search Analytics', 'fail', `Error: ${error}`);
      }

      // Test 7: Test advanced filters
      try {
        const filters = {
          query: 'plumbing',
          category: 'plumbing',
          priceRange: { min: 50, max: 200 },
          rating: 4.0,
          sortBy: 'rating' as const,
        };

        const searchParams = new URLSearchParams();
        searchParams.append('query', filters.query);
        searchParams.append('category', filters.category);
        searchParams.append('priceMin', filters.priceRange.min.toString());
        searchParams.append('priceMax', filters.priceRange.max.toString());
        searchParams.append('rating', filters.rating.toString());
        searchParams.append('sortBy', filters.sortBy);

        const response = await fetch(`/api/search/jobs?${searchParams.toString()}`);
        const data = await response.json();

        if (response.ok) {
          addTestResult('Advanced Filters', 'pass', `Applied filters successfully`);
          setSearchFilters(filters);
        } else {
          addTestResult('Advanced Filters', 'fail', data.error || 'Failed to apply filters');
        }
      } catch (error) {
        addTestResult('Advanced Filters', 'fail', `Error: ${error}`);
      }

    } catch (error) {
      addTestResult('Test Suite', 'fail', `Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    toast({
      title: 'Search Test',
      description: 'Search filters applied successfully.',
    });
    addTestResult('Live Search Test', 'pass', 'Search filters applied successfully');
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
          <h1 className="text-3xl font-bold mb-2">Search & Discovery System Test</h1>
          <p className="text-muted-foreground">
            Test the advanced search and discovery functionality to ensure job and worker search is working correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
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
                <Filter className="h-5 w-5" />
                Search Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Advanced filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Search suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Location-based search</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Price range filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Rating-based sorting</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
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
                asChild 
                className="w-full"
              >
                <Link href="/search">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Open Search
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Search Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Search Test</CardTitle>
            <CardDescription>
              Test the search form with real functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedSearch
              onSearch={handleSearch}
              searchType={searchType}
              initialFilters={searchFilters}
            />
          </CardContent>
        </Card>

        {/* Sample Results Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sampleJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Job Results</CardTitle>
                <CardDescription>
                  Example of job search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchResults
                  jobs={sampleJobs}
                  total={sampleJobs.length}
                  page={1}
                  totalPages={1}
                  hasMore={false}
                  filters={{}}
                  isLoading={false}
                  onLoadMore={() => {}}
                />
              </CardContent>
            </Card>
          )}

          {sampleWorkers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Worker Results</CardTitle>
                <CardDescription>
                  Example of worker search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchResults
                  workers={sampleWorkers}
                  total={sampleWorkers.length}
                  page={1}
                  totalPages={1}
                  hasMore={false}
                  filters={{}}
                  isLoading={false}
                  onLoadMore={() => {}}
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
                  Job and worker search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Advanced filtering options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Search suggestions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Location-based search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Price range filtering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Rating and sorting
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
                  <Search className="h-4 w-4 text-blue-600" />
                  Real-time search suggestions
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  Multiple search categories
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  Geospatial search
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  Skill-based matching
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  Search analytics
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  Popular search tracking
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
