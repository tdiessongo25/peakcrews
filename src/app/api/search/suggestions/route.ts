import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/search-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Get search suggestions
    const suggestions = await SearchService.getSearchSuggestions(query);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error: any) {
    console.error('Failed to get search suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get search suggestions' },
      { status: 500 }
    );
  }
}
