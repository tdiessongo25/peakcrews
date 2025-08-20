"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionManager, LoginSecurity, PasswordSecurity, ActivityMonitor } from '@/lib/auth-security';
import { sanitizeEmail, sanitizeString } from '@/lib/security';

// User types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'hirer' | 'admin';
  profileImageUrl?: string;
  lastPasswordChange?: Date;
  mfaEnabled?: boolean;
  lastLogin?: Date;
  ipAddress?: string;
}

interface WorkerProfile {
  id: string;
  userId: string;
  trade: string;
  experience: number;
  hourlyRate: number;
  availability: string[];
  skills: string[];
  certifications: string[];
  bio: string;
  location: string;
  phone: string;
  rating: number;
  completedJobs: number;
}

interface HirerProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  phone: string;
  website?: string;
  description: string;
  rating: number;
  completedProjects: number;
}

interface UserContextType {
  currentUser: User | null;
  workerProfile: WorkerProfile | null;
  hirerProfile: HirerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: 'worker' | 'hirer' | 'admin' | null;
  login: (role: 'worker' | 'hirer' | 'admin') => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateWorkerProfile: (updates: Partial<WorkerProfile>) => void;
  updateHirerProfile: (updates: Partial<HirerProfile>) => void;
  // Security methods
  secureLogin: (email: string, password: string, role: 'worker' | 'hirer' | 'admin', ipAddress: string, userAgent: string) => Promise<{ success: boolean; message: string; sessionId?: string }>;
  secureLogout: () => void;
  isAccountLocked: (identifier: string) => boolean;
  getRemainingAttempts: (identifier: string) => number;
  getRemainingLockoutTime: (identifier: string) => number;
  validatePassword: (password: string) => { isValid: boolean; feedback: string[] };
  recordActivity: (activity: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [hirerProfile, setHirerProfile] = useState<HirerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize user state
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check for existing session
        const storedSessionId = localStorage.getItem('peakcrews_session_id');
        if (storedSessionId) {
          const session = SessionManager.getSession(storedSessionId);
          if (session) {
            setSessionId(storedSessionId);
            // In a real app, you'd fetch user data from the backend
            // For now, we'll simulate this
            await simulateUserFetch(session.userId, session.role);
          } else {
            // Invalid session, clear it
            localStorage.removeItem('peakcrews_session_id');
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Activity monitoring
  useEffect(() => {
    if (currentUser) {
      const recordUserActivity = () => {
        ActivityMonitor.recordActivity(
          currentUser.id,
          'page_view',
          '127.0.0.1', // In production, get from request
          navigator.userAgent
        );
      };

      // Record activity on page load
      recordUserActivity();

      // Record activity on user interaction
      const handleUserActivity = () => {
        ActivityMonitor.recordActivity(
          currentUser.id,
          'user_interaction',
          '127.0.0.1',
          navigator.userAgent
        );
      };

      window.addEventListener('click', handleUserActivity);
      window.addEventListener('keypress', handleUserActivity);

      return () => {
        window.removeEventListener('click', handleUserActivity);
        window.removeEventListener('keypress', handleUserActivity);
      };
    }
  }, [currentUser]);

  // Simulate user data fetch (replace with actual API call)
  const simulateUserFetch = async (userId: string, role: 'worker' | 'hirer' | 'admin') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    if (role === 'admin') {
      setCurrentUser({ 
        id: 'admin-1', 
        name: 'Admin User', 
        email: 'admin@peakcrews.com', 
        role: 'admin', 
        profileImageUrl: 'https://placehold.co/100x100.png',
        lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        lastLogin: new Date()
      });
      setWorkerProfile(null);
      setHirerProfile(null);
    } else if (role === 'worker') {
      setCurrentUser({ 
        id: 'worker-1', 
        name: 'John Worker', 
        email: 'john@example.com', 
        role: 'worker',
        lastPasswordChange: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        lastLogin: new Date()
      });
      setWorkerProfile({
        id: 'wp-1',
        userId: 'worker-1',
        trade: 'Electrician',
        experience: 5,
        hourlyRate: 45,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        skills: ['Electrical Installation', 'Troubleshooting', 'Safety Compliance'],
        certifications: ['Licensed Electrician', 'OSHA Safety'],
        bio: 'Experienced electrician with 5 years in commercial and residential work.',
        location: 'Denver, CO',
        phone: '+1-555-0123',
        rating: 4.8,
        completedJobs: 127
      });
      setHirerProfile(null);
    } else if (role === 'hirer') {
      setCurrentUser({ 
        id: 'hirer-1', 
        name: 'Jane Contractor', 
        email: 'jane@example.com', 
        role: 'hirer',
        lastPasswordChange: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastLogin: new Date()
      });
      setHirerProfile({
        id: 'hp-1',
        userId: 'hirer-1',
        companyName: 'Denver Construction Co.',
        industry: 'Construction',
        companySize: '10-50 employees',
        location: 'Denver, CO',
        phone: '+1-555-0456',
        website: 'https://denverconstruction.com',
        description: 'Leading construction company specializing in commercial and residential projects.',
        rating: 4.9,
        completedProjects: 89
      });
      setWorkerProfile(null);
    }
  };

  const login = (newRole: 'worker' | 'hirer' | 'admin') => {
    if (newRole === 'worker') {
      setCurrentUser({ id: 'worker-1', name: 'John Worker', email: 'john@example.com', role: 'worker', lastPasswordChange: new Date(), lastLogin: new Date() });
      setWorkerProfile({
        id: 'wp-1',
        userId: 'worker-1',
        trade: 'Electrician',
        experience: 5,
        hourlyRate: 45,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        skills: ['Electrical Installation', 'Troubleshooting', 'Safety Compliance'],
        certifications: ['Licensed Electrician', 'OSHA Safety'],
        bio: 'Experienced electrician with 5 years in commercial and residential work.',
        location: 'Denver, CO',
        phone: '+1-555-0123',
        rating: 4.8,
        completedJobs: 127
      });
      setHirerProfile(null);
    } else if (newRole === 'hirer') {
      setCurrentUser({ id: 'hirer-1', name: 'Jane Contractor', email: 'jane@example.com', role: 'hirer', lastPasswordChange: new Date(), lastLogin: new Date() });
      setHirerProfile({
        id: 'hp-1',
        userId: 'hirer-1',
        companyName: 'Denver Construction Co.',
        industry: 'Construction',
        companySize: '10-50 employees',
        location: 'Denver, CO',
        phone: '+1-555-0456',
        website: 'https://denverconstruction.com',
        description: 'Leading construction company specializing in commercial and residential projects.',
        rating: 4.9,
        completedProjects: 89
      });
      setWorkerProfile(null);
    } else if (newRole === 'admin') {
      setCurrentUser({ id: 'admin-1', name: 'Admin User', email: 'admin@peakcrews.com', role: 'admin', profileImageUrl: 'https://placehold.co/100x100.png', lastPasswordChange: new Date(), lastLogin: new Date() });
      setWorkerProfile(null);
      setHirerProfile(null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setWorkerProfile(null);
    setHirerProfile(null);
    setSessionId(null);
    localStorage.removeItem('peakcrews_session_id');
  };

  // Enhanced security methods
  const secureLogin = async (
    email: string, 
    password: string, 
    role: 'worker' | 'hirer' | 'admin', 
    ipAddress: string, 
    userAgent: string
  ): Promise<{ success: boolean; message: string; sessionId?: string }> => {
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedPassword = sanitizeString(password);

      // Check if account is locked
      if (LoginSecurity.isAccountLocked(sanitizedEmail)) {
        const remainingTime = LoginSecurity.getRemainingLockoutTime(sanitizedEmail);
        return {
          success: false,
          message: `Account is temporarily locked. Please try again in ${Math.ceil(remainingTime / 60000)} minutes.`
        };
      }

      // Validate password strength
      const passwordValidation = PasswordSecurity.validatePasswordStrength(sanitizedPassword);
      if (!passwordValidation.isValid) {
        LoginSecurity.recordLoginAttempt(sanitizedEmail, ipAddress, false);
        return {
          success: false,
          message: `Password validation failed: ${passwordValidation.feedback.join(', ')}`
        };
      }

      // Simulate authentication (replace with actual API call)
      const isValidCredentials = await simulateAuthentication(sanitizedEmail, sanitizedPassword, role);
      
      if (isValidCredentials) {
        // Create secure session
        const newSessionId = SessionManager.createSession(
          `user-${Date.now()}`, // In production, use actual user ID
          role,
          ipAddress,
          userAgent
        );

        // Record successful login
        LoginSecurity.recordLoginAttempt(sanitizedEmail, ipAddress, true);
        
        // Store session ID
        setSessionId(newSessionId);
        localStorage.setItem('peakcrews_session_id', newSessionId);

        // Login user
        login(role);

        return {
          success: true,
          message: 'Login successful',
          sessionId: newSessionId
        };
      } else {
        // Record failed login attempt
        LoginSecurity.recordLoginAttempt(sanitizedEmail, ipAddress, false);
        
        const remainingAttempts = LoginSecurity.getRemainingAttempts(sanitizedEmail);
        
        return {
          success: false,
          message: `Invalid credentials. ${remainingAttempts} attempts remaining.`
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.'
      };
    }
  };

  const secureLogout = () => {
    if (sessionId) {
      SessionManager.invalidateSession(sessionId);
    }
    logout();
  };

  const isAccountLocked = (identifier: string): boolean => {
    return LoginSecurity.isAccountLocked(identifier);
  };

  const getRemainingAttempts = (identifier: string): number => {
    return LoginSecurity.getRemainingAttempts(identifier);
  };

  const getRemainingLockoutTime = (identifier: string): number => {
    return LoginSecurity.getRemainingLockoutTime(identifier);
  };

  const validatePassword = (password: string): { isValid: boolean; feedback: string[] } => {
    return PasswordSecurity.validatePasswordStrength(password);
  };

  const recordActivity = (activity: string) => {
    if (currentUser) {
      ActivityMonitor.recordActivity(
        currentUser.id,
        activity,
        '127.0.0.1', // In production, get from request
        navigator.userAgent
      );
    }
  };

  // Simulate authentication (replace with actual API call)
  const simulateAuthentication = async (email: string, password: string, role: 'worker' | 'hirer' | 'admin'): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple validation for demo purposes
    const validCredentials = {
      'john@example.com': { password: 'Password123!', role: 'worker' },
      'jane@example.com': { password: 'Password123!', role: 'hirer' },
      'admin@peakcrews.com': { password: 'Admin123!', role: 'admin' }
    };

    const userCreds = validCredentials[email as keyof typeof validCredentials];
    return userCreds && userCreds.password === password && userCreds.role === role;
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const updateWorkerProfile = (updates: Partial<WorkerProfile>) => {
    if (workerProfile) {
      setWorkerProfile({ ...workerProfile, ...updates });
    }
  };

  const updateHirerProfile = (updates: Partial<HirerProfile>) => {
    if (hirerProfile) {
      setHirerProfile({ ...hirerProfile, ...updates });
    }
  };

  const value: UserContextType = {
    currentUser,
    workerProfile,
    hirerProfile,
    isLoading,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    login,
    logout,
    updateUser,
    updateWorkerProfile,
    updateHirerProfile,
    secureLogin,
    secureLogout,
    isAccountLocked,
    getRemainingAttempts,
    getRemainingLockoutTime,
    validatePassword,
    recordActivity
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
