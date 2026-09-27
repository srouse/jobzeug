import fs from "node:fs/promises";
import path from "node:path";

import {
  kleioProjects,
  kleioTopLevel,
  skippedKleioFolders,
  skippedWorkFolders,
  type KleioSource,
} from "./catalog";
import { archiveRoot, isKleioEnabled, kleioRoot, workProjectsRoot, type KleioArchive } from "./enabled";
import { collectSource } from "./scan";

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

export type KleioAudit = {
  root: string;
  disabled: boolean;
  missingRoot: boolean;
  newProjects: { id: string; title: string }[];
  newFolders: { name: string; imageCount: number }[];
  stale: { projectId: string; dir: string; reason: string }[];
};

const PROJECT_ROW = /^\|\s*(S\d+)\s*\|\s*\[([^\]]+)\]/;

export async function readEvidenceProjects(
  indexPath: string,
): Promise<{ id: string; title: string }[]> {
  const text = await fs.readFile(indexPath, "utf8");
  const projects: { id: string; title: string }[] = [];
  for (const line of text.split("\n")) {
    const match = PROJECT_ROW.exec(line);
    if (!match) continue;
    projects.push({ id: match[1], title: match[2] });
  }
  return projects;
}

async function folderImageCount(dir: string, includePdf: boolean): Promise<number> {
  let count = 0;
  async function walk(current: string) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".pdf" ? includePdf : MEDIA_EXT.has(ext) && ext !== ".pdf") count += 1;
    }
  }
  await walk(dir);
  return count;
}

function coveredTopLevels(archive: KleioArchive): Set<string> {
  const covered = new Set<string>(
    archive === "work" ? skippedWorkFolders : skippedKleioFolders,
  );
  for (const project of kleioProjects) {
    for (const source of project.sources) {
      if ((source.archive ?? "kleio") !== archive) continue;
      covered.add(kleioTopLevel(source.dir));
    }
  }
  return covered;
}

async function staleSources(): Promise<KleioAudit["stale"]> {
  const stale: KleioAudit["stale"] = [];
  for (const project of kleioProjects) {
    for (const source of project.sources) {
      const reason = await staleReason(source);
      if (reason) stale.push({ projectId: project.id, dir: source.dir, reason });
    }
  }
  return stale;
}

async function staleReason(source: KleioSource): Promise<string | null> {
  const root = archiveRoot(source.archive);
  const abs = path.resolve(root, source.dir);
  const rel = path.relative(root, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return "path escapes the KLEIO root";
  try {
    const stat = await fs.stat(abs);
    if (!stat.isDirectory()) return "path is not a directory";
  } catch {
    return "path does not exist";
  }
  const images = await collectSource(root, source);
  if (images.length === 0) return "no images match";
  return null;
}

async function unseenFolders(
  root: string,
  covered: Set<string>,
  prefix: string,
): Promise<KleioAudit["newFolders"]> {
  const found: KleioAudit["newFolders"] = [];
  let names;
  try {
    names = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of names) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    if (covered.has(entry.name)) continue;
    const imageCount = await folderImageCount(
      path.join(root, entry.name),
      prefix === "workProjects",
    );
    if (imageCount === 0) continue;
    found.push({
      name: prefix ? `${prefix}/${entry.name}` : entry.name,
      imageCount,
    });
  }
  return found;
}

export async function auditKleio(
  evidenceIndexPath: string,
): Promise<KleioAudit> {
  const root = kleioRoot();
  if (!isKleioEnabled()) {
    return {
      root,
      disabled: true,
      missingRoot: false,
      newProjects: [],
      newFolders: [],
      stale: [],
    };
  }

  try {
    const stat = await fs.stat(root);
    if (!stat.isDirectory()) {
      return emptyMissing(root);
    }
  } catch {
    return emptyMissing(root);
  }

  const evidence = await readEvidenceProjects(evidenceIndexPath);
  const catalogIds = new Set(
    kleioProjects.filter((project) => project.id !== "unassigned").map((project) => project.id),
  );
  const newProjects = evidence.filter((project) => !catalogIds.has(project.id));

  const covered = coveredTopLevels("kleio");
  const newFolders = await unseenFolders(root, covered, "");
  newFolders.push(...(await unseenFolders(workProjectsRoot(), coveredTopLevels("work"), "workProjects")));
  newFolders.sort((a, b) => a.name.localeCompare(b.name));

  return {
    root,
    disabled: false,
    missingRoot: false,
    newProjects,
    newFolders,
    stale: await staleSources(),
  };
}

function emptyMissing(root: string): KleioAudit {
  return {
    root,
    disabled: false,
    missingRoot: true,
    newProjects: [],
    newFolders: [],
    stale: [],
  };
}

export function formatKleioAudit(audit: KleioAudit): string {
  if (audit.disabled) {
    return "KLEIO index is off because VERCEL is set. Nothing to check.";
  }
  if (audit.missingRoot) {
    return `KLEIO root is not available: ${audit.root}`;
  }

  const lines = [`KLEIO root: ${audit.root}`, ""];
  lines.push(section("New projects", audit.newProjects.map((project) => `${project.id} ${project.title}`)));
  lines.push(
    section(
      "New folders",
      audit.newFolders.map((folder) => `${folder.name} (${folder.imageCount})`),
    ),
  );
  lines.push(
    section(
      "Stale catalog rows",
      audit.stale.map((row) => `${row.projectId} ${row.dir} — ${row.reason}`),
    ),
  );
  return lines.join("\n").trimEnd();
}

function section(title: string, rows: string[]): string {
  if (rows.length === 0) return `${title}\nnone\n`;
  return `${title}\n${rows.map((row) => `- ${row}`).join("\n")}\n`;
}
