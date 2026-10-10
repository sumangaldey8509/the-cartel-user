import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // keep Unsplash
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ allow Cloudinary
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://thecartel.ai' 
      : 'http://localhost:8080',
  },
};

export default nextConfig;
