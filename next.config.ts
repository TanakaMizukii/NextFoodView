import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'export',
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
