import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the project root so a lockfile in a parent folder is not picked up.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
