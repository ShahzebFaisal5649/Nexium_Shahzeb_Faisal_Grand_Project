/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the experimental.fontLoaders section completely
  // Font loading is now handled automatically by Next.js
  // through the next/font package
  
  // Other configuration options can go here
  // For example:
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add your image domains here if needed
  },
  // Add any other valid Next.js config options
}

module.exports = nextConfig