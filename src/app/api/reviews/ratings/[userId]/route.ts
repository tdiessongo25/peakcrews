import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/lib/review-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const rating = await ReviewService.getUserRating(userId);

    return NextResponse.json({
      success: true,
      rating,
    });
  } catch (error: any) {
    console.error('Failed to fetch user rating:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user rating' },
      { status: 500 }
    );
  }
}
