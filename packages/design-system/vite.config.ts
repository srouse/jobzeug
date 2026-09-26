import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

/**
 * Wipe everything under dist/ except designSystem/ (token emit output).
 * Vite emptyOutDir is boolean-only and cannot spare a subfolder.
 */
function preserveDesignSystemDist(): Plugin {
  const dist = resolve(__dirname, "dist");
  return {
    name: "preserve-design-system-dist",
    buildStart() {
      if (!existsSync(dist)) return;
      for (const name of readdirSync(dist)) {
        if (name === "designSystem") continue;
        rmSync(join(dist, name), { recursive: true, force: true });
      }
    },
  };
}

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
      // Custom elements + Phosphor inject are load-time side effects; don't
      // drop `import "../jz-icon/jz-icon.js"` from tag/button chunks.
      treeshake: {
        moduleSideEffects: (id) =>
          id.includes("/designSystem/components/") ||
          id.includes("Phosphor") ||
          id.includes("?inline"),
      },
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
    emptyOutDir: false,
    sourcemap: true,
  },
  plugins: [
    preserveDesignSystemDist(),
    dts({
      include: ["src"],
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
});
