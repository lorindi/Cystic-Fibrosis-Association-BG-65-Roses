import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    appDir: true,
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  images: {
    domains: ['via.placeholder.com', 'randomuser.me', 'res.cloudinary.com'],
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
};

export default config;
