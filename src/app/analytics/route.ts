/**
 * THROWAWAY — project claims vs job lines, plus click-to-see line relationships
 * from the real Match scorer (cumulative v2 points).
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { loadJobPostingByEntryId, saveJobPostingMatchGraph } from "@/lib/job-posting";
import { loadMatchingCatalog } from "@/lib/matching/catalog";
import {
  FIT_TAGS_PER_COUNTERPART,
  absoluteFitShare,
} from "@/lib/matching/home-coverage";
import { CONCEPT_HIT_POINTS, scorePostingAgainstCatalog } from "@/lib/matching/score";
import { SESSION_COOKIE, getSessionId } from "@/lib/site-auth";

const jobPostingEntryIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid entry id");

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function directionalFitMarkup(
  label: string,
  fit: { pct: number; detail: string } | null,
): string {
  if (!fit) {
    return `<div class="fit"><div class="fit-label">${escapeHtml(label)}</div><div class="fit-pct">—</div></div>`;
  }
  return `<div class="fit"><div class="fit-label">${escapeHtml(label)}</div><div class="fit-pct">${escapeHtml(fit.pct)}%</div><div class="fit-ceiling">${escapeHtml(fit.detail)}</div></div>`;
}

function htmlResponse(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function requireSiteSession(): Promise<
  { ok: true } | { error: NextResponse }
> {
  const jar = await cookies();
  const sid = await getSessionId(jar.get(SESSION_COOKIE)?.value);
  if (!sid) {
    return {
      error: htmlResponse(
        "<!doctype html><title>Unauthorized</title><p>Unauthorized — site session required.</p>",
        401,
      ),
    };
  }
  return { ok: true };
}

type DemoClaim = {
  id: string;
  statement?: string;
  concept_ids?: string[];
  provenance?: string;
  review?: { status?: string };
};

function claimIsScorable(claim: DemoClaim) {
  if (claim.provenance === "inferred") return false;
  if (claim.review?.status === "approved") return true;
  return (
    claim.review?.status === "proposed" ||
    claim.review?.status === "needs_review"
  );
}

export async function POST(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const raw = req.nextUrl.searchParams.get("jobPostingEntryId");
  const parsed = jobPostingEntryIdSchema.safeParse(raw ?? "");
  if (!parsed.success) {
    return NextResponse.json({ error: "jobPostingEntryId is required" }, { status: 400 });
  }

  try {
    const graph = await saveJobPostingMatchGraph(parsed.data);
    return NextResponse.json({
      ok: true,
      scoringVersion: graph.scoringVersion,
      edges: graph.edges.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save match graph";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const raw = req.nextUrl.searchParams.get("jobPostingEntryId");
  const parsed = jobPostingEntryIdSchema.safeParse(raw ?? "");
  const projectParam = req.nextUrl.searchParams.get("projectId")?.trim().replace(/^jz-/, "") ?? "";
  const focusedProjectId = /^S\d+$/.test(projectParam) ? projectParam : "";
  const lineParam = req.nextUrl.searchParams.get("lineEntryId")?.trim() ?? "";
  const focusedLineId = /^[\w-]+$/.test(lineParam) ? lineParam : "";
  if (!parsed.success) {
    return htmlResponse(
      "<!doctype html><title>Missing jobPostingEntryId</title><p>Pass <code>?jobPostingEntryId=</code>.</p>",
      400,
    );
  }

  try {
    const view = await loadJobPostingByEntryId(parsed.data);
    if (!view) {
      return htmlResponse(
        "<!doctype html><title>Not found</title><p>Job posting not found.</p>",
        404,
      );
    }

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
    const labelOf = (id: string) => labelById.get(id) ?? id;

    const statementByClaimId = new Map<string, string>();
    const titleByProjectId = new Map<string, string>();
    for (const project of catalog.projects.values()) {
      titleByProjectId.set(
        project.project_id,
        project.title ?? project.project_id,
      );
      for (const claim of project.evidence ?? []) {
        statementByClaimId.set(claim.id, String(claim.statement ?? ""));
      }
    }

    const pendingSet = new Set(catalog.pendingProjectIds ?? []);
    const scoreByProjectId = new Map(
      scored.projects.map((project) => [project.projectId, project.score]),
    );
    const projects = [...catalog.projects.values()].sort((a, b) => {
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
      const scoredLine = scored.jobLines.find(
        (line) => line.lineEntryId === entryId,
      );
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

    const renderConcepts = (ids: string[]) => {
      if (!ids.length) return `<p class="empty">No concepts</p>`;
      return `<ul class="concepts">${ids
        .map(
          (id) =>
            `<li><code>${escapeHtml(id)}</code> ${escapeHtml(labelOf(id))}</li>`,
        )
        .join("")}</ul>`;
    };

    const projectHtml = projects
      .map((project) => {
        const claims = ((project.evidence ?? []) as DemoClaim[]).filter(
          claimIsScorable,
        );
        const flags = [
          project.ranking_eligible ? "eligible" : "excluded",
          pendingSet.has(project.project_id) ? "pending" : null,
        ]
          .filter(Boolean)
          .join(", ");
        const scoreRow = scored.projects.find(
          (p) => p.projectId === project.project_id,
        );
        const scoreLabel =
          scoreRow?.score == null
            ? scoreRow?.pending
              ? "pending"
              : "—"
            : String(scoreRow.score);

        const claimHtml = claims.length
          ? claims
              .map((claim) => {
                const conceptIds = [...(claim.concept_ids ?? [])].sort();
                return `<div class="claim" data-claim-id="${escapeHtml(claim.id)}">
  <div class="claim-id"><code>${escapeHtml(claim.id)}</code> · ${escapeHtml(claim.review?.status ?? "?")}</div>
  <p class="statement">${escapeHtml(claim.statement ?? "")}</p>
  ${renderConcepts(conceptIds)}
</div>`;
              })
              .join("")
          : `<p class="empty">No claims</p>`;

        return `<article class="card project-card" tabindex="0" role="button" data-project-id="${escapeHtml(project.project_id)}">
  <h2>${escapeHtml(project.project_id)} — ${escapeHtml(project.title ?? project.project_id)}</h2>
  <div class="line-hit" hidden></div>
  <p class="meta">${escapeHtml(flags)} · total points <strong>${escapeHtml(scoreLabel)}</strong></p>
  <div class="claims">${claimHtml}</div>
</article>`;
      })
      .join("\n");

    const lineHtml = rankedLines
      .map((line) => {
        const req = line.matchingRequirement;
        const conceptIds = [
          ...new Set([
            ...(req?.concept_ids ?? []),
            ...(req?.constraints?.tool_concept_ids ?? []),
          ]),
        ].sort();
        const scoredLine = scored.jobLines.find(
          (j) => j.lineEntryId === line.entryId,
        );
        const hitCount = scoredLine?.matchSummaries?.length ?? 0;

        return `<article class="card line-card${conceptIds.length === 0 ? " no-concepts" : ""}" tabindex="0" role="button" data-line-id="${escapeHtml(line.entryId)}">
  <h2>${escapeHtml(line.entryId)}</h2>
  <div class="line-hit" hidden></div>
  <p class="meta">${escapeHtml(line.section)} / ${escapeHtml(line.theme)}
    · line-scope=${escapeHtml(req?.scope ?? "—")}
    · ${escapeHtml(req?.mapping_status ?? "—")}
    · <strong>${hitCount}</strong> project hit(s) — click to focus</p>
  <p class="statement">${escapeHtml(line.text)}</p>
  <div class="line-details">
  ${renderConcepts(conceptIds)}
  </div>
</article>`;
      })
      .join("\n");

    const formatCount = (value: number) => {
      const rounded = Math.round(value * 10) / 10;
      return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    };
    const tagCount = (points: readonly number[]) =>
      points.reduce((sum, value) => sum + value, 0) / CONCEPT_HIT_POINTS;
    const fitCeiling = (population: number) =>
      population * (1 + FIT_TAGS_PER_COUNTERPART);
    const scoredById = new Map(
      scored.projects.map((project) => [project.projectId, project]),
    );
    const postingLines = view.lines.filter(
      (line) => line.matchingRequirement?.scope === "project",
    );
    const projectCeiling = fitCeiling(postingLines.length);
    const projectRows = projects
      .map((project) => {
        const scoredRow = scoredById.get(project.project_id);
        const hits = (scoredRow?.contributions ?? []).filter((c) => c.points > 0);
        const points = hits.map((c) => c.points);
        const tags = tagCount(points);
        const lines = hits.length;
        const depth = (count: number) =>
          hits.filter((hit) => hit.conceptHits === count).length;
        return {
          projectId: project.project_id,
          tags,
          lines,
          two: depth(2),
          three: depth(3),
          four: hits.filter((hit) => hit.conceptHits >= 4).length,
          share: absoluteFitShare(tags, lines, postingLines.length),
        };
      })
      .sort(
        (a, b) =>
          b.share - a.share || a.projectId.localeCompare(b.projectId),
      );
    const bestProject = projectRows[0] ?? null;
    const projectFit =
      bestProject && postingLines.length > 0
        ? {
            pct: Math.round(bestProject.share * 100),
            detail: `${formatCount(bestProject.tags + bestProject.lines)} of ${projectCeiling}`,
          }
        : null;
    const rankingHtml = projectRows
      .map((row) => {
        return `<tr data-project-id="${escapeHtml(row.projectId)}"><td><code>${escapeHtml(row.projectId)}</code></td><td>${escapeHtml(titleByProjectId.get(row.projectId) ?? "")}</td><td class="num">${escapeHtml(formatCount(row.tags))}</td><td class="num">${escapeHtml(row.lines)}</td><td class="num" title="Lines with exactly two tags">${escapeHtml(row.two)}</td><td class="num" title="Lines with exactly three tags">${escapeHtml(row.three)}</td><td class="num" title="Lines with four or more tags">${escapeHtml(row.four)}</td><td class="num">${escapeHtml(Math.round(row.share * 100))}%</td></tr>`;
      })
      .join("");

    const lineHits = (entryId: string) => {
      const scoredLine = scored.jobLines.find(
        (line) => line.lineEntryId === entryId,
      );
      const requirementId = scoredLine?.requirementId ?? entryId;
      const hits: { points: number; conceptHits: number }[] = [];
      for (const project of scored.projects) {
        for (const contribution of project.contributions) {
          if (
            contribution.requirementId === requirementId &&
            contribution.points > 0
          ) {
            hits.push({
              points: contribution.points,
              conceptHits: contribution.conceptHits,
            });
          }
        }
      }
      return hits;
    };
    const lineCeiling = fitCeiling(projects.length);
    const rankedLineRows = rankedLines
      .map((line) => {
        const hits = lineHits(line.entryId);
        const tags = tagCount(hits.map((hit) => hit.points));
        const hitProjects = hits.length;
        const depth = (count: number) =>
          hits.filter((hit) => hit.conceptHits === count).length;
        return {
          line,
          tags,
          projects: hitProjects,
          two: depth(2),
          three: depth(3),
          four: hits.filter((hit) => hit.conceptHits >= 4).length,
          share: absoluteFitShare(tags, hitProjects, projects.length),
        };
      })
      .sort(
        (a, b) =>
          b.share - a.share ||
          a.line.entryId.localeCompare(b.line.entryId),
      );
    const bestLine = rankedLineRows[0] ?? null;
    const lineFit =
      bestLine && projects.length > 0
        ? {
            pct: Math.round(bestLine.share * 100),
            detail: `${formatCount(bestLine.tags + bestLine.projects)} of ${lineCeiling}`,
          }
        : null;
    const lineRankingHtml = rankedLineRows
      .map((row) => {
        const number = row.line.entryId.match(/-line-(\d+)$/)?.[1] ?? row.line.entryId;
        return `<tr data-line-id="${escapeHtml(row.line.entryId)}"><td><code>${escapeHtml(number)}</code></td><td class="clip" title="${escapeHtml(row.line.text)}">${escapeHtml(row.line.text)}</td><td class="num">${escapeHtml(formatCount(row.tags))}</td><td class="num">${escapeHtml(row.projects)}</td><td class="num" title="Projects with exactly two tags">${escapeHtml(row.two)}</td><td class="num" title="Projects with exactly three tags">${escapeHtml(row.three)}</td><td class="num" title="Projects with four or more tags">${escapeHtml(row.four)}</td><td class="num">${escapeHtml(Math.round(row.share * 100))}%</td></tr>`;
      })
      .join("");

    const linePayload = scored.jobLines.map((line) => {
      // Full project ranking for this line from contributions (not only top-N summaries).
      const hits = scored.projects
        .map((project) => {
          const contrib = project.contributions.find(
            (c) => c.requirementId === line.requirementId,
          );
          if (!contrib || contrib.points <= 0) return null;
          return {
            projectId: project.projectId,
            title: titleByProjectId.get(project.projectId) ?? project.projectId,
            points: contrib.points,
            conceptHits: contrib.conceptHits,
            ownershipHit: contrib.ownershipHit,
            scopeHit: contrib.scopeHit,
            stageHit: contrib.stageHit,
            overlapIds: contrib.overlapIds,
            evidenceIds: contrib.evidenceIds,
            statements: contrib.evidenceIds.map(
              (id) => statementByClaimId.get(id) ?? "",
            ),
            rationale: contrib.rationale,
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            (b!.points as number) - (a!.points as number) ||
            String(a!.projectId).localeCompare(String(b!.projectId)),
        );
      return {
        lineEntryId: line.lineEntryId,
        requirementId: line.requirementId,
        skipped: line.skipped ?? null,
        hits,
      };
    });

    const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(`Analytics · ${view.company} — ${view.title}`)}</title>
  <style>
    :root { color-scheme: light dark; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font: 14px/1.4 system-ui, sans-serif;
      display: grid;
      grid-template-columns: 640px minmax(0, 1fr) minmax(0, 1fr);
      height: 100vh;
      overflow: hidden;
    }
    aside, section {
      min-height: 0;
      height: 100vh;
      box-sizing: border-box;
    }
    aside {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-right: 1px solid #8884;
    }
    .aside-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 12px 14px;
    }
    .aside-toolbar {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-top: 1px solid #8884;
      padding: 10px 14px;
      background: Canvas;
    }
    section {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    section + section { border-left: 1px solid #8884; }
    .pane-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 12px 14px;
    }
    .aside-head {
      flex: 0 0 auto;
      padding: 12px 14px 10px;
      background: Canvas;
      border-bottom: 1px solid #d4d4d4;
    }
    .posting-company {
      margin: 0;
      font-size: 11px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #666;
    }
    .posting-title {
      margin: 2px 0 12px;
      font-size: 16px;
      font-weight: 650;
      line-height: 1.25;
      word-break: normal;
    }
    .posting-title a {
      color: inherit;
      text-decoration: none;
    }
    .posting-title a:hover {
      text-decoration: underline;
    }
    .fits { display: flex; margin: 0; }
    .fit { flex: 1; min-width: 0; text-align: center; padding: 0 8px; }
    .fit + .fit { border-left: 1px solid #d4d4d4; }
    .fit-label { font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: #666; }
    .fit-pct { font-size: 28px; font-weight: 700; line-height: 1.1; }
    .fit-ceiling { font-size: 12px; color: #666; }
    .throwaway { color: #b45309; font-weight: 600; margin: 0 0 8px; }
    .posting-meta { margin: 0 0 12px; word-break: break-word; font-size: 12px; color: #666; }
    .ranking {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 0;
      font-size: 12px;
    }
    .ranking + .ranking { margin-top: 20px; }
    .ranking th,
    .ranking td {
      border: 1px solid #d4d4d4;
      padding: 4px 8px;
      text-align: left;
      vertical-align: top;
    }
    .ranking th {
      font-weight: 600;
      color: #666;
      font-size: 11px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .ranking .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .ranking tbody tr[data-project-id],
    .ranking tbody tr[data-line-id] { cursor: pointer; }
    .ranking tbody tr[data-project-id]:hover td,
    .ranking tbody tr[data-line-id]:hover td { background: color-mix(in srgb, #2563eb 6%, transparent); }
    .ranking tbody tr.selected td { background: color-mix(in srgb, #2563eb 14%, transparent); }
    .ranking.lines { table-layout: fixed; }
    .ranking.lines .clip {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    @media (prefers-color-scheme: dark) {
      .aside-head,
      .fit + .fit,
      .ranking th,
      .ranking td { border-color: #3f3f46; }
    }
    h1 {
      flex: 0 0 auto;
      margin: 0;
      padding: 12px 14px;
      font-size: 22px;
      border-bottom: 1px solid #8884;
    }
    .details-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
    #rescore { font: inherit; font-size: 14px; }
    .claims, .line-details { display: none; }
    body.show-details .claims,
    body.show-details .line-details { display: block; }
    h2 { font-size: 13px; margin: 0 0 4px; word-break: break-all; }
    .card { border: 1px solid #8884; border-radius: 6px; padding: 10px 12px; margin: 0 0 10px; }
    .line-card, .project-card { cursor: pointer; }
    .line-card:hover, .line-card:focus, .project-card:hover, .project-card:focus { outline: 2px solid #2563eb; }
    .line-card.selected, .project-card.selected { border-color: #2563eb; background: color-mix(in srgb, #2563eb 8%, transparent); }
    .card.dimmed, .line-card.no-concepts { opacity: 0.28; }
    .line-hit { display: none; margin: 0 0 8px; padding: 8px 10px; border-radius: 4px; background: #dbeafe; color: #1e3a8a; font-size: 12px; }
    .line-hit.open { display: flex; align-items: stretch; gap: 12px; }
    .hit-score {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      font-size: 64px;
      font-weight: 700;
      line-height: 0.8;
      letter-spacing: -0.04em;
    }
    .hit-detail { flex: 1; min-width: 0; }
    .line-hit .statement { margin: 4px 0 0; }
    .line-hit .meta-in { margin: 4px 0 0; opacity: 0.85; }
    .project-card:has(.line-hit.open) > .meta { display: none; }
    @media (prefers-color-scheme: dark) {
      .line-hit { background: #1e3a8a; color: #bfdbfe; }
    }
    .meta { margin: 0 0 6px; color: #666; font-size: 12px; }
    .statement { margin: 0 0 6px; }
    .claim { border-top: 1px dashed #8884; margin-top: 8px; padding-top: 8px; }
    .claim-id { font-size: 12px; margin-bottom: 4px; }
    .concepts { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 6px; }
    .concepts li { padding: 2px 6px; border-radius: 4px; background: #e5e7eb; color: #111; font-size: 12px; }
    @media (prefers-color-scheme: dark) {
      .concepts li { background: #374151; color: #f3f4f6; }
    }
    .concepts code { font-size: 11px; }
    .empty { margin: 0; color: #888; font-style: italic; }
    .breakdown { font-size: 12px; opacity: 0.9; }
  </style>
</head>
<body data-project-id="${escapeHtml(focusedProjectId)}" data-line-id="${escapeHtml(focusedLineId)}">
  <aside>
    <div class="aside-head">
      <p class="posting-company">${escapeHtml(view.company)}</p>
      <h2 class="posting-title"><a href="/resume/${escapeHtml(view.entryId)}">${escapeHtml(view.title)}</a></h2>
      <div class="fits">
        ${directionalFitMarkup("Project", projectFit)}
        ${directionalFitMarkup("Line", lineFit)}
      </div>
    </div>
    <div class="aside-scroll">
      <div class="throwaway">scoring ${escapeHtml(scored.scoringVersion)}</div>
      <div class="posting-meta">
        <code>${escapeHtml(view.postingId)}</code>
        <br><code>${escapeHtml(view.entryId)}</code>
        <br>vocab <code>${escapeHtml(vocabVersion ?? "none")}</code>
      </div>
      <table class="ranking" id="project-ranking">
        <thead><tr><th>Id</th><th>Title</th><th>Tags</th><th>Lines</th><th title="Lines with exactly two tags">2×</th><th title="Lines with exactly three tags">3×</th><th title="Lines with four or more tags">4+</th><th>Fit</th></tr></thead>
        <tbody>${rankingHtml || "<tr><td class='empty' colspan='8'>No positive project totals yet</td></tr>"}</tbody>
      </table>
      <table class="ranking lines" id="line-ranking">
        <colgroup>
          <col style="width: 3.2rem" />
          <col />
          <col style="width: 3.6rem" />
          <col style="width: 4.6rem" />
          <col style="width: 2.4rem" />
          <col style="width: 2.4rem" />
          <col style="width: 2.4rem" />
          <col style="width: 3.6rem" />
        </colgroup>
        <thead><tr><th>Line</th><th>Description</th><th>Tags</th><th>Projects</th><th title="Projects with exactly two tags">2×</th><th title="Projects with exactly three tags">3×</th><th title="Projects with four or more tags">4+</th><th>Fit</th></tr></thead>
        <tbody>${lineRankingHtml || "<tr><td class='empty' colspan='8'>No job lines</td></tr>"}</tbody>
      </table>
    </div>
    <div class="aside-toolbar">
      <label class="details-toggle"><input type="checkbox" id="show-details"> details</label>
      <button type="button" id="rescore">Rescore and save</button>
    </div>
  </aside>
  <section>
    <h1>Projects (${projects.length})</h1>
    <div id="projects-pane" class="pane-scroll">
      ${projectHtml || "<p class='empty'>No projects</p>"}
    </div>
  </section>
  <section>
    <h1>Job lines (${view.lines.length})</h1>
    <div id="lines-pane" class="pane-scroll">
      ${lineHtml || "<p class='empty'>No job lines</p>"}
    </div>
  </section>
  <script type="application/json" id="line-data">${JSON.stringify(linePayload).replace(/</g, "\\u003c")}</script>
  <script>
    (function () {
      const showDetails = document.getElementById("show-details");
      showDetails.addEventListener("change", () => {
        document.body.classList.toggle("show-details", showDetails.checked);
      });
      const rescore = document.getElementById("rescore");
      rescore.addEventListener("click", async () => {
        rescore.disabled = true;
        rescore.textContent = "Saving…";
        try {
          const response = await fetch(location.pathname + location.search, { method: "POST" });
          const body = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(body.error || "Save failed");
          location.reload();
        } catch (error) {
          rescore.disabled = false;
          rescore.textContent = "Rescore and save";
          alert(error && error.message ? error.message : "Save failed");
        }
      });
      const data = JSON.parse(document.getElementById("line-data").textContent);
      const byId = Object.fromEntries(data.map((row) => [row.lineEntryId, row]));
      const pane = document.getElementById("projects-pane");
      const linesPane = document.getElementById("lines-pane");
      const projectCards = [...document.querySelectorAll("#projects-pane [data-project-id]")];
      const lineCards = [...document.querySelectorAll("#lines-pane .line-card")];
      const projectRows = [...document.querySelectorAll("#project-ranking tbody tr[data-project-id]")];
      const lineRows = [...document.querySelectorAll("#line-ranking tbody tr[data-line-id]")];
      const originalProjects = [...projectCards];
      const originalLines = [...lineCards];
      const originalClaims = new Map(
        projectCards.map((card) => [
          card,
          [...card.querySelectorAll(".claim")],
        ]),
      );

      function restoreOrder() {
        for (const card of originalProjects) pane.appendChild(card);
        for (const [card, claims] of originalClaims) {
          const list = card.querySelector(".claims");
          if (!list) continue;
          for (const claim of claims) list.appendChild(claim);
        }
      }

      function sortByLine(byProject) {
        const ordered = [...projectCards].sort((a, b) => {
          const aHit = byProject[a.getAttribute("data-project-id")];
          const bHit = byProject[b.getAttribute("data-project-id")];
          const aPoints = aHit ? aHit.points : 0;
          const bPoints = bHit ? bHit.points : 0;
          if (bPoints !== aPoints) return bPoints - aPoints;
          return a.getAttribute("data-project-id").localeCompare(b.getAttribute("data-project-id"));
        });
        for (const card of ordered) pane.appendChild(card);
        for (const card of ordered) {
          const hit = byProject[card.getAttribute("data-project-id")];
          const list = card.querySelector(".claims");
          if (!list || !hit) continue;
          const preferred = new Set(hit.evidenceIds || []);
          const claims = [...list.querySelectorAll(".claim")];
          claims.sort((a, b) => {
            const aOn = preferred.has(a.getAttribute("data-claim-id")) ? 1 : 0;
            const bOn = preferred.has(b.getAttribute("data-claim-id")) ? 1 : 0;
            return bOn - aOn;
          });
          for (const claim of claims) list.appendChild(claim);
        }
      }

      function clearLineHits(cards) {
        cards.forEach((el) => {
          const slot = el.querySelector(".line-hit");
          if (!slot) return;
          slot.classList.remove("open");
          slot.hidden = true;
          slot.innerHTML = "";
        });
      }

      function restoreLines() {
        for (const card of originalLines) linesPane.appendChild(card);
        lineCards.forEach((el) => el.classList.remove("dimmed"));
        clearLineHits(lineCards);
      }

      function clearProjectFocus() {
        projectCards.forEach((el) => el.classList.remove("selected"));
        restoreLines();
      }

      function escapeText(value) {
        return String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function clear() {
        document.body.classList.remove("line-selected");
        projectCards.forEach((el) => {
          el.classList.remove("dimmed");
          const slot = el.querySelector(".line-hit");
          if (slot) {
            slot.classList.remove("open");
            slot.hidden = true;
            slot.innerHTML = "";
          }
        });
        lineCards.forEach((el) => el.classList.remove("selected"));
        projectRows.forEach((row) => row.classList.remove("selected"));
        lineRows.forEach((row) => row.classList.remove("selected"));
        restoreOrder();
        clearProjectFocus();
      }

      function select(lineId) {
        const row = byId[lineId];
        if (!row) return;
        clear();
        document.body.classList.add("line-selected");
        lineCards.forEach((el) => {
          el.classList.toggle("selected", el.getAttribute("data-line-id") === lineId);
        });
        lineRows.forEach((row) => {
          row.classList.toggle("selected", row.getAttribute("data-line-id") === lineId);
        });
        const lineCard = lineCards.find((el) => el.getAttribute("data-line-id") === lineId);
        if (lineCard) lineCard.scrollIntoView({ block: "nearest" });
        const hits = row.hits || [];
        const byProject = Object.fromEntries(hits.map((h) => [h.projectId, h]));
        const hitIds = new Set(hits.map((h) => h.projectId));
        projectCards.forEach((el) => {
          const id = el.getAttribute("data-project-id");
          const slot = el.querySelector(".line-hit");
          const hit = byProject[id];
          el.classList.toggle("dimmed", hitIds.size > 0 && !hit);
          if (!slot) return;
          if (!hit) {
            slot.classList.remove("open");
            slot.hidden = true;
            slot.innerHTML = "";
            return;
          }
          const axes = hit.conceptHits + " tag(s)";
          const statement = (hit.statements && hit.statements[0]) ? hit.statements[0] : "";
          const meta = el.querySelector(".meta");
          slot.hidden = false;
          slot.classList.add("open");
          slot.innerHTML =
            "<div class='hit-score'>" + escapeText(hit.conceptHits) + "</div>" +
            "<div class='hit-detail'>" +
            "<div class='breakdown'>" + escapeText(axes) +
            (hit.overlapIds && hit.overlapIds.length ? " · " + escapeText(hit.overlapIds.join(", ")) : "") +
            "</div>" +
            (statement ? "<div class='statement'>" + escapeText(statement) + "</div>" : "") +
            (meta ? "<div class='meta-in'>" + escapeText(meta.textContent.trim()) + "</div>" : "") +
            "</div>";
        });
        sortByLine(byProject);
        pane.scrollTop = 0;
      }

      function selectProject(projectId) {
        clear();
        projectCards.forEach((el) => {
          el.classList.toggle("selected", el.getAttribute("data-project-id") === projectId);
        });
        projectRows.forEach((row) => {
          row.classList.toggle("selected", row.getAttribute("data-project-id") === projectId);
        });
        const projectCard = projectCards.find((el) => el.getAttribute("data-project-id") === projectId);
        if (projectCard) projectCard.scrollIntoView({ block: "nearest" });
        const hitByLine = {};
        for (const row of data) {
          const hit = (row.hits || []).find((h) => h.projectId === projectId);
          if (hit) hitByLine[row.lineEntryId] = hit;
        }
        const pointsOf = (el) => {
          const hit = hitByLine[el.getAttribute("data-line-id")];
          return hit ? hit.points : 0;
        };
        const ordered = [...lineCards].sort((a, b) => {
          const diff = pointsOf(b) - pointsOf(a);
          if (diff !== 0) return diff;
          return a.getAttribute("data-line-id").localeCompare(b.getAttribute("data-line-id"));
        });
        for (const card of ordered) linesPane.appendChild(card);
        const any = ordered.some((el) => pointsOf(el) > 0);
        lineCards.forEach((el) => {
          const hit = hitByLine[el.getAttribute("data-line-id")];
          const slot = el.querySelector(".line-hit");
          el.classList.toggle("dimmed", any && !hit);
          if (!slot) return;
          if (!hit) {
            slot.classList.remove("open");
            slot.hidden = true;
            slot.innerHTML = "";
            return;
          }
          const axes = hit.conceptHits + " tag(s)";
          slot.hidden = false;
          slot.classList.add("open");
          slot.innerHTML =
            "<div class='hit-score'>" + escapeText(hit.conceptHits) + "</div>" +
            "<div class='hit-detail'>" +
            "<div class='breakdown'>" + escapeText(axes) +
            (hit.overlapIds && hit.overlapIds.length ? " · " + escapeText(hit.overlapIds.join(", ")) : "") +
            "</div></div>";
        });
        linesPane.scrollTop = 0;
      }

      lineCards.forEach((el) => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-line-id");
          if (el.classList.contains("selected")) clear();
          else select(id);
        });
        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            el.click();
          }
        });
      });

      projectCards.forEach((el) => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-project-id");
          if (el.classList.contains("selected")) clear();
          else selectProject(id);
        });
        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            el.click();
          }
        });
      });

      projectRows.forEach((row) => {
        row.addEventListener("click", () => {
          const id = row.getAttribute("data-project-id");
          if (row.classList.contains("selected")) clear();
          else selectProject(id);
        });
      });

      lineRows.forEach((row) => {
        row.addEventListener("click", () => {
          const id = row.getAttribute("data-line-id");
          if (row.classList.contains("selected")) clear();
          else select(id);
        });
      });

      const initialLine = document.body.getAttribute("data-line-id");
      const initialProject = document.body.getAttribute("data-project-id");
      if (initialLine) select(initialLine);
      else if (initialProject) selectProject(initialProject);
    })();
  </script>
</body>
</html>`;

    return htmlResponse(body);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to render match concepts";
    return htmlResponse(
      `<!doctype html><title>Error</title><pre>${escapeHtml(message)}</pre>`,
      500,
    );
  }
}
