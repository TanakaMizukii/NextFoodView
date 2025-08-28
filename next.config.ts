import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
