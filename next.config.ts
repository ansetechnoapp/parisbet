import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY
  }
};

export default nextConfig;
