/**
 * THROWAWAY — project claims vs job lines, plus click-to-see line relationships
 * from the real Match scorer (cumulative v2 points).
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { loadJobPostingByEntryId } from "@/lib/job-posting";
import { loadMatchingCatalog } from "@/lib/matching/catalog";
import { computeFits, type JobPostFit, type JobRelevancy, type ResumeFit } from "@/lib/matching/fit";
import { scorePostingAgainstCatalog } from "@/lib/matching/score";
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

function fitMarkup(
  label: string,
  fit: JobPostFit | ResumeFit | JobRelevancy | null,
): string {
  if (!fit) {
    return `<div class="fit"><div class="fit-label">${escapeHtml(label)}</div><div class="fit-score">—</div></div>`;
  }
  const pct = fit.ceiling > 0 ? Math.round((fit.score / fit.ceiling) * 100) : 0;
  return `<div class="fit"><div class="fit-label">${escapeHtml(label)}</div><div class="fit-score">${escapeHtml(fit.score)} <span class="fit-pct">${escapeHtml(pct)}%</span></div><div class="fit-ceiling">of ${escapeHtml(fit.ceiling)}</div></div>`;
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
  ownership?: string;
  scope?: string;
  delivery_stage?: string;
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

function fmtList(values: string[]): string {
  return values.length ? values.join(", ") : "—";
}

function attrList(rows: Array<{ label: string; value: string }>): string {
  return `<ul class="attrs">${rows
    .map(
      (row) =>
        `<li><strong>${escapeHtml(row.label)}</strong> ${escapeHtml(row.value)}</li>`,
    )
    .join("")}</ul>`;
}

export async function GET(req: NextRequest) {
  const session = await requireSiteSession();
  if ("error" in session) return session.error;

  const raw = req.nextUrl.searchParams.get("jobPostingEntryId");
  const parsed = jobPostingEntryIdSchema.safeParse(raw ?? "");
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
    const fits = computeFits({ posting: view, catalog });

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
    const projects = [...catalog.projects.values()].sort((a, b) =>
      a.project_id.localeCompare(b.project_id),
    );

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
  ${attrList([
    { label: "ownership", value: String(claim.ownership ?? "—") },
    { label: "scope", value: String(claim.scope ?? "—") },
    { label: "stage", value: String(claim.delivery_stage ?? "—") },
  ])}
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

    const lineHtml = view.lines
      .map((line) => {
        const req = line.matchingRequirement;
        const conceptIds = [
          ...new Set([
            ...(req?.concept_ids ?? []),
            ...(req?.constraints?.tool_concept_ids ?? []),
          ]),
        ].sort();
        const ownership = req?.constraints?.ownership ?? [];
        const scope = req?.constraints?.scope ?? [];
        const stage = req?.constraints?.delivery_stage ?? [];
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
  ${attrList([
    { label: "ownership", value: fmtList(ownership) },
    { label: "scope", value: fmtList(scope) },
    { label: "stage", value: fmtList(stage) },
  ])}
  ${renderConcepts(conceptIds)}
  </div>
</article>`;
      })
      .join("\n");

    const rankingHtml = scored.projects
      .filter((p) => p.score != null && p.score > 0)
      .slice(0, 12)
      .map(
        (p) =>
          `<li><code>${escapeHtml(p.projectId)}</code> ${escapeHtml(titleByProjectId.get(p.projectId) ?? "")} — <strong>${escapeHtml(p.score)}</strong></li>`,
      )
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
  <title>THROWAWAY — ${escapeHtml(view.postingId)}</title>
  <style>
    :root { color-scheme: light dark; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font: 14px/1.4 system-ui, sans-serif;
      display: grid;
      grid-template-columns: 440px minmax(0, 1fr) minmax(0, 1fr);
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
    .fits { display: flex; flex-direction: column; gap: 12px; margin: 0 0 16px; }
    .fit { text-align: left; }
    .fit-label { font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: #666; }
    .fit-score { font-size: 28px; font-weight: 700; line-height: 1.1; }
    .fit-pct { font-size: 16px; font-weight: 600; color: #666; }
    .fit-ceiling { font-size: 12px; color: #666; }
    .throwaway { color: #b45309; font-weight: 600; margin: 0 0 8px; }
    .posting-meta { margin: 0 0 12px; word-break: break-word; }
    .ranking { margin: 8px 0 0; padding-left: 1.2rem; font-size: 12px; }
    h1 {
      flex: 0 0 auto;
      margin: 0;
      padding: 12px 14px;
      font-size: 22px;
      border-bottom: 1px solid #8884;
    }
    .details-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
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
    .attrs { list-style: none; padding: 0; margin: 0 0 8px; font-size: 12px; }
    .attrs li { margin: 0 0 2px; }
    .attrs strong { margin-right: 0.35em; }
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
<body>
  <aside>
    <div class="aside-scroll">
      <div class="fits">
        ${fitMarkup("Job post", fits.jobPostFit)}
        ${fitMarkup("Resume", fits.resumeFit)}
        ${fitMarkup("Relevancy", fits.jobRelevancy)}
      </div>
      <div class="throwaway">THROWAWAY — scoring ${escapeHtml(scored.scoringVersion)}</div>
      <div class="posting-meta">
        ${escapeHtml(view.company)} — ${escapeHtml(view.title)}
        <br><code>${escapeHtml(view.postingId)}</code>
        <br><code>${escapeHtml(view.entryId)}</code>
        <br>vocab <code>${escapeHtml(vocabVersion ?? "none")}</code>
      </div>
      <ol class="ranking">${rankingHtml || "<li class='empty'>No positive project totals yet</li>"}</ol>
    </div>
    <div class="aside-toolbar">
      <label class="details-toggle"><input type="checkbox" id="show-details"> details</label>
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
      const data = JSON.parse(document.getElementById("line-data").textContent);
      const byId = Object.fromEntries(data.map((row) => [row.lineEntryId, row]));
      const pane = document.getElementById("projects-pane");
      const linesPane = document.getElementById("lines-pane");
      const projectCards = [...document.querySelectorAll("[data-project-id]")];
      const lineCards = [...document.querySelectorAll(".line-card")];
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
          const axes = [
            hit.conceptHits + " concept(s)",
            hit.ownershipHit ? "ownership" : null,
            hit.scopeHit ? "scope" : null,
            hit.stageHit ? "stage" : null,
          ].filter(Boolean).join(" · ");
          const statement = (hit.statements && hit.statements[0]) ? hit.statements[0] : "";
          const meta = el.querySelector(".meta");
          slot.hidden = false;
          slot.classList.add("open");
          slot.innerHTML =
            "<div class='hit-score'>" + escapeText(hit.points) + "</div>" +
            "<div class='hit-detail'>" +
            "<div class='breakdown'>" + escapeText(axes) +
            (hit.overlapIds && hit.overlapIds.length ? " · " + escapeText(hit.overlapIds.join(", ")) : "") +
            "</div>" +
            (statement ? "<div class='statement'>" + escapeText(statement) + "</div>" : "") +
            (meta ? "<div class='meta-in'>" + escapeText(meta.textContent.trim()) + "</div>" : "") +
            "</div>";
        });
        sortByLine(byProject);
      }

      function selectProject(projectId) {
        clear();
        projectCards.forEach((el) => {
          el.classList.toggle("selected", el.getAttribute("data-project-id") === projectId);
        });
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
          const axes = [
            hit.conceptHits + " concept(s)",
            hit.ownershipHit ? "ownership" : null,
            hit.scopeHit ? "scope" : null,
            hit.stageHit ? "stage" : null,
          ].filter(Boolean).join(" · ");
          slot.hidden = false;
          slot.classList.add("open");
          slot.innerHTML =
            "<div class='hit-score'>" + escapeText(hit.points) + "</div>" +
            "<div class='hit-detail'>" +
            "<div class='breakdown'>" + escapeText(axes) +
            (hit.overlapIds && hit.overlapIds.length ? " · " + escapeText(hit.overlapIds.join(", ")) : "") +
            "</div></div>";
        });
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
