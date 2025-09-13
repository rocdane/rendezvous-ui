import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/booking/:username/:slug',
        destination: '/public/booking/:username/:slug',
      },
    ];
  },
};

export default nextConfig;
