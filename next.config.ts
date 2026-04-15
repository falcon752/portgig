import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

// HTTP security headers applied to every response
const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer info sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 2 years (only takes effect over HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Restrict browser feature access
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  // Enable DNS prefetch
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy — allows Next.js inline scripts, Google OAuth, Firebase, Cloudinary
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://cdn.firebase.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://api.portgig.com https://via.placeholder.com https://placehold.co https://picsum.photos https://images.unsplash.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://portgig.sfo3.digitaloceanspaces.com",
      "connect-src 'self' https://api.portgig.com wss://api.portgig.com https://firestore.googleapis.com https://firebase.googleapis.com wss://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com",
      "frame-src https://accounts.google.com",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
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
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // DigitalOcean Spaces CDN
      {
        protocol: 'https',
        hostname: 'portgig.sfo3.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, 
  },
  eslint: { ignoreDuringBuilds: true, },
};

export default withFlowbiteReact(nextConfig);