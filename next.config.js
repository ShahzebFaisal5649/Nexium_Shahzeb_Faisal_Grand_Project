/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the experimental.appDir option
  images: {
    domains: ['emdmbyvtzzqzuiftncte.supabase.co'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig