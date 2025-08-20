// Admin service for platform management and analytics
// In a real app, this would integrate with the database and external analytics

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalRevenue: number;
  activeWorkers: number;
  activeHirers: number;
  pendingApprovals: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'user_registration' | 'job_posted' | 'application_submitted' | 'payment_processed' | 'user_approved' | 'user_suspended';
  userId?: string;
  userName?: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'hirer' | 'admin';
  status: 'active' | 'pending' | 'suspended' | 'banned';
  joinDate: string;
  lastActive: string;
  totalJobs?: number;
  totalApplications?: number;
  rating?: number;
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

export interface JobManagement {
  id: string;
  title: string;
  hirerName: string;
  hirerId: string;
  category: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  postedDate: string;
  budget: number;
  applications: number;
  views: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface ApplicationManagement {
  id: string;
  jobTitle: string;
  workerName: string;
  hirerName: string;
  status: 'applied' | 'selected' | 'confirmed' | 'rejected' | 'cancelled';
  appliedDate: string;
  budget: number;
  workerRating?: number;
  hirerRating?: number;
}

export interface RevenueData {
  period: string;
  revenue: number;
  transactions: number;
  averageTransaction: number;
  platformFees: number;
  workerPayouts: number;
}

export interface AnalyticsData {
  userGrowth: {
    period: string;
    workers: number;
    hirers: number;
    total: number;
  }[];
  jobMetrics: {
    period: string;
    posted: number;
    completed: number;
    cancelled: number;
    averageBudget: number;
  }[];
  revenueMetrics: {
    period: string;
    revenue: number;
    platformFees: number;
    workerPayouts: number;
  }[];
  categoryDistribution: {
    category: string;
    jobs: number;
    applications: number;
    averageBudget: number;
  }[];
  locationDistribution: {
    location: string;
    jobs: number;
    workers: number;
    hirers: number;
  }[];
}

export interface PendingApproval {
  id: string;
  type: 'worker_verification' | 'job_approval' | 'payment_release' | 'dispute_resolution';
  userId?: string;
  userName?: string;
  jobId?: string;
  jobTitle?: string;
  description: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
}

export class AdminService {
  // Mock data for development
  private static mockUsers: UserManagement[] = [
    {
      id: 'user1',
      name: 'Mike Worker',
      email: 'mike@example.com',
      role: 'worker',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-08-15T10:30:00Z',
      totalJobs: 156,
      rating: 4.7,
      verificationStatus: 'verified',
    },
    {
      id: 'user2',
      name: 'Lisa Plumber',
      email: 'lisa@example.com',
      role: 'worker',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '2024-08-15T09:15:00Z',
      totalJobs: 89,
      rating: 4.5,
      verificationStatus: 'verified',
    },
    {
      id: 'hirer1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'hirer',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-08-15T11:45:00Z',
      totalJobs: 12,
      rating: 4.2,
      verificationStatus: 'verified',
    },
    {
      id: 'hirer2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'hirer',
      status: 'pending',
      joinDate: '2024-08-14',
      lastActive: '2024-08-14T16:20:00Z',
      totalJobs: 0,
      verificationStatus: 'pending',
    },
  ];

  private static mockJobs: JobManagement[] = [
    {
      id: '1',
      title: 'Emergency Electrical Repair',
      hirerName: 'John Smith',
      hirerId: 'hirer1',
      category: 'electrical',
      status: 'open',
      postedDate: '2024-08-15T08:00:00Z',
      budget: 150,
      applications: 3,
      views: 25,
      urgency: 'high',
    },
    {
      id: '2',
      title: 'Plumbing Repair - Leaky Faucet',
      hirerName: 'Sarah Johnson',
      hirerId: 'hirer2',
      category: 'plumbing',
      status: 'in_progress',
      postedDate: '2024-08-14T14:30:00Z',
      budget: 80,
      applications: 5,
      views: 18,
      urgency: 'medium',
    },
    {
      id: '3',
      title: 'HVAC System Installation',
      hirerName: 'John Smith',
      hirerId: 'hirer1',
      category: 'hvac',
      status: 'completed',
      postedDate: '2024-08-10T10:00:00Z',
      budget: 5000,
      applications: 8,
      views: 45,
      urgency: 'low',
    },
  ];

  private static mockApplications: ApplicationManagement[] = [
    {
      id: 'app1',
      jobTitle: 'Emergency Electrical Repair',
      workerName: 'Mike Worker',
      hirerName: 'John Smith',
      status: 'selected',
      appliedDate: '2024-08-15T09:30:00Z',
      budget: 150,
      workerRating: 4.7,
      hirerRating: 4.2,
    },
    {
      id: 'app2',
      jobTitle: 'Plumbing Repair - Leaky Faucet',
      workerName: 'Lisa Plumber',
      hirerName: 'Sarah Johnson',
      status: 'confirmed',
      appliedDate: '2024-08-14T15:45:00Z',
      budget: 80,
      workerRating: 4.5,
    },
  ];

