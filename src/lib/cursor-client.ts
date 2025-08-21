import config from '../../cursor.config';
import type { User, UserRole, Job, JobApplication, Review, Notification, WorkerProfileInfo, HirerProfileInfo } from './types';

export interface CursorAuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface CursorApiErrorData {
  code: string;
  message: string;
  details?: any;
}

export interface CursorApiResponse<T> {
  data?: T;
  error?: CursorApiErrorData;
}

class CursorApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CursorApiError';
  }
}

// Mock data for development
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    hirerId: 'hirer1',
    hirerName: 'John Smith',
    trade: 'Electrician',
    title: 'Emergency Electrical Repair Needed',
    description: 'Need an experienced electrician to fix a circuit breaker issue. The power keeps tripping and we need it resolved ASAP.',
    location: 'Brooklyn, NY',
    address: '123 Main St, Brooklyn, NY 11201',
    jobType: 'ASAP',
    scheduledDateTime: undefined,
    duration: '2-3 hours',
    rate: 150,
    status: 'open',
    postedAt: new Date().toISOString(),
  },
  {
    id: '2',
    hirerId: 'hirer2',
    hirerName: 'Sarah Johnson',
    trade: 'Plumber',
    title: 'Kitchen Sink Installation',
    description: 'Need a plumber to install a new kitchen sink and connect the plumbing. All materials provided.',
    location: 'Manhattan, NY',
    address: '456 Park Ave, Manhattan, NY 10022',
    jobType: 'Scheduled',
    scheduledDateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    duration: '4-5 hours',
    rate: 200,
    status: 'open',
    postedAt: new Date().toISOString(),
  },
  {
    id: '3',
    hirerId: 'hirer3',
    hirerName: 'Mike Davis',
    trade: 'Carpenter',
    title: 'Custom Bookshelf Construction',
    description: 'Looking for a skilled carpenter to build a custom bookshelf. Need it to fit specific dimensions.',
    location: 'Queens, NY',
    address: '789 Queens Blvd, Queens, NY 11375',
    jobType: 'Scheduled',
    scheduledDateTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    duration: '1-2 days',
    rate: 300,
    status: 'open',
    postedAt: new Date().toISOString(),
  },
];

class CursorClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.apiKey = process.env.CURSOR_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('CURSOR_API_KEY not found in environment variables');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CursorApiError(
        errorData.code || `HTTP_${response.status}`,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData.details
      );
    }

    return response.json();
  }

  // Authentication methods
  // Mock authentication data for development
  private mockUsers: User[] = [
    {
      id: 'user1',
      name: 'John Worker',
      email: 'worker@example.com',
      role: 'worker' as UserRole,
      profileImageUrl: 'https://placehold.co/100x100.png',
    },
    {
      id: 'user2',
      name: 'Jane Hirer',
      email: 'hirer@example.com',
      role: 'hirer' as UserRole,
      profileImageUrl: 'https://placehold.co/100x100.png',
    },
  ];

  private currentSession: CursorAuthResponse | null = null;

  async signIn(email: string, password: string): Promise<CursorAuthResponse> {
    // For development, accept any email/password combination
    const user = this.mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new CursorApiError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const authResponse: CursorAuthResponse = {
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = authResponse;
    return authResponse;
  }

  async signUp(
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<CursorAuthResponse> {
    // Check if user already exists
    if (this.mockUsers.find(u => u.email === email)) {
      throw new CursorApiError('EMAIL_ALREADY_EXISTS', 'An account with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user${this.mockUsers.length + 1}`,
      name,
      email,
      role,
      profileImageUrl: 'https://placehold.co/100x100.png',
    };

    this.mockUsers.push(newUser);

    const authResponse: CursorAuthResponse = {
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = authResponse;
    return authResponse;
  }

  async signOut(): Promise<void> {
    this.currentSession = null;
  }

  async refreshToken(): Promise<CursorAuthResponse> {
    if (!this.currentSession) {
      throw new CursorApiError('UNAUTHORIZED', 'No active session');
    }

    const refreshedResponse: CursorAuthResponse = {
      ...this.currentSession,
      token: `mock-token-${this.currentSession.user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = refreshedResponse;
    return refreshedResponse;
  }

  async verifyEmail(token: string): Promise<void> {
    // Mock email verification - always succeeds
    console.log('Mock email verification for token:', token);
  }

  async resetPassword(email: string): Promise<void> {
    // Mock password reset - always succeeds
    console.log('Mock password reset for email:', email);
  }

  // User management
  async getCurrentUser(): Promise<User> {
    // For development, always return a mock user
    // In production, this would check the session cookie
    const defaultUser = this.mockUsers[0];
    if (defaultUser) {
      return defaultUser;
    }
    throw new CursorApiError('UNAUTHORIZED', 'Not authenticated');
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return this.request<User>(`${config.api.data.users}/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Job management - Using mock data for development
  async getJobs(filters?: {
    trade?: string;
    location?: string;
    status?: string;
    hirerId?: string;
  }): Promise<Job[]> {
    // For development, return mock data
    let jobs = [...MOCK_JOBS];
    
    if (filters) {
      if (filters.trade) {
        jobs = jobs.filter(job => job.trade === filters.trade);
      }
      if (filters.location) {
        jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.status) {
        jobs = jobs.filter(job => job.status === filters.status);
      }
      if (filters.hirerId) {
        jobs = jobs.filter(job => job.hirerId === filters.hirerId);
      }
    }
    
    return jobs;
  }

  async getJob(jobId: string): Promise<Job> {
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) {
      throw new CursorApiError('NOT_FOUND', 'Job not found');
    }
    return job;
  }

  async createJob(job: Omit<Job, 'id' | 'postedAt'>): Promise<Job> {
    const newJob: Job = {
      ...job,
      id: (MOCK_JOBS.length + 1).toString(),
      postedAt: new Date().toISOString(),
    };
    MOCK_JOBS.push(newJob);
    return newJob;
  }

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
    const jobIndex = MOCK_JOBS.findIndex(j => j.id === jobId);
    if (jobIndex === -1) {
      throw new CursorApiError('NOT_FOUND', 'Job not found');
    }
    MOCK_JOBS[jobIndex] = { ...MOCK_JOBS[jobIndex], ...updates };
    return MOCK_JOBS[jobIndex];
  }

  async deleteJob(jobId: string): Promise<void> {
    const jobIndex = MOCK_JOBS.findIndex(j => j.id === jobId);
    if (jobIndex === -1) {
      throw new CursorApiError('NOT_FOUND', 'Job not found');
    }
    MOCK_JOBS.splice(jobIndex, 1);
  }

  // Job applications - Mock implementation
  async getApplications(filters?: {
    jobId?: string;
    workerId?: string;
    status?: string;
  }): Promise<JobApplication[]> {
    // Mock applications data
    const mockApplications: JobApplication[] = [
      {
        id: 'app1',
        jobId: '1',
        jobTitle: 'Emergency Electrical Repair Needed',
        workerId: 'user1',
        workerName: 'John Worker',
        status: 'applied',
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        coverLetter: 'I have extensive experience with electrical repairs and can start immediately.',
        proposedRate: 75,
        resumeUrl: 'https://example.com/uploads/resume_user1.pdf',
      },
      {
        id: 'app2',
        jobId: '2',
        jobTitle: 'Plumbing Repair - Leaky Faucet',
        workerId: 'user1',
        workerName: 'John Worker',
        status: 'selected',
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        coverLetter: 'I specialize in plumbing repairs and have completed similar projects.',
        proposedRate: 600,
        resumeUrl: 'https://example.com/uploads/resume_user1.pdf',
      },
      {
        id: 'app3',
        jobId: '3',
        jobTitle: 'Interior Painting for Apartment',
        workerId: 'user1',
        workerName: 'John Worker',
        status: 'confirmed',
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        coverLetter: 'I am a professional painter with attention to detail.',
        proposedRate: 450,
        resumeUrl: 'https://example.com/uploads/resume_user1.pdf',
      },
    ];

    // Apply filters
    let filteredApplications = mockApplications;
    
    if (filters) {
      if (filters.jobId) {
        filteredApplications = filteredApplications.filter(app => app.jobId === filters.jobId);
      }
      if (filters.workerId) {
        filteredApplications = filteredApplications.filter(app => app.workerId === filters.workerId);
      }
      if (filters.status) {
        filteredApplications = filteredApplications.filter(app => app.status === filters.status);
      }
    }

    return filteredApplications;
  }

  async getApplication(applicationId: string): Promise<JobApplication> {
    const applications = await this.getApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
      throw new CursorApiError('NOT_FOUND', 'Application not found');
    }
    
    return application;
  }

  async createApplication(application: Omit<JobApplication, 'id' | 'appliedAt'>): Promise<JobApplication> {
    const newApplication: JobApplication = {
      ...application,
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString(),
    };
    
    // In a real implementation, this would be saved to a database
    console.log('Created application:', newApplication);
    
    return newApplication;
  }

  async updateApplication(applicationId: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    const application = await this.getApplication(applicationId);
    
    const updatedApplication: JobApplication = {
      ...application,
      ...updates,
    };
    
    // In a real implementation, this would update the database
    console.log('Updated application:', updatedApplication);
    
    return updatedApplication;
  }

  async deleteApplication(applicationId: string): Promise<void> {
    // In a real implementation, this would delete from database
    console.log('Deleted application:', applicationId);
  }

  // Reviews - Mock implementation
  async getReviews(filters?: {
    jobId?: string;
    reviewerId?: string;
    revieweeId?: string;
  }): Promise<Review[]> {
    // Return empty array for now
    return [];
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: 'rev1',
      createdAt: new Date().toISOString(),
    };
    return newReview;
  }

  // Notifications - Mock implementation
  async getNotifications(userId: string): Promise<Notification[]> {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: 'notif1',
        userId: 'user1',
        title: 'Profile Approved',
        message: 'Your worker profile has been approved! You can now apply for jobs.',
        type: 'profile_approved',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        actionUrl: '/profile',
      },
      {
        id: 'notif2',
        userId: 'user1',
        title: 'New Application Received',
        message: 'John Worker applied for your "Emergency Electrical Repair" job.',
        type: 'application_received',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        actionUrl: '/applications',
      },
      {
        id: 'notif3',
        userId: 'user1',
        title: 'Application Status Updated',
        message: 'Your application for "Plumbing Repair" has been selected by the contractor.',
        type: 'application_status',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        actionUrl: '/applications',
      },
      {
        id: 'notif4',
        userId: 'user1',
        title: 'Profile Review Required',
        message: 'Please upload your resume to complete your profile approval.',
        type: 'reminder',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        actionUrl: '/profile',
      },
    ];

    return mockNotifications.filter(notif => notif.userId === userId);
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    // Mock implementation - in real app, this would update the database
    const notification = {
      id: notificationId,
      userId: 'user1',
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info' as const,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Marked notification as read:', notificationId);
    return notification;
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Created notification:', newNotification);
    return newNotification;
  }

  // Profiles - Mock implementation
  async getWorkerProfile(userId: string): Promise<WorkerProfileInfo> {
    return {
      userId,
      trade: 'Electrician',
      skills: ['Electrical', 'Plumbing'],
      experience: '5 years',
      certifications: ['Licensed Electrician', 'OSHA Safety'],
      availability: true,
      location: 'Denver, CO',
      bio: 'Experienced electrician with 5 years in commercial and residential work.',
      hourlyRate: 50,
      resumeUrl: 'https://example.com/uploads/resume_user1.pdf',
      profileStatus: 'pending',
    };
  }

  async updateWorkerProfile(userId: string, profile: Partial<WorkerProfileInfo>): Promise<WorkerProfileInfo> {
    return {
      userId,
      trade: 'Electrician',
      skills: ['Electrical', 'Plumbing'],
      experience: '5 years',
      certifications: ['Licensed Electrician', 'OSHA Safety'],
      availability: true,
      location: 'Denver, CO',
      bio: 'Experienced electrician with 5 years in commercial and residential work.',
      hourlyRate: 50,
      resumeUrl: 'https://example.com/uploads/resume_user1.pdf',
      profileStatus: 'pending',
      ...profile,
    };
  }

  async getHirerProfile(userId: string): Promise<HirerProfileInfo> {
    return {
      companyName: 'Test Company',
      companyInfo: 'A leading construction company',
      contactNumber: '555-123-4567',
    };
  }

  async updateHirerProfile(userId: string, profile: Partial<HirerProfileInfo>): Promise<HirerProfileInfo> {
    return {
      companyName: 'Test Company',
      companyInfo: 'A leading construction company',
      contactNumber: '555-123-4567',
      ...profile,
    };
  }

  // File storage - Mock implementation
  async uploadFile(file: File, path: string): Promise<{ url: string; path: string }> {
    // Mock implementation - in production, this would upload to cloud storage
    const mockUrl = `https://example.com/uploads/${path}`;
    console.log('Uploaded file:', { path, url: mockUrl, size: file.size, type: file.type });
    
    return {
      url: mockUrl,
      path: path,
    };
  }

  async deleteFile(path: string): Promise<void> {
    // Mock implementation
    console.log('Deleted file:', path);
  }
}

export const cursorClient = new CursorClient();
export { CursorApiError }; 