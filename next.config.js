/** @type {import('next').NextConfig} */

const appSecurityHeaders = [
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
];

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: appSecurityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.txt',
        destination: '/api/sitemap?type=txt',
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = withPWA(nextConfig);