  private static mockPendingApprovals: PendingApproval[] = [
    {
      id: 'approval1',
      type: 'worker_verification',
      userId: 'user3',
      userName: 'David HVAC',
      description: 'Worker verification documents submitted',
      submittedDate: '2024-08-15T12:00:00Z',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 'approval2',
      type: 'job_approval',
      jobId: '4',
      jobTitle: 'Commercial HVAC Installation',
      description: 'New job posting requires approval',
      submittedDate: '2024-08-15T11:30:00Z',
      priority: 'low',
      status: 'pending',
    },
    {
      id: 'approval3',
      type: 'payment_release',
      userId: 'user1',
      userName: 'Mike Worker',
      jobId: '3',
      jobTitle: 'HVAC System Installation',
      description: 'Payment release request for completed job',
      submittedDate: '2024-08-15T10:15:00Z',
      priority: 'high',
      status: 'pending',
    },
  ];

  // Get admin dashboard statistics
  static async getAdminStats(): Promise<AdminStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalUsers = this.mockUsers.length;
    const totalJobs = this.mockJobs.length;
    const totalApplications = this.mockApplications.length;
    const activeWorkers = this.mockUsers.filter(u => u.role === 'worker' && u.status === 'active').length;
    const activeHirers = this.mockUsers.filter(u => u.role === 'hirer' && u.status === 'active').length;
    const pendingApprovals = this.mockPendingApprovals.filter(a => a.status === 'pending').length;
    
    // Calculate total revenue (simplified)
    const totalRevenue = this.mockApplications
      .filter(app => app.status === 'confirmed')
      .reduce((sum, app) => sum + app.budget, 0);

    const recentActivity: AdminActivity[] = [
      {
        id: 'activity1',
        type: 'user_registration',
        userId: 'hirer2',
        userName: 'Sarah Johnson',
        description: 'New hirer registered',
        timestamp: '2024-08-15T12:30:00Z',
        severity: 'low',
      },
      {
        id: 'activity2',
        type: 'job_posted',
        userId: 'hirer1',
        userName: 'John Smith',
        description: 'New job posted: Emergency Electrical Repair',
        timestamp: '2024-08-15T08:00:00Z',
        severity: 'medium',
      },
      {
        id: 'activity3',
        type: 'application_submitted',
        userId: 'user1',
        userName: 'Mike Worker',
        description: 'Application submitted for Emergency Electrical Repair',
        timestamp: '2024-08-15T09:30:00Z',
        severity: 'low',
      },
      {
        id: 'activity4',
        type: 'payment_processed',
        userId: 'user1',
        userName: 'Mike Worker',
        description: 'Payment processed for HVAC System Installation',
        timestamp: '2024-08-15T10:15:00Z',
        severity: 'high',
      },
    ];

    return {
      totalUsers,
      totalJobs,
      totalApplications,
      totalRevenue,
      activeWorkers,
      activeHirers,
      pendingApprovals,
      recentActivity,
    };
  }

  // Get user management data
  static async getUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: UserManagement[]; total: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let users = [...this.mockUsers];

    // Apply filters
    if (filters?.role) {
      users = users.filter(user => user.role === filters.role);
    }
    if (filters?.status) {
      users = users.filter(user => user.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    const total = users.length;
    
    // Apply pagination
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      users = users.slice(start, end);
    }

    return { users, total };
  }

  // Get job management data
  static async getJobs(filters?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: JobManagement[]; total: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let jobs = [...this.mockJobs];

    // Apply filters
    if (filters?.status) {
      jobs = jobs.filter(job => job.status === filters.status);
    }
    if (filters?.category) {
      jobs = jobs.filter(job => job.category === filters.category);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(search) ||
        job.hirerName.toLowerCase().includes(search)
      );
    }

    const total = jobs.length;
    
