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
    domains: ['via.placeholder.com'],
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
};

export default config;
