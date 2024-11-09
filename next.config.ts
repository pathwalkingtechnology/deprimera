import type { NextConfig } from "next";
import { env } from 'process';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['deprimera.vercel.app', env.SUPABASE_BUCKET_URL.replace('storage/v1/object/public/product-images/', '')],
  },
};

export default nextConfig;
