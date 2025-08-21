
export type Trade = "Electrician" | "Carpenter" | "Painter" | "Concrete Laborer" | "General Laborer" | "Plumber";

export type UserRole = "worker" | "hirer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
}

export interface HirerProfileInfo {
  companyName: string;
  companyInfo?: string;
  contactNumber?: string;
}

export interface Job {
  id: string;
  hirerId: string;
  hirerName: string;
  hirerProfileImage?: string;
  trade: Trade;
  title: string;
  description: string;
  location: string; 
  address: string;
  jobType: "ASAP" | "Scheduled" | "Urgent" | "Short-term project" | "Full-time temporary"; // Added from AI spec
  scheduledDateTime?: string; 
  duration: string; 
  rate: number; 
  postedAt: string; 
  status: "open" | "in-progress" | "completed" | "cancelled";
  applicants?: string[]; 
  selectedWorkerId?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string; // denormalized
  workerId: string;
  workerName: string; // denormalized
  status: "applied" | "selected" | "confirmed" | "rejected" | "cancelled_by_worker" | "cancelled_by_hirer";
  appliedAt: string;
  coverLetter?: string;
  proposedRate?: number;
  message?: string; // For hirer feedback
  resumeUrl?: string; // URL to uploaded resume
}

export interface WorkerProfileInfo {
  userId: string;
  trade: Trade;
  skills: string[];
  experience: string;
  certifications: string[];
  availability: boolean;
  location?: string;
  bio?: string;
  hourlyRate: number;
  resumeUrl?: string; // URL to uploaded resume
  profileStatus: "pending" | "approved" | "rejected"; // For profile approval
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string; 
  revieweeId: string; 
  reviewerRole: UserRole;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  comment: string;
  category: 'communication' | 'quality' | 'timeliness' | 'professionalism' | 'overall';
  isPublic: boolean;
  createdAt: string; 
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "profile_approved" | "profile_rejected" | "application_received" | "application_status" | "message" | "reminder" | "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string; // URL to navigate to when action is clicked
}

// For AI Job Ad Generator
export interface JobAdGeneratorInput {
  trade: string;
  location: string;
  jobType: string;
}

export interface JobAdGeneratorOutput {
  jobAdText: string;
}
