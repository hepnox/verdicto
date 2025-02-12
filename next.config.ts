import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "loremflickr.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        hostname: "cimbxxgcefbtbwxnymhn.supabase.co",
      }
    ],
  },
};

export default nextConfig;
