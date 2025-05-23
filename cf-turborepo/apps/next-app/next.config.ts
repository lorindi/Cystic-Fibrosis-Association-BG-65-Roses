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
    domains: ['via.placeholder.com', 'randomuser.me'],
    
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
    ],
  },
};

export default config;
