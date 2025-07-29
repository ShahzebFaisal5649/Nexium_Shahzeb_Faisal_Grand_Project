// @ts-nocheck
import nextPWA from 'next-pwa';
import { withSentryConfig } from '@sentry/nextjs';

/** 
* @type {import('next').NextConfig} 
*/
const nextConfig = {
  // Core Next.js Config
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@radix-ui/themes'],
  productionBrowserSourceMaps: true,
  
  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Webpack Configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Experimental Features
  experimental: {
    // Removed serverActions: true - Server Actions are enabled by default in Next.js 14+
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@radix-ui/themes',
    ],
    // Add other experimental features if needed
    serverComponentsExternalPackages: [], // Add packages that should be external
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Environment Variables (optional - for better organization)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

// Security Headers Configuration
const securityHeaders = [
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
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

// PWA Configuration (Production Only)
const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest.json$/],
});

// Sentry Configuration (Production Only)
const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG || 'your-org',
  project: process.env.SENTRY_PROJECT || 'your-project',
  // Hide source maps from generated client bundles
  hideSourceMaps: true,
  // Disable Sentry during development
  disableLogger: process.env.NODE_ENV === 'development',
};

// Export the final configuration
export default process.env.NODE_ENV === 'production'
  ? withSentryConfig(withPWA(nextConfig), sentryWebpackPluginOptions)
  : nextConfig;