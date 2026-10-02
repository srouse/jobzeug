import "server-only";

import { z } from "zod";

import { loadPublishedJobPosting } from "@/lib/job-posting";
import { loadMatchingCatalog } from "@/lib/matching/catalog";
import { recencyWeight } from "@/lib/matching/recency";
import { CONCEPT_HIT_POINTS, scorePostingAgainstCatalog } from "@/lib/matching/score";

export const jobPostingEntryIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid entry id");

type CatalogClaim = {
  id: string;
  statement?: string;
  concept_ids?: string[];
  provenance?: string;
  review?: { status?: string };
};

type CatalogProject = {
  project_id: string;
  title?: string;
  ranking_eligible?: boolean;
  year?: unknown;
  evidence?: CatalogClaim[];
};

export type AnalyticsConcept = {
  id: string;
  label: string;
};

export type AnalyticsClaim = {
  id: string;
  status: string;
  statement: string;
  concepts: AnalyticsConcept[];
};

export type AnalyticsHit = {
  projectId: string;
  points: number;
  conceptHits: number;
  overlapIds: string[];
  evidenceIds: string[];
  statement: string;
};

export type AnalyticsProject = {
  id: string;
  title: string;
  year: number | null;
  meta: string;
  claims: AnalyticsClaim[];
};

export type AnalyticsLine = {
  id: string;
  meta: string;
  text: string;
  concepts: AnalyticsConcept[];
  noConcepts: boolean;
  /** False when this line is absent from the scored payload, so a click does nothing. */
  selectable: boolean;
  hits: AnalyticsHit[];
};

export type AnalyticsProjectRow = {
  projectId: string;
  title: string;
  tags: string;
  lines: number;
  two: number;
  three: number;
  four: number;
  fit: string;
  age: { text: string; title: string };
};

export type AnalyticsLineRow = {
  lineId: string;
  number: string;
  text: string;
  tags: string;
  projects: number;
  two: number;
  three: number;
  four: number;
  fit: string;
};

export type AnalyticsFit = {
  score: number;
} | null;

export type AnalyticsPageData = {
  entryId: string;
  postingId: string;
  company: string;
  title: string;
  scoringVersion: string;
  vocabVersion: string | null;
  focusedProjectId: string;
  focusedLineId: string;
  projectFit: AnalyticsFit;
  lineFit: AnalyticsFit;
  projects: AnalyticsProject[];
  lines: AnalyticsLine[];
  projectRows: AnalyticsProjectRow[];
  lineRows: AnalyticsLineRow[];
};

function claimIsScorable(claim: CatalogClaim) {
  if (claim.provenance === "inferred") return false;
  if (claim.review?.status === "approved") return true;
  return (
    claim.review?.status === "proposed" ||
    claim.review?.status === "needs_review"
  );
}

