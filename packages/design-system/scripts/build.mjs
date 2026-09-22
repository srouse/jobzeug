#!/usr/bin/env node
/**
 * Package build: Vite lib bundle, then `ds2 tokens emit` into distRoot.
 * Vite `emptyOutDir` clears `dist/`, so emit must run after every Vite build.
 * `--soft` exits 0 if the build fails (e.g. missing deps mid-install).
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const soft = process.argv.includes("--soft");
const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function run(bin, args) {
  const result = spawnSync(bin, args, {
    cwd: pkgRoot,
    env: process.env,
    stdio: "inherit",
  });
  return result.status ?? 1;
}

function failOrSoft(code, label) {
  if (code === 0) return;
  if (soft) {
    console.warn(`@jobzeug/design-system: soft ${label} failed — continuing`);
    process.exit(0);
  }
  process.exit(code);
}

let viteBin;
try {
  const vitePkg = require.resolve("vite/package.json", { paths: [pkgRoot] });
  viteBin = join(dirname(vitePkg), "bin/vite.js");
} catch {
  if (soft) {
    console.warn("@jobzeug/design-system: vite not available yet — skip soft build");
    process.exit(0);
  }
  throw new Error("vite not found");
}

failOrSoft(run(process.execPath, [viteBin, "build"]), "vite build");

const ds2Bin = join(pkgRoot, "node_modules", ".bin", "ds2");
failOrSoft(run(ds2Bin, ["tokens", "emit", "--formats", "all"]), "tokens emit");

process.exit(0);
