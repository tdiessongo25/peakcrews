import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/search-service';

export async function GET(request: NextRequest) {
  try {
    // Get search analytics
    const analytics = await SearchService.getSearchAnalytics();

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error('Failed to get search analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get search analytics' },
      { status: 500 }
    );
  }
}
