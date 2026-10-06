import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  experimental: {
    // The proxy buffers request bodies. The default 10MB cap truncates a video
    // upload, and the route then cannot parse the multipart body.
    proxyClientMaxBodySize: "90mb",
  },
};

export default nextConfig;
