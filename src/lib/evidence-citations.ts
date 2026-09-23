import { z } from "zod";

const employerId = z.string().regex(/^C\d{3,}$/);
const roleId = z.string().regex(/^R\d{3,}$/);
const projectId = z.string().regex(/^S\d{3,}$/);
/** Contentful job line entry ids: jz-JP…-line-N */
const jobLineId = z.string().regex(/^jz-JP.+-line-\d+$/);

export const citeEvidenceSchema = z.object({
  employers: z.array(employerId).default([]),
  roles: z.array(roleId).default([]),
  projects: z.array(projectId).default([]),
  jobLines: z.array(jobLineId).default([]),
});

export type CiteEvidencePayload = z.infer<typeof citeEvidenceSchema>;

export const emptyCitations: CiteEvidencePayload = {
  employers: [],
  roles: [],
  projects: [],
  jobLines: [],
};

/** One assistant turn’s citeEvidence payload plus run metrics from message metadata. */
export type EvidenceCluster = {
  id: string;
  citations: CiteEvidencePayload;
  createdAt: number;
  /** Wall time from Mastra message metadata (source of truth). */
  durationMs: number;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  /** Assistant markdown body for the fixed answer stage. */
  answerMarkdown: string;
};

export function idsFromCitations(citations: CiteEvidencePayload): string[] {
  return [
    ...citations.employers,
    ...citations.roles,
    ...citations.projects,
    ...citations.jobLines,
  ];
}

/** Format elapsed wall time: `3s` under 60s, then `M:SS`. */
export function formatElapsed(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  if (totalSec < 60) return `${totalSec}s`;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Compact token count for UI labels, e.g. `1.2k`. */
export function formatTokenCount(count: number): string {
  if (count < 1000) return String(Math.round(count));
  if (count < 10_000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(count / 1000)}k`;
}

/** Label from persisted run metrics: `3s` or `3s · 12k tok`. */
export function formatRunMetricsLabel(metrics: {
  durationMs: number;
  totalTokens?: number | null;
}): string {
  const time = formatElapsed(metrics.durationMs);
  const tokens = metrics.totalTokens;
  if (tokens == null || tokens <= 0) return time;
  return `${time} · ${formatTokenCount(tokens)} tok`;
}
