import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.cursor.com',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
  env: {
    CURSOR_API_BASE_URL: process.env.CURSOR_API_BASE_URL,
    CURSOR_API_KEY: process.env.CURSOR_API_KEY,
    CURSOR_PROJECT_ID: process.env.CURSOR_PROJECT_ID,
    CURSOR_MFA_ENABLED: process.env.CURSOR_MFA_ENABLED,
    CURSOR_EMAIL_VERIFICATION: process.env.CURSOR_EMAIL_VERIFICATION,
    CURSOR_PASSWORD_RESET: process.env.CURSOR_PASSWORD_RESET,
  },
  async rewrites() {
    return [
      {
        source: '/api/cursor/:path*',
        destination: `${process.env.CURSOR_API_BASE_URL || 'https://api.cursor.com'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
