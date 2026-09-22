import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "react/index": resolve(__dirname, "src/react/index.ts"),
        "react/react-server": resolve(__dirname, "src/react/react-server.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "lit",
        "lit/decorators.js",
        "lit/directives/class-map.js",
        "@lit/react",
        "react",
        "react/jsx-runtime",
        "react-dom",
      ],
      output: {
        preserveModules: false,
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
        banner(chunk) {
          if (
            chunk.fileName.startsWith("react/") &&
            !chunk.fileName.includes("react-server")
          ) {
            return '"use client";';
          }
          return "";
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    vanillaExtractPlugin({ unstable_mode: "transform" }),
    dts({
      include: ["src"],
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
});
