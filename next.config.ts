
import { NextConfig } from 'next';

const config: NextConfig = {
  async rewrites() {
    return [];
  },
  webpack: (config) => {
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
