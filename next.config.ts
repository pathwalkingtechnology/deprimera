import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deprimera.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'vaahxtelpfefskctxiwr.supabase.co',
      },
    ],
  },
};

export default nextConfig;
