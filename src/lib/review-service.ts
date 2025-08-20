// Review service for managing job reviews and ratings
// In a real app, this would integrate with the database

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string; // User who wrote the review
  revieweeId: string; // User being reviewed
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  category: 'communication' | 'quality' | 'timeliness' | 'professionalism' | 'overall';
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserRating {
  userId: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
    overall: number;
  };
  lastReviewDate?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: Review[];
  topCategories: {
    category: string;
    average: number;
  }[];
}

export class ReviewService {
  // Mock reviews for development
  private static mockReviews: Review[] = [
    {
      id: 'review_1',
      jobId: '1',
      reviewerId: 'hirer1',
      revieweeId: 'user1',
      rating: 5,
      title: 'Excellent Electrical Work',
      comment: 'Mike did an outstanding job fixing our electrical issues. He was professional, on time, and the work quality was exceptional. Highly recommend!',
      category: 'overall',
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: 'review_2',
      jobId: '1',
      reviewerId: 'user1',
      revieweeId: 'hirer1',
      rating: 4,
      title: 'Great Client to Work With',
      comment: 'The client was very clear about their requirements and paid promptly. Good communication throughout the project.',
      category: 'overall',
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
    {
      id: 'review_3',
      jobId: '2',
      reviewerId: 'hirer2',
      revieweeId: 'user1',
      rating: 4,
      title: 'Good Plumbing Work',
      comment: 'Fixed the leaky faucet quickly and efficiently. Professional service and fair pricing.',
      category: 'overall',
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: 'review_4',
      jobId: '2',
      reviewerId: 'user1',
      revieweeId: 'hirer2',
      rating: 5,
      title: 'Excellent Communication',
      comment: 'The client was very responsive and provided clear instructions. Payment was processed quickly.',
      category: 'overall',
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
  ];

  // Create a new review
  static async createReview(data: {
    jobId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    title: string;
    comment: string;
    category: Review['category'];
    isPublic?: boolean;
  }): Promise<Review> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const review: Review = {
      id: `review_${Date.now()}`,
      jobId: data.jobId,
      reviewerId: data.reviewerId,
      revieweeId: data.revieweeId,
      rating: Math.max(1, Math.min(5, data.rating)), // Ensure rating is between 1-5
      title: data.title,
      comment: data.comment,
      category: data.category,
      isPublic: data.isPublic ?? true,
      createdAt: new Date().toISOString(),
    };

    this.mockReviews.push(review);
    
    console.log('Created review:', review);
    return review;
  }

  // Get reviews for a user
  static async getUserReviews(userId: string, options?: {
    limit?: number;
    offset?: number;
    category?: Review['category'];
    rating?: number;
  }): Promise<Review[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let reviews = this.mockReviews.filter(review => 
      review.revieweeId === userId && review.isPublic
    );

    // Apply filters
    if (options?.category) {
      reviews = reviews.filter(review => review.category === options.category);
    }
    if (options?.rating) {
      reviews = reviews.filter(review => review.rating === options.rating);
    }

    // Apply pagination
    if (options?.offset) {
      reviews = reviews.slice(options.offset);
    }
    if (options?.limit) {
      reviews = reviews.slice(0, options.limit);
    }

    // Sort by creation date (newest first)
    return reviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get reviews written by a user
  static async getReviewsByUser(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Review[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let reviews = this.mockReviews.filter(review => 
      review.reviewerId === userId
    );

    // Apply pagination
    if (options?.offset) {
      reviews = reviews.slice(options.offset);
    }
    if (options?.limit) {
      reviews = reviews.slice(0, options.limit);
    }

    // Sort by creation date (newest first)
    return reviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get user rating statistics
  static async getUserRating(userId: string): Promise<UserRating> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const reviews = this.mockReviews.filter(review => 
      review.revieweeId === userId && review.isPublic
    );

    if (reviews.length === 0) {
      return {
        userId,
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        categoryAverages: {
          communication: 0,
          quality: 0,
          timeliness: 0,
          professionalism: 0,
          overall: 0,
        },
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++;
    });

    // Calculate category averages (simplified - in real app, you'd have separate category ratings)
    const categoryAverages = {
      communication: averageRating,
      quality: averageRating,
      timeliness: averageRating,
      professionalism: averageRating,
      overall: averageRating,
    };

    const lastReview = reviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return {
      userId,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
      ratingBreakdown,
      categoryAverages,
      lastReviewDate: lastReview.createdAt,
    };
  }

  // Get review statistics
  static async getReviewStats(userId: string): Promise<ReviewStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const reviews = this.mockReviews.filter(review => 
      review.revieweeId === userId && review.isPublic
    );

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentReviews: [],
        topCategories: [],
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const recentReviews = reviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Calculate category averages (simplified)
    const categoryAverages = {
      communication: averageRating,
      quality: averageRating,
      timeliness: averageRating,
      professionalism: averageRating,
      overall: averageRating,
    };

    const topCategories = Object.entries(categoryAverages)
      .map(([category, average]) => ({ category, average }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      recentReviews,
      topCategories,
    };
  }

  // Update a review
  static async updateReview(reviewId: string, data: {
    rating?: number;
    title?: string;
    comment?: string;
    isPublic?: boolean;
  }): Promise<Review> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const review = this.mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (data.rating !== undefined) {
      review.rating = Math.max(1, Math.min(5, data.rating));
    }
    if (data.title !== undefined) {
      review.title = data.title;
    }
    if (data.comment !== undefined) {
      review.comment = data.comment;
    }
    if (data.isPublic !== undefined) {
      review.isPublic = data.isPublic;
    }

    review.updatedAt = new Date().toISOString();
    
    console.log('Updated review:', review);
    return review;
  }

  // Delete a review
  static async deleteReview(reviewId: string, userId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reviewIndex = this.mockReviews.findIndex(r => 
      r.id === reviewId && r.reviewerId === userId
    );
    
    if (reviewIndex !== -1) {
      this.mockReviews.splice(reviewIndex, 1);
      console.log('Deleted review:', reviewId);
    } else {
      throw new Error('Review not found or unauthorized');
    }
  }

  // Check if user can review a job
  static async canReviewJob(jobId: string, userId: string): Promise<{
    canReview: boolean;
    reason?: string;
    existingReview?: Review;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if user has already reviewed this job
    const existingReview = this.mockReviews.find(review => 
      review.jobId === jobId && review.reviewerId === userId
    );

    if (existingReview) {
      return {
        canReview: false,
        reason: 'You have already reviewed this job',
        existingReview,
      };
    }

    // In a real app, you would also check:
    // - If the job is completed
    // - If the user was involved in the job
    // - If enough time has passed since job completion

    return {
      canReview: true,
    };
  }

  // Get top rated users
  static async getTopRatedUsers(limit: number = 10): Promise<UserRating[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIds = [...new Set(this.mockReviews.map(review => review.revieweeId))];
    const userRatings = await Promise.all(
      userIds.map(userId => this.getUserRating(userId))
    );

    return userRatings
      .filter(rating => rating.totalReviews > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  }

  // Search reviews
  static async searchReviews(query: string, options?: {
    limit?: number;
    offset?: number;
    rating?: number;
    category?: Review['category'];
  }): Promise<Review[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let reviews = this.mockReviews.filter(review => 
      review.isPublic && (
        review.title.toLowerCase().includes(query.toLowerCase()) ||
        review.comment.toLowerCase().includes(query.toLowerCase())
      )
    );

    // Apply filters
    if (options?.rating) {
      reviews = reviews.filter(review => review.rating === options.rating);
    }
    if (options?.category) {
      reviews = reviews.filter(review => review.category === options.category);
    }

    // Apply pagination
    if (options?.offset) {
      reviews = reviews.slice(options.offset);
    }
    if (options?.limit) {
      reviews = reviews.slice(0, options.limit);
    }

    return reviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
