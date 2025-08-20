// Search service for advanced job and worker discovery
// In a real app, this would integrate with Elasticsearch or similar search engine

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  radius?: number; // in miles
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: 'immediate' | 'this_week' | 'this_month' | 'flexible';
  experience?: 'entry' | 'intermediate' | 'expert';
  jobType?: 'full_time' | 'part_time' | 'contract' | 'project';
  skills?: string[];
  datePosted?: 'today' | 'this_week' | 'this_month' | 'all';
  sortBy?: 'relevance' | 'date' | 'price_high' | 'price_low' | 'rating' | 'distance';
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  filters: SearchFilters;
  suggestions?: string[];
}

export interface JobSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  price: number;
  priceType: 'hourly' | 'fixed' | 'negotiable';
  hirerId: string;
  hirerName: string;
  hirerRating: number;
  hirerReviewCount: number;
  postedDate: string;
  urgency: 'low' | 'medium' | 'high';
  skills: string[];
  distance?: number; // in miles
  relevanceScore: number;
}

export interface WorkerSearchResult {
  id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  skills: string[];
  experience: string;
  availability: string;
  completedJobs: number;
  distance?: number; // in miles
  relevanceScore: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'job_title' | 'skill' | 'location' | 'category';
  count: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: string[];
  popularCategories: string[];
  popularLocations: string[];
  averageResultsPerSearch: number;
  searchSuccessRate: number;
}

export class SearchService {
  // Mock data for development
  private static mockJobs: JobSearchResult[] = [
    {
      id: '1',
      title: 'Emergency Electrical Repair',
      description: 'Need immediate electrical repair for commercial building. Experienced electrician required.',
      category: 'electrical',
      location: 'San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      price: 150,
      priceType: 'hourly',
      hirerId: 'hirer1',
      hirerName: 'John Smith',
      hirerRating: 4.5,
      hirerReviewCount: 12,
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      urgency: 'high',
      skills: ['electrical', 'commercial', 'emergency'],
      relevanceScore: 0.95,
    },
    {
      id: '2',
      title: 'Plumbing Repair - Leaky Faucet',
      description: 'Kitchen faucet is leaking and needs repair. Looking for reliable plumber.',
      category: 'plumbing',
      location: 'Oakland, CA',
      coordinates: { lat: 37.8044, lng: -122.2711 },
      price: 80,
      priceType: 'fixed',
      hirerId: 'hirer2',
      hirerName: 'Sarah Johnson',
      hirerRating: 4.2,
      hirerReviewCount: 8,
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      urgency: 'medium',
      skills: ['plumbing', 'residential', 'repair'],
      relevanceScore: 0.88,
    },
    {
      id: '3',
      title: 'HVAC System Installation',
      description: 'Need new HVAC system installed in 2000 sq ft office space. Licensed contractor required.',
      category: 'hvac',
      location: 'San Jose, CA',
      coordinates: { lat: 37.3382, lng: -121.8863 },
      price: 5000,
      priceType: 'fixed',
      hirerId: 'hirer3',
      hirerName: 'Mike Wilson',
      hirerRating: 4.8,
      hirerReviewCount: 25,
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      urgency: 'low',
      skills: ['hvac', 'commercial', 'installation'],
      relevanceScore: 0.92,
    },
  ];

  private static mockWorkers: WorkerSearchResult[] = [
    {
      id: 'user1',
      name: 'Mike Worker',
      title: 'Licensed Electrician',
      bio: 'Experienced electrician with 10+ years in commercial and residential electrical work.',
      location: 'San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      rating: 4.7,
      reviewCount: 45,
      hourlyRate: 75,
      skills: ['electrical', 'commercial', 'residential', 'emergency'],
      experience: 'expert',
      availability: 'immediate',
      completedJobs: 156,
      relevanceScore: 0.94,
    },
    {
      id: 'user2',
      name: 'Lisa Plumber',
      title: 'Master Plumber',
      bio: 'Licensed plumber specializing in residential plumbing repairs and installations.',
      location: 'Oakland, CA',
      coordinates: { lat: 37.8044, lng: -122.2711 },
      rating: 4.5,
      reviewCount: 32,
      hourlyRate: 65,
      skills: ['plumbing', 'residential', 'repair', 'installation'],
      experience: 'intermediate',
      availability: 'this_week',
      completedJobs: 89,
      relevanceScore: 0.87,
    },
    {
      id: 'user3',
      name: 'David HVAC',
      title: 'HVAC Specialist',
      bio: 'Certified HVAC technician with expertise in commercial and residential systems.',
      location: 'San Jose, CA',
      coordinates: { lat: 37.3382, lng: -121.8863 },
      rating: 4.9,
      reviewCount: 67,
      hourlyRate: 85,
      skills: ['hvac', 'commercial', 'residential', 'installation'],
      experience: 'expert',
      availability: 'flexible',
      completedJobs: 234,
      relevanceScore: 0.96,
    },
  ];

