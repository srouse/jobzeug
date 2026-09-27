/** Synology archive. Override locally with KLEIO_ROOT. Never read on Vercel. */
export const DEFAULT_KLEIO_ROOT =
  "/Users/scottrouse/SYNC/SynologyDrive/KLEIO";

export function kleioRoot(): string {
  const fromEnv = process.env.KLEIO_ROOT?.trim();
  return fromEnv || DEFAULT_KLEIO_ROOT;
}

export function workProjectsRoot(): string {
  const fromEnv = process.env.WORK_PROJECTS_ROOT?.trim();
  return fromEnv || "/Users/scottrouse/SYNC/SynologyDrive/workProjects";
}

export type KleioArchive = "kleio" | "work";

export function archiveRoot(archive: KleioArchive = "kleio"): string {
  return archive === "work" ? workProjectsRoot() : kleioRoot();
}

/**
 * Vercel sets VERCEL=1 for preview, production, and build.
 * That is the off switch. No separate flag to maintain.
 */
export function isKleioEnabled(): boolean {
  return !process.env.VERCEL;
}
