import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "anishvip.ane.sh",
      },
      {
        protocol: "http",
        hostname: "anishvip.ane.sh",
      },
      {
        protocol: "https",
        hostname: "anish.vip",
      },
      {
        protocol: "https",
        hostname: "anishkhatri.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
