import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/search-service';

export async function GET(request: NextRequest) {
  try {
    // Get popular searches
    const searches = await SearchService.getPopularSearches();

    return NextResponse.json({
      success: true,
      searches,
    });
  } catch (error: any) {
    console.error('Failed to get popular searches:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get popular searches' },
      { status: 500 }
    );
  }
}
