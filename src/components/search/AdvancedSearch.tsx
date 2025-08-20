"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Map,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SearchFilters, SearchSuggestion } from '@/lib/search-service';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear?: () => void;
  searchType?: 'jobs' | 'workers';
  initialFilters?: SearchFilters;
  className?: string;
}

export function AdvancedSearch({ 
  onSearch, 
  onClear, 
  searchType = 'jobs',
  initialFilters = {},
  className = "" 
}: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialFilters.query || '');
  const [category, setCategory] = useState(initialFilters.category || 'all');
  const [location, setLocation] = useState(initialFilters.location || '');
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || { min: 0, max: 1000 });
  const [rating, setRating] = useState(initialFilters.rating || 0);
  const [availability, setAvailability] = useState(initialFilters.availability || 'any');
  const [experience, setExperience] = useState(initialFilters.experience || 'any');
  const [jobType, setJobType] = useState(initialFilters.jobType || 'any');
  const [datePosted, setDatePosted] = useState(initialFilters.datePosted || 'any');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'relevance');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialFilters.skills || []);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Available options
  const categories = ['electrical', 'plumbing', 'hvac', 'carpentry', 'painting', 'landscaping', 'cleaning'];
  const locations = ['San Francisco', 'Oakland', 'San Jose', 'Berkeley', 'Palo Alto', 'Mountain View'];
  const availabilityOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'flexible', label: 'Flexible' },
  ];
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' },
  ];
  const jobTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'project', label: 'Project' },
  ];
  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date Posted' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'rating', label: 'Rating' },
  ];
  const skills = ['electrical', 'plumbing', 'hvac', 'carpentry', 'painting', 'landscaping', 'cleaning', 'emergency', 'commercial', 'residential'];

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch('/api/search/popular');
      if (response.ok) {
        const data = await response.json();
        setPopularSearches(data.searches);
      }
    } catch (error) {
      console.error('Failed to fetch popular searches:', error);
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search/suggestions?query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    
    const filters: SearchFilters = {
      query: query.trim(),
      category: category !== 'all' ? category : undefined,
      location: location || undefined,
      priceRange: priceRange.min > 0 || priceRange.max < 1000 ? priceRange : undefined,
      rating: rating > 0 ? rating : undefined,
      availability: availability !== 'any' ? availability : undefined,
      experience: experience !== 'any' ? experience : undefined,
      jobType: jobType !== 'any' ? jobType : undefined,
      datePosted: datePosted !== 'any' ? datePosted : undefined,
      sortBy: sortBy,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    };

    onSearch(filters);
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleClear = () => {
    setQuery('');
    setCategory('all');
    setLocation('');
    setPriceRange({ min: 0, max: 1000 });
    setRating(0);
    setAvailability('any');
    setExperience('any');
    setJobType('any');
    setDatePosted('any');
    setSortBy('relevance');
    setSelectedSkills([]);
    setShowFilters(false);
    onClear?.();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handlePopularSearchClick = (search: string) => {
    setQuery(search);
    handleSearch();
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const formatPrice = (value: number) => {
    return `$${value}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {searchType === 'jobs' ? 'Find Jobs' : 'Find Workers'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder={`Search ${searchType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{suggestion.text}</span>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.type}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Searches */}
        {!query && popularSearches.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Popular Searches</Label>
            <div className="flex flex-wrap gap-2">
              {popularSearches.slice(0, 6).map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePopularSearchClick(search)}
                  className="text-xs"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="space-y-2">
                  <Slider
                    value={[priceRange.min, priceRange.max]}
                    onValueChange={([min, max]) => setPriceRange({ min, max })}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange.min)}</span>
                    <span>{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[rating]}
                    onValueChange={([value]) => setRating(value)}
                    max={5}
                    step={0.5}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{rating}</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Availability</SelectItem>
                    {availabilityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Experience</SelectItem>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Type</SelectItem>
                    {jobTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Posted */}
              <div className="space-y-2">
                <Label>Date Posted</Label>
                <Select value={datePosted} onValueChange={setDatePosted}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    {dateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
