import type { NextConfig } from "next";

const NextConfig: NextConfig = {
  // Next.js 16+ uses Turbopack by default
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default NextConfig;


