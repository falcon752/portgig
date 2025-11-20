import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Production API
      {
        protocol: 'https',
        // hostname: 'portgig-api.onrender.com',
        hostname: 'api.portgig.com',
        port: '',
        pathname: '/uploads/portfolio/**',
      },
      // Local development API
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5008',
        pathname: '/uploads/portfolio/**',
      },
      // Alternative localhost format
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5008',
        pathname: '/uploads/portfolio/**',
      },
      // Placeholder services
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, 
  },
};

export default withFlowbiteReact(nextConfig);