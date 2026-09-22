#!/usr/bin/env node
/**
 * Vercel install: consume committed @jobzeug/design-system dist.
 * Strips the local-only file: agent-kit dep and prepare script from the
 * deploy clone only, then installs without lifecycle scripts.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dsPkgPath = join(root, "packages/design-system/package.json");
const distIndex = join(root, "packages/design-system/dist/index.js");
const distTokens = join(
  root,
  "packages/design-system/dist/designSystem/tokens.css",
);

if (!existsSync(distIndex) || !existsSync(distTokens)) {
  console.error(
    "vercel-install: missing packages/design-system/dist (index.js and/or designSystem/tokens.css).\n" +
      "Run `npm run ds:build` locally and commit packages/design-system/dist before deploying.",
  );
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(dsPkgPath, "utf8"));
if (pkg.devDependencies?.["@contentful/design-system-squared-agent-kit"]) {
  delete pkg.devDependencies["@contentful/design-system-squared-agent-kit"];
}
if (pkg.scripts?.prepare) {
  delete pkg.scripts.prepare;
}
writeFileSync(dsPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const result = spawnSync("npm", ["install", "--ignore-scripts"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
