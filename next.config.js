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
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: appSecurityHeaders,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
