import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Server actions handle file uploads, raise the body limit so the 8 MB
    // file ceiling enforced in lib/upload.ts can actually reach the server.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
