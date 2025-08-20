import { generateSecureToken, logSecurityEvent } from './security';

// Session management
export interface SessionData {
  id: string;
  userId: string;
  role: 'worker' | 'hirer' | 'admin';
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  loginAttempts: number;
  lockedUntil?: Date;
}

// In-memory session store (use Redis in production)
const sessions = new Map<string, SessionData>();
const loginAttempts = new Map<string, { count: number; lastAttempt: Date; lockedUntil?: Date }>();

// Security configuration
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  PASSWORD_HISTORY_SIZE: 5,
  REQUIRE_PASSWORD_CHANGE_DAYS: 90,
  SUSPICIOUS_ACTIVITY_THRESHOLD: 3
};

// Session management
export class SessionManager {
  static createSession(userId: string, role: 'worker' | 'hirer' | 'admin', ipAddress: string, userAgent: string): string {
    const sessionId = generateSecureToken(32);
    const now = new Date();
    
    const session: SessionData = {
      id: sessionId,
      userId,
      role,
      ipAddress,
      userAgent,
      createdAt: now,
      lastActivity: now,
      isActive: true,
      loginAttempts: 0
    };
    
    sessions.set(sessionId, session);
    logSecurityEvent('session_created', { userId, role, ipAddress, sessionId });
    
    return sessionId;
  }

  static getSession(sessionId: string): SessionData | null {
    const session = sessions.get(sessionId);
    if (!session || !session.isActive) return null;
    
    // Check session timeout
    const now = new Date();
    if (now.getTime() - session.lastActivity.getTime() > SECURITY_CONFIG.SESSION_TIMEOUT) {
      this.invalidateSession(sessionId);
      return null;
    }
    
    // Update last activity
    session.lastActivity = now;
    sessions.set(sessionId, session);
    
    return session;
  }

  static invalidateSession(sessionId: string): void {
    const session = sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      sessions.set(sessionId, session);
      logSecurityEvent('session_invalidated', { sessionId, userId: session.userId });
    }
  }

  static invalidateAllUserSessions(userId: string): void {
    for (const [sessionId, session] of sessions.entries()) {
      if (session.userId === userId && session.isActive) {
        this.invalidateSession(sessionId);
      }
    }
    logSecurityEvent('all_sessions_invalidated', { userId });
  }

  static cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > SECURITY_CONFIG.SESSION_TIMEOUT) {
        sessions.delete(sessionId);
      }
    }
  }
}

// Login attempt tracking and brute force protection
export class LoginSecurity {
  static recordLoginAttempt(identifier: string, ipAddress: string, success: boolean): boolean {
    const now = new Date();
    const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: now };
    
    if (success) {
      // Reset on successful login
      loginAttempts.delete(identifier);
      logSecurityEvent('login_success', { identifier, ipAddress });
      return true;
    }
    
    // Increment failed attempts
    attempts.count++;
    attempts.lastAttempt = now;
    
    // Check if account should be locked
    if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      attempts.lockedUntil = new Date(now.getTime() + SECURITY_CONFIG.LOCKOUT_DURATION);
      logSecurityEvent('account_locked', { identifier, ipAddress, attempts: attempts.count });
    }
    
    loginAttempts.set(identifier, attempts);
    logSecurityEvent('login_failed', { identifier, ipAddress, attempts: attempts.count });
    
    return attempts.count < SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
  }

  static isAccountLocked(identifier: string): boolean {
    const attempts = loginAttempts.get(identifier);
    if (!attempts || !attempts.lockedUntil) return false;
    
    const now = new Date();
    if (now > attempts.lockedUntil) {
      // Lockout period expired
      loginAttempts.delete(identifier);
      return false;
    }
    
    return true;
  }

  static getRemainingLockoutTime(identifier: string): number {
    const attempts = loginAttempts.get(identifier);
    if (!attempts || !attempts.lockedUntil) return 0;
    
    const now = new Date();
    const remaining = attempts.lockedUntil.getTime() - now.getTime();
    return Math.max(0, remaining);
  }

  static getRemainingAttempts(identifier: string): number {
    const attempts = loginAttempts.get(identifier);
    if (!attempts) return SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
    
    if (this.isAccountLocked(identifier)) return 0;
    
    return Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempts.count);
  }
}

// Password security and history
export class PasswordSecurity {
  private static passwordHistory = new Map<string, string[]>();

  static validatePasswordStrength(password: string): { isValid: boolean; feedback: string[] } {
    const feedback: string[] = [];
    let isValid = true;

    // Length check
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
      isValid = false;
    }

