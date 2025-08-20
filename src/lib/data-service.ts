import type { Job, JobApplication, Review, Notification, User } from './types';

export class DataService {
  // Job Management
  static async getJobs(filters?: {
    trade?: string;
    location?: string;
    status?: string;
    hirerId?: string;
  }): Promise<Job[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch jobs');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to fetch jobs:', error);
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
  }

  static async getJob(jobId: string): Promise<Job> {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch job');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to fetch job:', error);
      throw new Error(`Failed to fetch job: ${error.message}`);
    }
  }

  static async createJob(jobData: Omit<Job, 'id' | 'postedAt'>): Promise<Job> {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create job');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to create job:', error);
      throw new Error(`Failed to create job: ${error.message}`);
    }
  }

  static async updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to update job:', error);
      throw new Error(`Failed to update job: ${error.message}`);
    }
  }

  static async deleteJob(jobId: string): Promise<void> {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete job');
      }
    } catch (error: any) {
      console.error('Failed to delete job:', error);
      throw new Error(`Failed to delete job: ${error.message}`);
    }
  }

  // Job Applications
  static async getApplications(filters?: {
    jobId?: string;
    workerId?: string;
    status?: string;
  }): Promise<JobApplication[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await fetch(`/api/applications?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch applications');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }
  }

  static async createApplication(applicationData: Omit<JobApplication, 'id' | 'appliedAt'>): Promise<JobApplication> {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create application');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to create application:', error);
      throw new Error(`Failed to create application: ${error.message}`);
    }
  }

  static async updateApplication(applicationId: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update application');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to update application:', error);
      throw new Error(`Failed to update application: ${error.message}`);
    }
  }

  // Reviews
  static async getReviews(filters?: {
    jobId?: string;
    reviewerId?: string;
    revieweeId?: string;
  }): Promise<Review[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const response = await fetch(`/api/reviews?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch reviews');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  }

  static async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create review');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to create review:', error);
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  // Notifications
  static async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notifications');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark notification as read');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  // User Management
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch current user');
      }
      const data = await response.json();
      return data.user;
    } catch (error: any) {
      console.error('Failed to fetch current user:', error);
      throw new Error(`Failed to fetch current user: ${error.message}`);
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
} 