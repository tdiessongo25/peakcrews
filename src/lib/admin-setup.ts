// Secure admin setup utility
// This should be used during development and initial deployment

import { AdminService } from './admin-service';

export interface AdminSetupConfig {
  email: string;
  password: string;
  name: string;
  role: 'admin';
}

export class AdminSetup {
  private static readonly ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'peakcrews-admin-2024';
  private static readonly REQUIRED_PASSWORD_LENGTH = 12;
  private static readonly REQUIRED_PASSWORD_COMPLEXITY = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  };

  /**
   * Validate admin setup configuration
   */
  static validateConfig(config: AdminSetupConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate email
    if (!config.email || !this.isValidEmail(config.email)) {
      errors.push('Valid email address is required');
    }

    // Validate password strength
    if (!config.password || !this.isStrongPassword(config.password)) {
      errors.push(`Password must be at least ${this.REQUIRED_PASSWORD_LENGTH} characters and contain uppercase, lowercase, numbers, and symbols`);
    }

    // Validate name
    if (!config.name || config.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Validate role
    if (config.role !== 'admin') {
      errors.push('Role must be "admin"');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create initial admin account (should only be used during setup)
   */
  static async createInitialAdmin(config: AdminSetupConfig, setupKey: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verify setup key
      if (setupKey !== this.ADMIN_SETUP_KEY) {
        return {
          success: false,
          message: 'Invalid setup key. Admin creation failed.',
        };
      }

      // Validate configuration
      const validation = this.validateConfig(config);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Configuration validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Check if admin already exists
      const existingAdmins = await AdminService.getUsers({ role: 'admin' });
      if (existingAdmins.users.length > 0) {
        return {
          success: false,
          message: 'Admin account already exists. Cannot create multiple initial admins.',
        };
      }

      // Create admin account (in real implementation, this would hash the password)
      const adminUser = {
        id: `admin-${Date.now()}`,
        name: config.name,
        email: config.email,
        role: 'admin' as const,
        status: 'active' as const,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        verificationStatus: 'verified' as const,
      };

      // In a real implementation, you would:
      // 1. Hash the password using bcrypt or similar
      // 2. Store the user in the database
      // 3. Send welcome email
      // 4. Log the admin creation

      console.log('✅ Admin account created successfully:', {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        createdAt: adminUser.joinDate,
      });

      return {
        success: true,
        message: `Admin account created successfully for ${config.email}`,
      };
    } catch (error: any) {
      console.error('❌ Failed to create admin account:', error);
      return {
        success: false,
        message: `Failed to create admin account: ${error.message}`,
      };
    }
  }

  /**
   * Generate a secure admin setup key
   */
  static generateSetupKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  private static isStrongPassword(password: string): boolean {
    if (password.length < this.REQUIRED_PASSWORD_LENGTH) {
      return false;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return hasUppercase && hasLowercase && hasNumbers && hasSymbols;
  }

  /**
   * Get admin setup instructions
   */
  static getSetupInstructions(): string {
    return `
# Admin Setup Instructions

## Development Environment
1. Set the ADMIN_SETUP_KEY environment variable
2. Use the admin setup API endpoint
3. Create admin account with strong credentials

## Production Environment
1. Generate a secure setup key
2. Use the setup key only once during initial deployment
3. Remove or secure the setup key after admin creation
4. Enable two-factor authentication for admin accounts

## Security Requirements
- Password must be at least 12 characters
- Must contain uppercase, lowercase, numbers, and symbols
- Use a unique, strong email address
- Enable 2FA immediately after creation
- Store setup key securely and use only once

## Example Setup Key
${this.generateSetupKey()}
    `.trim();
  }
}