function projectYear(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function ageCell(year: number | null) {
  const weight = recencyWeight(year);
  const text = weight.toFixed(2);
  if (year == null) return { text, title: "Year unknown. Full weight." };
  const age = new Date().getUTCFullYear() - year;
  return { text, title: `${year}, ${age} year${age === 1 ? "" : "s"} old` };
}

function formatCount(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatAdjustedPoints(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function tagCount(points: readonly number[]) {
  return points.reduce((sum, value) => sum + value, 0) / CONCEPT_HIT_POINTS;
}

function wholeScore(value: number) {
  return String(Math.round(value));
}

export async function loadAnalytics({
  jobPostingEntryId,
  projectId,
  lineEntryId,
}: {
  jobPostingEntryId: string;
  projectId?: string;
  lineEntryId?: string;
}): Promise<AnalyticsPageData | null> {
  const view = await loadPublishedJobPosting(jobPostingEntryId);
  if (!view) return null;

  const catalog = await loadMatchingCatalog();
  const scored = scorePostingAgainstCatalog({
    posting: view,
    catalog,
    examplesPerLine: 40,
  });
  const vocabVersion =
    view.matchingSnapshot?.vocabularyVersion ??
    [...catalog.vocabularies.keys()][0];
  const vocabulary = vocabVersion
    ? catalog.vocabularies.get(vocabVersion)
    : undefined;
  const labelById = new Map<string, string>();
  for (const concept of vocabulary?.concepts ?? []) {
    labelById.set(concept.id, concept.label ?? concept.id);
  }
  const labelOf = (id: string): AnalyticsConcept => ({
    id,
    label: labelById.get(id) ?? id,
  });

  const statementByClaimId = new Map<string, string>();
  const titleByProjectId = new Map<string, string>();
  const catalogProjects = [...catalog.projects.values()] as CatalogProject[];
  for (const project of catalogProjects) {
    titleByProjectId.set(project.project_id, project.title ?? project.project_id);
    for (const claim of project.evidence ?? []) {
      statementByClaimId.set(claim.id, String(claim.statement ?? ""));
    }
  }

  const pendingSet = new Set(catalog.pendingProjectIds ?? []);
  const scoreByProjectId = new Map(
    scored.projects.map((project) => [project.projectId, project.score]),
  );
  const projects = [...catalogProjects].sort((a, b) => {
    const aScore = scoreByProjectId.get(a.project_id);
    const bScore = scoreByProjectId.get(b.project_id);
    if (aScore == null && bScore == null) {
      return a.project_id.localeCompare(b.project_id);
    }
    if (aScore == null) return 1;
    if (bScore == null) return -1;
    if (bScore !== aScore) return bScore - aScore;
    return a.project_id.localeCompare(b.project_id);
  });

  const lineScore = (entryId: string) => {
    const scoredLine = scored.jobLines.find((line) => line.lineEntryId === entryId);
    return (scoredLine?.matchSummaries ?? []).reduce(
      (sum, summary) => sum + summary.points,
      0,
    );
  };
  const rankedLines = [...view.lines].sort((a, b) => {
    const diff = lineScore(b.entryId) - lineScore(a.entryId);
    if (diff !== 0) return diff;
    return a.entryId.localeCompare(b.entryId);
  });

  const projectCards: AnalyticsProject[] = projects.map((project) => {
    const claims = (project.evidence ?? []).filter(claimIsScorable);
    const flags = [
      project.ranking_eligible ? "eligible" : "excluded",
      pendingSet.has(project.project_id) ? "pending" : null,
    ]
      .filter(Boolean)
      .join(", ");
    const scoreRow = scored.projects.find((row) => row.projectId === project.project_id);
    const scoreLabel =
      scoreRow?.score == null
        ? scoreRow?.pending
          ? "pending"
          : "—"
        : String(scoreRow.score);
    const adjustedLabel =
      typeof scoreRow?.score === "number"
        ? formatAdjustedPoints(scoreRow.score * recencyWeight(projectYear(project.year)))
        : null;
    const pointsLabel = adjustedLabel
      ? `total points ${scoreLabel} · age-adjusted ${adjustedLabel}`
      : `total points ${scoreLabel}`;
    return {
      id: project.project_id,
      title: project.title ?? project.project_id,
      year: projectYear(project.year),
      meta: `${flags} · ${pointsLabel}`,
      claims: claims.map((claim) => ({
        id: claim.id,
        status: claim.review?.status ?? "?",
        statement: claim.statement ?? "",
        concepts: [...(claim.concept_ids ?? [])].sort().map(labelOf),
      })),
    };
  });

  const collectHits = (requirementId: string | null) => {
    if (!requirementId) return [];
    const hits: AnalyticsHit[] = [];
    for (const project of scored.projects) {
      for (const contribution of project.contributions) {
        if (contribution.requirementId !== requirementId || contribution.points <= 0) {
          continue;
        }
        const statement =
          contribution.evidenceIds
            .map((id) => statementByClaimId.get(id) ?? "")
            .find((value) => value.length > 0) ?? "";
        hits.push({
          projectId: project.projectId,
          points: contribution.points,
          conceptHits: contribution.conceptHits,
          overlapIds: contribution.overlapIds,
          evidenceIds: contribution.evidenceIds,
          statement,
        });
      }
    }
    hits.sort(
      (a, b) => b.points - a.points || a.projectId.localeCompare(b.projectId),
    );
    return hits;
  };

  const lineCards: AnalyticsLine[] = rankedLines.map((line) => {
    const req = line.matchingRequirement;
    const conceptIds = [
      ...new Set([
        ...(req?.concept_ids ?? []),
        ...(req?.constraints?.tool_concept_ids ?? []),
      ]),
    ].sort();
    const scoredLine = scored.jobLines.find((row) => row.lineEntryId === line.entryId);
    const hitCount = scoredLine?.matchSummaries?.length ?? 0;
    return {
      id: line.entryId,
      meta: `${line.section} / ${line.theme} · line-scope=${req?.scope ?? "—"} · ${req?.mapping_status ?? "—"} · ${hitCount} project hit(s) — click to focus`,
      text: line.text,
      concepts: conceptIds.map(labelOf),
      noConcepts: conceptIds.length === 0,
      selectable: scoredLine != null,
      hits: collectHits(scoredLine?.requirementId ?? null),
    };
  });

  const scoredById = new Map(scored.projects.map((project) => [project.projectId, project]));
  const projectRank = projects
    .map((project) => {
      const scoredRow = scoredById.get(project.project_id);
      const hits = (scoredRow?.contributions ?? []).filter((hit) => hit.points > 0);
      const raw = hits.reduce((sum, hit) => sum + hit.points, 0);
      const year = projectYear(project.year);
      const tags = tagCount(hits.map((hit) => hit.points));
      const lines = hits.length;
      const depth = (count: number) => hits.filter((hit) => hit.conceptHits === count).length;
      return {
        projectId: project.project_id,
        title: titleByProjectId.get(project.project_id) ?? "",
        tags,
        lines,
        two: depth(2),
        three: depth(3),
        four: hits.filter((hit) => hit.conceptHits >= 4).length,
        raw,
        adjusted: raw * recencyWeight(year),
        age: ageCell(year),
      };
    })
    .sort((a, b) => b.adjusted - a.adjusted || a.projectId.localeCompare(b.projectId));
  const postingScore = { score: scored.ageAdjustedTotal };

  const yearByProjectId = new Map(
    catalogProjects.map((project) => [project.project_id, projectYear(project.year)]),
  );
  const lineRank = rankedLines
    .map((line) => {
      const scoredLine = scored.jobLines.find((row) => row.lineEntryId === line.entryId);
      const hits = collectHits(scoredLine?.requirementId ?? line.entryId);
      const adjusted = hits.reduce(
        (sum, hit) => sum + hit.points * recencyWeight(yearByProjectId.get(hit.projectId)),
        0,
      );
      const tags = tagCount(hits.map((hit) => hit.points));
      const hitProjects = hits.length;
      const depth = (count: number) => hits.filter((hit) => hit.conceptHits === count).length;
      return {
        lineId: line.entryId,
        number: line.entryId.match(/-line-(\d+)$/)?.[1] ?? line.entryId,
        text: line.text,
        tags,
        projects: hitProjects,
        two: depth(2),
        three: depth(3),
        four: hits.filter((hit) => hit.conceptHits >= 4).length,
        adjusted,
      };
    })
    .sort((a, b) => b.adjusted - a.adjusted || a.lineId.localeCompare(b.lineId));

  const projectParam = projectId?.trim().replace(/^jz-/, "") ?? "";
  const focusedProjectId = /^S\d+$/.test(projectParam) ? projectParam : "";
  const lineParam = lineEntryId?.trim() ?? "";
  const focusedLine = lineCards.find((line) => line.id === lineParam);
  const focusedLineId =
    /^[\w-]+$/.test(lineParam) && focusedLine?.selectable ? lineParam : "";

  return {
    entryId: view.entryId,
    postingId: view.postingId,
    company: view.company,
    title: view.title,
    scoringVersion: scored.scoringVersion,
    vocabVersion: vocabVersion ?? null,
    focusedProjectId,
    focusedLineId,
    projectFit: postingScore,
    lineFit: postingScore,
    projects: projectCards,
    lines: lineCards,
    projectRows: projectRank.map((row) => ({
      projectId: row.projectId,
      title: row.title,
      tags: formatCount(row.tags),
      lines: row.lines,
      two: row.two,
      three: row.three,
      four: row.four,
      fit: wholeScore(row.adjusted),
      age: row.age,
    })),
    lineRows: lineRank.map((row) => ({
      lineId: row.lineId,
      number: row.number,
      text: row.text,
      tags: formatCount(row.tags),
      projects: row.projects,
      two: row.two,
      three: row.three,
      four: row.four,
      fit: wholeScore(row.adjusted),
    })),
  };
}