    // Apply pagination
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      jobs = jobs.slice(start, end);
    }

    return { jobs, total };
  }

  // Get application management data
  static async getApplications(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: ApplicationManagement[]; total: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let applications = [...this.mockApplications];

    // Apply filters
    if (filters?.status) {
      applications = applications.filter(app => app.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      applications = applications.filter(app => 
        app.jobTitle.toLowerCase().includes(search) ||
        app.workerName.toLowerCase().includes(search) ||
        app.hirerName.toLowerCase().includes(search)
      );
    }

    const total = applications.length;
    
    // Apply pagination
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      applications = applications.slice(start, end);
    }

    return { applications, total };
  }

  // Get pending approvals
  static async getPendingApprovals(): Promise<PendingApproval[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.mockPendingApprovals.filter(approval => approval.status === 'pending');
  }

  // Approve or reject a pending approval
  static async updateApproval(approvalId: string, action: 'approve' | 'reject', notes?: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const approval = this.mockPendingApprovals.find(a => a.id === approvalId);
    if (approval) {
      approval.status = action === 'approve' ? 'approved' : 'rejected';
    }
    
    console.log(`Approval ${approvalId} ${action}d${notes ? ` with notes: ${notes}` : ''}`);
  }

  // Update user status
  static async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned', reason?: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = this.mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
    
    console.log(`User ${userId} status updated to ${status}${reason ? ` with reason: ${reason}` : ''}`);
  }

  // Get analytics data
  static async getAnalytics(): Promise<AnalyticsData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      userGrowth: [
        { period: 'Jan 2024', workers: 45, hirers: 23, total: 68 },
        { period: 'Feb 2024', workers: 67, hirers: 34, total: 101 },
        { period: 'Mar 2024', workers: 89, hirers: 45, total: 134 },
        { period: 'Apr 2024', workers: 112, hirers: 56, total: 168 },
        { period: 'May 2024', workers: 134, hirers: 67, total: 201 },
        { period: 'Jun 2024', workers: 156, hirers: 78, total: 234 },
        { period: 'Jul 2024', workers: 178, hirers: 89, total: 267 },
        { period: 'Aug 2024', workers: 201, hirers: 101, total: 302 },
      ],
      jobMetrics: [
        { period: 'Jan 2024', posted: 23, completed: 18, cancelled: 2, averageBudget: 245 },
        { period: 'Feb 2024', posted: 34, completed: 28, cancelled: 3, averageBudget: 267 },
        { period: 'Mar 2024', posted: 45, completed: 38, cancelled: 4, averageBudget: 289 },
        { period: 'Apr 2024', posted: 56, completed: 48, cancelled: 5, averageBudget: 312 },
        { period: 'May 2024', posted: 67, completed: 58, cancelled: 6, averageBudget: 334 },
        { period: 'Jun 2024', posted: 78, completed: 68, cancelled: 7, averageBudget: 356 },
        { period: 'Jul 2024', posted: 89, completed: 78, cancelled: 8, averageBudget: 378 },
        { period: 'Aug 2024', posted: 101, completed: 88, cancelled: 9, averageBudget: 401 },
      ],
      revenueMetrics: [
        { period: 'Jan 2024', revenue: 4500, platformFees: 450, workerPayouts: 4050 },
        { period: 'Feb 2024', revenue: 5200, platformFees: 520, workerPayouts: 4680 },
        { period: 'Mar 2024', revenue: 5900, platformFees: 590, workerPayouts: 5310 },
        { period: 'Apr 2024', revenue: 6600, platformFees: 660, workerPayouts: 5940 },
        { period: 'May 2024', revenue: 7300, platformFees: 730, workerPayouts: 6570 },
        { period: 'Jun 2024', revenue: 8000, platformFees: 800, workerPayouts: 7200 },
        { period: 'Jul 2024', revenue: 8700, platformFees: 870, workerPayouts: 7830 },
        { period: 'Aug 2024', revenue: 9400, platformFees: 940, workerPayouts: 8460 },
      ],
      categoryDistribution: [
        { category: 'electrical', jobs: 45, applications: 180, averageBudget: 320 },
        { category: 'plumbing', jobs: 38, applications: 152, averageBudget: 280 },
        { category: 'hvac', jobs: 32, applications: 128, averageBudget: 450 },
        { category: 'carpentry', jobs: 28, applications: 112, averageBudget: 380 },
        { category: 'painting', jobs: 25, applications: 100, averageBudget: 250 },
        { category: 'landscaping', jobs: 22, applications: 88, averageBudget: 200 },
        { category: 'cleaning', jobs: 19, applications: 76, averageBudget: 150 },
      ],
      locationDistribution: [
        { location: 'Brooklyn, NY', jobs: 35, workers: 45, hirers: 28 },
        { location: 'Manhattan, NY', jobs: 42, workers: 38, hirers: 35 },
        { location: 'Queens, NY', jobs: 28, workers: 32, hirers: 22 },
        { location: 'Bronx, NY', jobs: 18, workers: 25, hirers: 15 },
        { location: 'Staten Island, NY', jobs: 12, workers: 18, hirers: 10 },
      ],
    };
  }

  // Get revenue data
  static async getRevenueData(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<RevenueData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const mockData: RevenueData[] = [
      {
        period: 'Aug 2024',
        revenue: 9400,
        transactions: 47,
        averageTransaction: 200,
        platformFees: 940,
        workerPayouts: 8460,
      },
      {
        period: 'Jul 2024',
        revenue: 8700,
        transactions: 43,
        averageTransaction: 202,
        platformFees: 870,
        workerPayouts: 7830,
      },
      {
        period: 'Jun 2024',
        revenue: 8000,
        transactions: 40,
        averageTransaction: 200,
        platformFees: 800,
        workerPayouts: 7200,
      },
    ];

    return mockData;
  }
}
