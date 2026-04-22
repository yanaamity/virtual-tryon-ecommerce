/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['blob.vercelusercontent.com'],
    unoptimized: false,
  },
  api: {
    responseLimit: '50mb',
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