  // Search jobs with advanced filtering
  static async searchJobs(filters: SearchFilters): Promise<SearchResult<JobSearchResult>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let results = [...this.mockJobs];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      results = results.filter(job => job.category === filters.category);
    }

    if (filters.location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.priceRange) {
      results = results.filter(job => 
        job.price >= filters.priceRange!.min && job.price <= filters.priceRange!.max
      );
    }

    if (filters.rating) {
      results = results.filter(job => job.hirerRating >= filters.rating!);
    }

    if (filters.datePosted) {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.datePosted) {
        case 'today':
          cutoff.setDate(now.getDate() - 1);
          break;
        case 'this_week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'this_month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (filters.datePosted !== 'all') {
        results = results.filter(job => new Date(job.postedDate) >= cutoff);
      }
    }

    // Sort results
    const sortBy = filters.sortBy || 'relevance';
    switch (sortBy) {
      case 'date':
        results.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'price_high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'price_low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        results.sort((a, b) => b.hirerRating - a.hirerRating);
        break;
      case 'relevance':
      default:
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      items: paginatedResults,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit),
      hasMore: endIndex < results.length,
      filters,
      suggestions: this.generateSuggestions(filters.query || ''),
    };
  }

  // Search workers with advanced filtering
  static async searchWorkers(filters: SearchFilters): Promise<SearchResult<WorkerSearchResult>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let results = [...this.mockWorkers];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(worker => 
        worker.name.toLowerCase().includes(query) ||
        worker.title.toLowerCase().includes(query) ||
        worker.bio.toLowerCase().includes(query) ||
        worker.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      results = results.filter(worker => 
        worker.skills.some(skill => skill === filters.category)
      );
    }

    if (filters.location) {
      results = results.filter(worker => 
        worker.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.priceRange) {
      results = results.filter(worker => 
        worker.hourlyRate >= filters.priceRange!.min && worker.hourlyRate <= filters.priceRange!.max
      );
    }

    if (filters.rating) {
      results = results.filter(worker => worker.rating >= filters.rating!);
    }

    if (filters.experience) {
      results = results.filter(worker => worker.experience === filters.experience);
    }

    if (filters.availability) {
      results = results.filter(worker => worker.availability === filters.availability);
    }

    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(worker => 
        filters.skills!.some(skill => worker.skills.includes(skill))
      );
    }

    // Sort results
    const sortBy = filters.sortBy || 'relevance';
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_high':
        results.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'price_low':
        results.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'relevance':
      default:
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      items: paginatedResults,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit),
      hasMore: endIndex < results.length,
      filters,
      suggestions: this.generateSuggestions(filters.query || ''),
    };
  }

  // Get search suggestions
  static async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const suggestions: SearchSuggestion[] = [];
    
    if (query.length < 2) return suggestions;

    const queryLower = query.toLowerCase();

    // Job title suggestions
    const jobTitles = ['electrical repair', 'plumbing service', 'hvac installation', 'carpentry work'];
    jobTitles.forEach(title => {
      if (title.toLowerCase().includes(queryLower)) {
        suggestions.push({ text: title, type: 'job_title', count: Math.floor(Math.random() * 50) + 10 });
      }
    });

    // Skill suggestions
    const skills = ['electrical', 'plumbing', 'hvac', 'carpentry', 'painting', 'landscaping'];
    skills.forEach(skill => {
      if (skill.toLowerCase().includes(queryLower)) {
        suggestions.push({ text: skill, type: 'skill', count: Math.floor(Math.random() * 100) + 20 });
      }
    });

    // Location suggestions
    const locations = ['San Francisco', 'Oakland', 'San Jose', 'Berkeley', 'Palo Alto'];
    locations.forEach(location => {
      if (location.toLowerCase().includes(queryLower)) {
        suggestions.push({ text: location, type: 'location', count: Math.floor(Math.random() * 200) + 50 });
      }
    });

    // Category suggestions
    const categories = ['electrical', 'plumbing', 'hvac', 'carpentry', 'painting'];
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.push({ text: category, type: 'category', count: Math.floor(Math.random() * 150) + 30 });
      }
    });

    return suggestions.sort((a, b) => b.count - a.count).slice(0, 8);
  }

  // Generate search suggestions based on query
  private static generateSuggestions(query: string): string[] {
    if (!query) return [];
    
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Add related terms
    if (queryLower.includes('electrical')) {
      suggestions.push('electrical repair', 'electrical installation', 'electrical maintenance');
    }
    if (queryLower.includes('plumbing')) {
      suggestions.push('plumbing repair', 'plumbing installation', 'plumbing service');
    }
    if (queryLower.includes('hvac')) {
      suggestions.push('hvac installation', 'hvac repair', 'hvac maintenance');
    }

    return suggestions.slice(0, 5);
  }

  // Get popular searches
  static async getPopularSearches(): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      'electrical repair',
      'plumbing service',
      'hvac installation',
      'carpentry work',
      'painting service',
      'landscaping',
      'emergency repair',
      'commercial electrical',
    ];
  }

  // Get search analytics
  static async getSearchAnalytics(): Promise<SearchAnalytics> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalSearches: 15420,
      popularQueries: ['electrical repair', 'plumbing service', 'hvac installation'],
      popularCategories: ['electrical', 'plumbing', 'hvac'],
      popularLocations: ['San Francisco', 'Oakland', 'San Jose'],
      averageResultsPerSearch: 8.5,
      searchSuccessRate: 94.2,
    };
  }

  // Get nearby jobs/workers based on coordinates
  static async getNearbyJobs(lat: number, lng: number, radius: number = 10): Promise<JobSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, you would use geospatial queries
    // For now, we'll filter by approximate distance
    return this.mockJobs.filter(job => {
      if (!job.coordinates) return false;
      
      const distance = this.calculateDistance(lat, lng, job.coordinates.lat, job.coordinates.lng);
      return distance <= radius;
    });
  }

  static async getNearbyWorkers(lat: number, lng: number, radius: number = 10): Promise<WorkerSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return this.mockWorkers.filter(worker => {
      if (!worker.coordinates) return false;
      
      const distance = this.calculateDistance(lat, lng, worker.coordinates.lat, worker.coordinates.lng);
      return distance <= radius;
    });
  }

  // Calculate distance between two coordinates (Haversine formula)
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get search filters for UI
  static async getSearchFilters(): Promise<{
    categories: string[];
    locations: string[];
    priceRanges: { label: string; min: number; max: number }[];
    experienceLevels: string[];
    availabilityOptions: string[];
    jobTypes: string[];
  }> {
    return {
      categories: ['electrical', 'plumbing', 'hvac', 'carpentry', 'painting', 'landscaping', 'cleaning'],
      locations: ['San Francisco', 'Oakland', 'San Jose', 'Berkeley', 'Palo Alto', 'Mountain View'],
      priceRanges: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200 - $500', min: 200, max: 500 },
        { label: 'Over $500', min: 500, max: 10000 },
      ],
      experienceLevels: ['entry', 'intermediate', 'expert'],
      availabilityOptions: ['immediate', 'this_week', 'this_month', 'flexible'],
      jobTypes: ['full_time', 'part_time', 'contract', 'project'],
    };
  }
}
