/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Enable standalone output for Docker
  output: 'standalone',
}

module.exports = nextConfig
