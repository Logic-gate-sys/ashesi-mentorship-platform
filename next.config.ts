import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable Turbopack — it crashes with socket.io native modules
  turbopack: undefined,
   output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'image.simplecastcdn.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },

  serverExternalPackages: [
    'socket.io',
    'socket.io-client',
    'socket.io-adapter',
    'engine.io',
    'bufferutil',
    'utf-8-validate',
  ],

  webpack: (config, { isServer }) => {
    if (isServer) {
      const existing = Array.isArray(config.externals) ? config.externals : [];
      config.externals = [
        ...existing,
        'socket.io',
        'socket.io-client',
        'bufferutil',
        'utf-8-validate',
      ];
    }
    return config;
  },
};

export default nextConfig;
