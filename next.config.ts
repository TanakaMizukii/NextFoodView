import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  /* config options here */
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      '.loca.lt',
      '.ngrok-free.app'
    ], // localtunnelのURLを許可
  }
};

export default nextConfig;