    // Complexity checks
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
      isValid = false;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
      isValid = false;
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain at least one number');
      isValid = false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain at least one special character');
      isValid = false;
    }

    // Common password check
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'letmein', 'welcome',
      'monkey', 'password123', 'admin123', 'root', 'toor', 'test'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      feedback.push('Password is too common and easily guessable');
      isValid = false;
    }

    return { isValid, feedback };
  }

  static checkPasswordHistory(userId: string, newPassword: string): boolean {
    const history = this.passwordHistory.get(userId) || [];
    return !history.includes(newPassword);
  }

  static addPasswordToHistory(userId: string, password: string): void {
    const history = this.passwordHistory.get(userId) || [];
    history.push(password);
    
    // Keep only the last N passwords
    if (history.length > SECURITY_CONFIG.PASSWORD_HISTORY_SIZE) {
      history.shift();
    }
    
    this.passwordHistory.set(userId, history);
  }

  static shouldRequirePasswordChange(lastPasswordChange: Date): boolean {
    const now = new Date();
    const daysSinceChange = (now.getTime() - lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceChange > SECURITY_CONFIG.REQUIRE_PASSWORD_CHANGE_DAYS;
  }
}

// Suspicious activity detection
export class ActivityMonitor {
  private static userActivity = new Map<string, { count: number; lastActivity: Date; suspiciousFlags: string[] }>();

  static recordActivity(userId: string, activity: string, ipAddress: string, userAgent: string): void {
    const now = new Date();
    const userData = this.userActivity.get(userId) || { count: 0, lastActivity: now, suspiciousFlags: [] };
    
    userData.count++;
    userData.lastActivity = now;
    
    // Check for suspicious patterns
    const suspiciousPatterns = this.detectSuspiciousActivity(activity, ipAddress, userAgent);
    userData.suspiciousFlags.push(...suspiciousPatterns);
    
    this.userActivity.set(userId, userData);
    
    // Log suspicious activity
    if (suspiciousPatterns.length > 0) {
      logSecurityEvent('suspicious_activity', {
        userId,
        activity,
        ipAddress,
        userAgent,
        patterns: suspiciousPatterns
      });
    }
  }

  private static detectSuspiciousActivity(activity: string, ipAddress: string, userAgent: string): string[] {
    const flags: string[] = [];
    
    // Check for rapid successive actions
    // Check for unusual IP patterns
    // Check for suspicious user agents
    // Check for unusual activity patterns
    
    return flags;
  }

  static isUserSuspicious(userId: string): boolean {
    const userData = this.userActivity.get(userId);
    if (!userData) return false;
    
    return userData.suspiciousFlags.length >= SECURITY_CONFIG.SUSPICIOUS_ACTIVITY_THRESHOLD;
  }

  static getSuspiciousFlags(userId: string): string[] {
    const userData = this.userActivity.get(userId);
    return userData?.suspiciousFlags || [];
  }
}

// Multi-factor authentication support
export class MFASecurity {
  static generateMFASecret(): string {
    return generateSecureToken(16);
  }

  static generateMFAToken(secret: string): string {
    // In production, use a proper TOTP library like 'speakeasy'
    return generateSecureToken(6);
  }

  static validateMFAToken(token: string, secret: string): boolean {
    // In production, implement proper TOTP validation
    return token.length === 6 && /^\d+$/.test(token);
  }
}

// Security utilities
export const AuthSecurityUtils = {
  // Clean up expired data periodically
  cleanup: () => {
    SessionManager.cleanupExpiredSessions();
    
    // Clean up old login attempts
    const now = new Date();
    for (const [identifier, attempts] of loginAttempts.entries()) {
      if (attempts.lockedUntil && now > attempts.lockedUntil) {
        loginAttempts.delete(identifier);
      }
    }
  },

  // Get security statistics
  getStats: () => {
    return {
      activeSessions: Array.from(sessions.values()).filter(s => s.isActive).length,
      lockedAccounts: Array.from(loginAttempts.values()).filter(a => a.lockedUntil && new Date() < a.lockedUntil).length,
      totalLoginAttempts: Array.from(loginAttempts.values()).reduce((sum, a) => sum + a.count, 0)
    };
  },

  // Force logout all users (emergency)
  emergencyLogout: () => {
    for (const [sessionId, session] of sessions.entries()) {
      if (session.isActive) {
        SessionManager.invalidateSession(sessionId);
      }
    }
    logSecurityEvent('emergency_logout', { reason: 'security_breach' });
  }
};
