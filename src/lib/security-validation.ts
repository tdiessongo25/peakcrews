import { z } from 'zod';
import { sanitizeString, sanitizeEmail, sanitizePhone } from './security';

// Comprehensive validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address').transform(sanitizeEmail),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, 'Password must contain at least one special character'),
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(sanitizeString),
  role: z.enum(['worker', 'hirer', 'admin']),
  phone: z.string().optional().transform(val => val ? sanitizePhone(val) : undefined),
  csrfToken: z.string().min(1, 'CSRF token is required')
});

export const jobPostingSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .transform(sanitizeString),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform(sanitizeString),
  trade: z.string()
    .min(2, 'Trade must be at least 2 characters')
    .max(50, 'Trade must be less than 50 characters')
    .transform(sanitizeString),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .transform(sanitizeString),
  budgetMin: z.number().min(0, 'Minimum budget must be positive').optional(),
  budgetMax: z.number().min(0, 'Maximum budget must be positive').optional(),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  csrfToken: z.string().min(1, 'CSRF token is required')
}).refine(data => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

export const workerProfileSchema = z.object({
  trade: z.string()
    .min(2, 'Trade must be at least 2 characters')
    .max(50, 'Trade must be less than 50 characters')
    .transform(sanitizeString),
  skills: z.array(z.string().transform(sanitizeString)).max(20, 'Maximum 20 skills allowed'),
  experience: z.string()
    .min(5, 'Experience description must be at least 5 characters')
    .max(500, 'Experience description must be less than 500 characters')
    .transform(sanitizeString),
  certifications: z.array(z.string().transform(sanitizeString)).max(10, 'Maximum 10 certifications allowed'),
  availability: z.boolean(),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .transform(sanitizeString),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(1000, 'Bio must be less than 1000 characters')
    .transform(sanitizeString),
  hourlyRate: z.number().min(5, 'Hourly rate must be at least $5').max(500, 'Hourly rate must be less than $500'),
  csrfToken: z.string().min(1, 'CSRF token is required')
});

export const applicationSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  proposal: z.string()
    .min(20, 'Proposal must be at least 20 characters')
    .max(2000, 'Proposal must be less than 2000 characters')
    .transform(sanitizeString),
  bidAmount: z.number().min(1, 'Bid amount must be positive').optional(),
  csrfToken: z.string().min(1, 'CSRF token is required')
});

export const reviewSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  revieweeId: z.string().uuid('Invalid user ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string()
    .min(10, 'Review comment must be at least 10 characters')
    .max(1000, 'Review comment must be less than 1000 characters')
    .transform(sanitizeString),
  category: z.enum(['communication', 'quality', 'timeliness', 'professionalism', 'overall']),
  csrfToken: z.string().min(1, 'CSRF token is required')
});

// Security validation functions
export class SecurityValidator {
  static validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }

  static validateCSRF(token: string, storedToken: string): boolean {
    if (!token || !storedToken) return false;
    return token === storedToken && token.length >= 32;
  }

  static validateFileUpload(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed' };
    }
    
    return { valid: true };
  }

  static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizeString(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password: string): { valid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password should contain at least one uppercase letter');

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password should contain at least one lowercase letter');

    // Number check
    if (/\d/.test(password)) score += 1;
    else feedback.push('Password should contain at least one number');

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Password should contain at least one special character');

    // Common password check
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.includes(password.toLowerCase())) {
      score = 0;
      feedback.push('Password is too common');
    }

    return {
      valid: score >= 4,
      score,
      feedback
    };
  }
}

// Rate limiting for API endpoints
export class APIRateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>();
  private static readonly WINDOW_MS = 60 * 1000; // 1 minute
  private static readonly MAX_REQUESTS = 100; // 100 requests per minute

  static isAllowed(identifier: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(identifier);

    if (!limit || now > limit.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS
      });
      return true;
    }

    if (limit.count >= this.MAX_REQUESTS) {
      return false;
    }

    limit.count++;
    return true;
  }

  static getRemaining(identifier: string): number {
    const limit = this.limits.get(identifier);
    if (!limit) return this.MAX_REQUESTS;
    return Math.max(0, this.MAX_REQUESTS - limit.count);
  }

  static reset(identifier: string): void {
    this.limits.delete(identifier);
  }
}
