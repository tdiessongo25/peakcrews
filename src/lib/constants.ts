
import type { Trade, Job, UserRole, WorkerProfileInfo, HirerProfileInfo, Review, Notification, JobApplication, JobAdGeneratorInput } from './types';

export const TRADES_LIST: Trade[] = ["Electrician", "Carpenter", "Painter", "Concrete Laborer", "General Laborer", "Plumber"];

export const JOB_TYPES_FOR_AI: JobAdGeneratorInput["jobType"][] = ["Urgent (ASAP)", "Short-term project", "Full-time temporary"];


export const MOCK_USER_ID = "user-123";
export const MOCK_WORKER_ID = "worker-abc";
export const MOCK_HIRER_ID = "hirer-xyz";

export const MOCK_WORKER_PROFILE: WorkerProfileInfo = {
  trade: "Electrician",
  experience: "10+ years",
  certifications: [
    { name: "Master Electrician License", verified: true },
    { name: "OSHA 30-Hour Certification", verified: false }
  ],
  availability: true,
  location: "New York, NY",
  bio: "Highly skilled and certified electrician with extensive experience in residential and commercial projects. Committed to safety and quality workmanship."
};

export const MOCK_HIRER_PROFILE: HirerProfileInfo = {
  companyName: "BuildIt Right Inc.",
  companyInfo: "A leading construction company specializing in innovative building solutions.",
  contactNumber: "555-123-4567"
};


export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    hirerId: MOCK_HIRER_ID,
    hirerName: "BuildIt Right Inc.",
    hirerProfileImage: "https://placehold.co/100x100.png",
    trade: "Electrician",
    title: "Urgent: Outlet Repair Needed",
    description: "Need a certified electrician to repair several faulty outlets in a residential property. Must have own tools.",
    location: "Brooklyn, NY",
    address: "123 Main St, Brooklyn, NY 11201",
    jobType: "Urgent (ASAP)",
    duration: "2-3 hours",
    rate: 75, // Assuming per hour for now, can be flat
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: "open",
    applicants: [MOCK_WORKER_ID],
  },
  {
    id: "job-2",
    hirerId: "hirer-789",
    hirerName: "Home Renovators LLC",
    trade: "Carpenter",
    title: "Deck Construction Project",
    description: "Looking for an experienced carpenter to build a new wooden deck. Materials will be provided on-site.",
    location: "Queens, NY",
    address: "456 Oak Ave, Queens, NY 11354",
    jobType: "Short-term project",
    scheduledDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    duration: "3 days",
    rate: 600, // Flat rate
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "open",
  },
  {
    id: "job-3",
    hirerId: MOCK_HIRER_ID,
    hirerName: "BuildIt Right Inc.",
    trade: "Painter",
    title: "Interior Painting for Apartment",
    description: "Need a skilled painter for a 2-bedroom apartment. Precision and clean work is a must. Paint will be supplied.",
    location: "Manhattan, NY",
    address: "789 Pine Rd, Manhattan, NY 10001",
    jobType: "Scheduled",
    scheduledDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week from now
    duration: "2 days",
    rate: 450, // Flat rate
    postedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    status: "open",
  }
];

export const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Urgent: Outlet Repair Needed",
    workerId: MOCK_WORKER_ID,
    workerName: "John Doe (Worker)",
    status: "applied",
    appliedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "app-2",
    jobId: "job-3",
    jobTitle: "Interior Painting for Apartment",
    workerId: MOCK_WORKER_ID,
    workerName: "John Doe (Worker)",
    status: "confirmed",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  }
];

export const MOCK_MY_POSTED_JOBS: Job[] = MOCK_JOBS.filter(job => job.hirerId === MOCK_HIRER_ID);


export const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    jobId: "job-completed-1",
    reviewerId: MOCK_HIRER_ID,
    revieweeId: MOCK_WORKER_ID,
    reviewerRole: "hirer",
    rating: 5,
    comment: "Excellent work, very professional and efficient. Highly recommend!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "review-2",
    jobId: "job-completed-1",
    reviewerId: MOCK_WORKER_ID,
    revieweeId: MOCK_HIRER_ID,
    reviewerRole: "worker",
    rating: 4,
    comment: "Clear instructions and prompt payment. Good experience overall.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    userId: MOCK_WORKER_ID,
    message: "Your application for 'Urgent: Outlet Repair Needed' has been viewed by BuildIt Right Inc.",
    link: "/applications",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "notif-2",
    userId: MOCK_HIRER_ID,
    message: "You have a new applicant for 'Interior Painting for Apartment'.",
    link: "/my-jobs/job-3/applicants",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "notif-3",
    userId: MOCK_WORKER_ID,
    message: "Reminder: Job 'Interior Painting for Apartment' starts tomorrow!",
    link: "/applications",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  }
];
