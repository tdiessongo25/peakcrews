import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/search-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract search filters from query parameters
    const filters = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      location: searchParams.get('location') || undefined,
      radius: searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined,
      priceRange: searchParams.get('priceMin') && searchParams.get('priceMax') ? {
        min: parseInt(searchParams.get('priceMin')!),
        max: parseInt(searchParams.get('priceMax')!),
      } : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      availability: searchParams.get('availability') as any || undefined,
      experience: searchParams.get('experience') as any || undefined,
      jobType: searchParams.get('jobType') as any || undefined,
      skills: searchParams.get('skills') ? searchParams.get('skills')!.split(',') : undefined,
      datePosted: searchParams.get('datePosted') as any || undefined,
      sortBy: searchParams.get('sortBy') as any || 'relevance',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    };

    // Perform the search
    const results = await SearchService.searchJobs(filters);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error('Failed to search jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search jobs' },
      { status: 500 }
    );
  }
}
