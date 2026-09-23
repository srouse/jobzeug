import type { NextConfig } from "next";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  // VE plugin injects webpack; Next 16 defaults to Turbopack — keep an empty
  // turbopack block so explicit --webpack / --turbopack flags remain valid.
  turbopack: {},
};

export default withVanillaExtract(nextConfig);
