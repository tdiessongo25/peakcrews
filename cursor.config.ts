export interface CursorConfig {
  api: {
    baseUrl: string;
    auth: {
      signIn: string;
      signOut: string;
      signUp: string;
      refresh: string;
      verify: string;
      resetPassword: string;
    };
    data: {
      users: string;
      jobs: string;
      applications: string;
      reviews: string;
      notifications: string;
      profiles: string;
    };
    storage: {
      upload: string;
      delete: string;
    };
  };
  auth: {
    cookieName: string;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      maxAge: number;
    };
  };
  features: {
    mfa: boolean;
    emailVerification: boolean;
    passwordReset: boolean;
  };
}

const config: CursorConfig = {
  api: {
    baseUrl: process.env.CURSOR_API_BASE_URL || 'https://api.cursor.com',
    auth: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      signUp: '/auth/signup',
      refresh: '/auth/refresh',
      verify: '/auth/verify',
      resetPassword: '/auth/reset-password',
    },
    data: {
      users: '/data/users',
      jobs: '/data/jobs',
      applications: '/data/applications',
      reviews: '/data/reviews',
      notifications: '/data/notifications',
      profiles: '/data/profiles',
    },
    storage: {
      upload: '/storage/upload',
      delete: '/storage/delete',
    },
  },
  auth: {
    cookieName: 'cursor-session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
  features: {
    mfa: process.env.CURSOR_MFA_ENABLED === 'true',
    emailVerification: process.env.CURSOR_EMAIL_VERIFICATION === 'true',
    passwordReset: process.env.CURSOR_PASSWORD_RESET === 'true',
  },
};

export default config; 