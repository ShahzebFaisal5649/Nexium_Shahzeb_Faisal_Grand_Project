/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is now enabled by default in Next.js 15+, so we can remove it
  images: {
    domains: [], // Add your image domains here if needed
  },
  // Add metadataBase to resolve social image warnings
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  // Optional: Enable PWA if needed (uncomment if using next-pwa)
  // pwa: {
  //   dest: 'public',
  //   disable: process.env.NODE_ENV === 'development',
  // },
  // Optional: Configure logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Optional: Enable experimental features if needed
  experimental: {
    // serverActions: true, // Uncomment if using Server Actions
    // optimizePackageImports: ['@radix-ui/react-icons'], // Example optimization
  },
  // Optional: Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

// Uncomment if using PWA
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
// })
// module.exports = withPWA(nextConfig)

module.exports = nextConfig