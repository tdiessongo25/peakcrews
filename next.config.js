/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration only
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Simple image configuration
  images: {
    unoptimized: true, // Disable image optimization completely
  },

  // Minimal headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;
