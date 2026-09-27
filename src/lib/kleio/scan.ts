import fs from "node:fs/promises";
import path from "node:path";

import { kleioProjects, type KleioSource } from "./catalog";
import { archiveRoot, isKleioEnabled, kleioRoot, type KleioArchive } from "./enabled";

const MEDIA_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf"]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "src",
  "coverage",
  ".next",
  "vendor",
  "Pods",
  "__pycache__",
]);

export type KleioImage = {
  label: string;
  relativePath: string;
  archive: KleioArchive;
};

export type KleioGroup = {
  id: string;
  title: string;
  images: KleioImage[];
};

export type KleioScan =
  | { ok: true; groups: KleioGroup[] }
  | { ok: false; reason: "disabled" | "missing-root"; root: string };

export async function collectSource(
  root: string,
  source: KleioSource,
): Promise<KleioImage[]> {
  const base = path.resolve(root, source.dir);
  const relToRoot = path.relative(root, base);
  if (relToRoot.startsWith("..") || path.isAbsolute(relToRoot)) return [];

  const images: KleioImage[] = [];

  async function walk(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      const isPdf = ext === ".pdf";
      if (isPdf && source.archive !== "work") continue;
      if (!isPdf && !MEDIA_EXT.has(ext)) continue;
      const within = path.relative(base, abs);
      if (source.match && !source.match.test(within)) continue;
      images.push({
        label: entry.name,
        relativePath: path.relative(root, abs),
        archive: source.archive ?? "kleio",
      });
    }
  }

  await walk(base);
  return images;
}

export async function scanKleio(): Promise<KleioScan> {
  const root = kleioRoot();
  if (!isKleioEnabled()) return { ok: false, reason: "disabled", root };

  try {
    const stat = await fs.stat(root);
    if (!stat.isDirectory()) return { ok: false, reason: "missing-root", root };
  } catch {
    return { ok: false, reason: "missing-root", root };
  }

  const groups: KleioGroup[] = [];
  for (const project of kleioProjects) {
    const images: KleioImage[] = [];
    for (const source of project.sources) {
      images.push(...(await collectSource(archiveRoot(source.archive), source)));
    }
    images.sort((a, b) =>
      a.relativePath.localeCompare(b.relativePath, undefined, {
        numeric: true,
      }),
    );
    groups.push({ id: project.id, title: project.title, images });
  }
  return { ok: true, groups };
}

export function resolveKleioFile(
  relativePath: string,
  archive: KleioArchive = "kleio",
): string | null {
  if (!relativePath || relativePath.includes("\0")) return null;
  const root = path.resolve(archiveRoot(archive));
  const abs = path.resolve(root, relativePath);
  const rel = path.relative(root, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  const ext = path.extname(abs).toLowerCase();
  if (!MEDIA_EXT.has(ext)) return null;
  return abs;
}

export function kleioContentType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    default:
      return "image/png";
  }
}
