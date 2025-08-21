import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/lib/review-service';
import { NotificationService } from '@/lib/notification-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const reviewerId = searchParams.get('reviewerId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const category = searchParams.get('category') as any;
    const rating = searchParams.get('rating');
    const query = searchParams.get('query');

    if (query) {
      // Search reviews
      const reviews = await ReviewService.searchReviews(query, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        rating: rating ? parseInt(rating) : undefined,
        category,
      });

      return NextResponse.json({
        success: true,
        reviews,
      });
    }

    if (reviewerId) {
      // Get reviews written by a user
      const reviews = await ReviewService.getReviewsByUser(reviewerId, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });

      return NextResponse.json({
        success: true,
        reviews,
      });
    }

    if (userId) {
      // Get reviews for a user
      const reviews = await ReviewService.getUserReviews(userId, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        category,
        rating: rating ? parseInt(rating) : undefined,
      });

      return NextResponse.json({
        success: true,
        reviews,
      });
    }

    return NextResponse.json(
      { error: 'User ID, reviewer ID, or search query is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, reviewerId, revieweeId, rating, title, comment, category, isPublic } = body;

    // Validate required fields
    if (!jobId || !reviewerId || !revieweeId || !rating || !title || !comment || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user can review this job
    const canReview = await ReviewService.canReviewJob(jobId, reviewerId);
    if (!canReview.canReview) {
      return NextResponse.json(
        { error: canReview.reason || 'Cannot review this job' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await ReviewService.createReview({
      jobId,
      reviewerId,
      revieweeId,
      rating,
      title,
      comment,
      category,
      isPublic: isPublic ?? true,
    });

    // Send notification to reviewee
    try {
      await NotificationService.createNotification({
        userId: revieweeId,
        title: 'New Review Received',
        message: `You received a ${rating}-star review: "${title}"`,
        type: 'success',
        isRead: false,
        actionUrl: `/reviews?userId=${revieweeId}`,
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the review creation if notification fails
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error: any) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}
