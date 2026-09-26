#!/usr/bin/env node
/**
 * Package build: Vite lib bundle, then `ds2 tokens emit` into distRoot.
 *
 * Vite does not empty all of dist/. A plugin deletes everything under dist/
 * except dist/designSystem/ (token emit). Emit still runs after Vite to refresh
 * tokens on a full build; it is no longer required to rescue a wiped tree.
 * `--soft` exits 0 if the build fails (e.g. missing deps mid-install).
 */
import { spawnSync } from "node:child_process";
import { accessSync, constants } from "node:fs";
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
  // ENOENT → status null; treat as failure so workspace-hoisted bins are not silent.
  if (result.error) {
    console.error(result.error.message);
    return 1;
  }
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

/** Prefer package-local `.bin`, then walk up (npm workspaces hoist to the root). */
function findBin(name) {
  let dir = pkgRoot;
  for (;;) {
    const candidate = join(dir, "node_modules", ".bin", name);
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      /* keep walking */
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
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

const ds2Bin = findBin("ds2");
if (!ds2Bin) {
  failOrSoft(1, "tokens emit (ds2 not found in node_modules/.bin)");
} else {
  failOrSoft(run(ds2Bin, ["tokens", "emit", "--formats", "all"]), "tokens emit");
}

process.exit(0);
