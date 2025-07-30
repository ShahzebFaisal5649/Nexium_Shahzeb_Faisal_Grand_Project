/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config - only what's absolutely necessary
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Basic webpack config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Basic optimizations
  poweredByHeader: false,
};

export default nextConfig;