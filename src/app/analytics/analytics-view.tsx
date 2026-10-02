"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JzButton, JzTab, JzTabGroup, JzTag, JzText } from "@jobzeug/design-system/react";

import { EvidencePageHeader } from "@/components/evidence-page-header";
import { recencyWeight } from "@/lib/matching/recency";

import styles from "./analytics.module.css";
import type {
  AnalyticsClaim,
  AnalyticsConcept,
  AnalyticsHit,
  AnalyticsLine,
  AnalyticsLineRow,
  AnalyticsPageData,
  AnalyticsProject,
  AnalyticsProjectRow,
} from "./load";

type Focus = { kind: "line" | "project"; id: string } | null;
type RankingTab = "projects" | "lines";

function selectedTabFromChange(event: Event) {
  const detail = (event as CustomEvent<{ selectedTab?: string }>).detail;
  return typeof detail?.selectedTab === "string" ? detail.selectedTab : null;
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function initialFocus(data: AnalyticsPageData): Focus {
  if (
    data.focusedLineId &&
    data.lines.some((line) => line.selectable && line.id === data.focusedLineId)
  ) {
    return { kind: "line", id: data.focusedLineId };
  }
  if (data.focusedProjectId) return { kind: "project", id: data.focusedProjectId };
  return null;
}

function orderedClaims(claims: readonly AnalyticsClaim[], evidenceIds: readonly string[]) {
  if (evidenceIds.length === 0) return claims;
  const preferred = new Set(evidenceIds);
  return [...claims].sort((a, b) => {
    const aOn = preferred.has(a.id) ? 1 : 0;
    const bOn = preferred.has(b.id) ? 1 : 0;
    return bOn - aOn;
  });
}

function Concepts({ concepts }: { concepts: readonly AnalyticsConcept[] }) {
  if (concepts.length === 0) {
    return <JzText variant="caption" color="muted" label="No concepts" />;
  }
  return (
    <ul className={styles.concepts}>
      {concepts.map((concept) => (
        <li key={concept.id}>
          <JzTag variant="default" label={`${concept.id} ${concept.label}`} />
        </li>
      ))}
    </ul>
  );
}

function HitPanel({
  hit,
  statement,
  meta,
}: {
  hit: AnalyticsHit;
  statement?: string;
  meta?: string;
}) {
  const axes = `${hit.conceptHits} tag(s)`;
  const breakdown =
    hit.overlapIds.length > 0 ? `${axes} · ${hit.overlapIds.join(", ")}` : axes;
  return (
    <div className={styles.hit}>
      <JzText variant="display-large" label={String(hit.conceptHits)} />
      <div className={styles.hitDetail}>
        <JzText variant="caption" color="secondary" label={breakdown} />
        {statement ? <JzText variant="body-default" label={statement} /> : null}
        {meta ? <JzText variant="caption" color="muted" label={meta} /> : null}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  selected,
  dimmed,
  hit,
  onSelect,
}: {
  project: AnalyticsProject;
  selected: boolean;
  dimmed: boolean;
  hit: AnalyticsHit | null;
  onSelect: () => void;
}) {
  const claims = orderedClaims(project.claims, hit?.evidenceIds ?? []);
  return (
    <button
      type="button"
      id={`analytics-project-${project.id}`}
      className={classNames(styles.card, selected && styles.cardSelected, dimmed && styles.dimmed)}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <JzText variant="heading3" label={`${project.id} — ${project.title}`} />
      {hit ? (
        <HitPanel hit={hit} statement={hit.statement} meta={project.meta} />
      ) : (
        <JzText variant="caption" color="muted" label={project.meta} />
      )}
      <div className={styles.details}>
        {claims.length === 0 ? (
          <JzText variant="caption" color="muted" label="No claims" />
        ) : (
          claims.map((claim) => (
            <div key={claim.id} className={styles.claim}>
              <JzText
                variant="caption"
                color="secondary"
                label={`${claim.id} · ${claim.status}`}
              />
              {claim.statement ? (
                <JzText variant="body-default" label={claim.statement} />
              ) : null}
              <Concepts concepts={claim.concepts} />
            </div>
          ))
        )}
      </div>
    </button>
  );
}

function LineCard({
  line,
  selected,
  dimmed,
  hit,
  onSelect,
}: {
  line: AnalyticsLine;
  selected: boolean;
  dimmed: boolean;
  hit: AnalyticsHit | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      id={`analytics-line-${line.id}`}
      className={classNames(
        styles.card,
        selected && styles.cardSelected,
        (dimmed || line.noConcepts) && styles.dimmed,
        line.noConcepts && styles.quiet,
      )}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <JzText variant="heading3" label={line.id} />
      {hit ? <HitPanel hit={hit} /> : null}
      <JzText variant="caption" color="muted" label={line.meta} />
      <JzText variant="body-default" label={line.text} />
      <div className={styles.details}>
        <Concepts concepts={line.concepts} />
      </div>
    </button>
  );
}

function ProjectRanking({
  rows,
  selectedId,
  onSelect,
}: {
  rows: readonly AnalyticsProjectRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th><JzText variant="overline" color="muted" label="Id" /></th>
          <th><JzText variant="overline" color="muted" label="Title" /></th>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Tags" /></th>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Lines" /></th>
          <th className={styles.num} title="Lines with exactly two tags"><JzText variant="overline" color="muted" label="2×" /></th>
          <th className={styles.num} title="Lines with exactly three tags"><JzText variant="overline" color="muted" label="3×" /></th>
          <th className={styles.num} title="Lines with four or more tags"><JzText variant="overline" color="muted" label="4+" /></th>
          <th className={styles.num} title="Recency weight. Full credit through five years, then it falls off."><JzText variant="overline" color="muted" label="Age" /></th>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Fit" /></th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={9}>
              <JzText variant="caption" color="muted" label="No positive project totals yet" />
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={row.projectId}
              className={selectedId === row.projectId ? styles.rowSelected : undefined}
              onClick={() => onSelect(row.projectId)}
            >
              <td><JzText variant="caption" label={row.projectId} /></td>
              <td><JzText variant="caption" color="secondary" label={row.title} /></td>
              <td className={styles.num}><JzText variant="caption" label={row.tags} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.lines)} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.two)} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.three)} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.four)} /></td>
              <td className={styles.num} title={row.age.title}>
                <JzText variant="caption" label={row.age.text} />
              </td>
              <td className={styles.num}><JzText variant="caption" label={row.fit} /></td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function LineRanking({
  rows,
  selectedId,
  onSelect,
}: {
  rows: readonly AnalyticsLineRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <table className={classNames(styles.table, styles.lines)}>
      <colgroup>
        <col style={{ width: "3.2rem" }} />
        <col />
        <col style={{ width: "3.6rem" }} />
        <col style={{ width: "4.6rem" }} />
        <col style={{ width: "2.4rem" }} />
        <col style={{ width: "2.4rem" }} />
        <col style={{ width: "2.4rem" }} />
        <col style={{ width: "3.6rem" }} />
      </colgroup>
      <thead>
        <tr>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Line" /></th>
          <th><JzText variant="overline" color="muted" label="Description" /></th>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Tags" /></th>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Projects" /></th>
          <th className={styles.num} title="Projects with exactly two tags"><JzText variant="overline" color="muted" label="2×" /></th>
          <th className={styles.num} title="Projects with exactly three tags"><JzText variant="overline" color="muted" label="3×" /></th>
          <th className={styles.num} title="Projects with four or more tags"><JzText variant="overline" color="muted" label="4+" /></th>
          <th className={styles.num}><JzText variant="overline" color="muted" label="Fit" /></th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={8}>
              <JzText variant="caption" color="muted" label="No job lines" />
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={row.lineId}
              className={selectedId === row.lineId ? styles.rowSelected : undefined}
              onClick={() => onSelect(row.lineId)}
            >
              <td className={styles.num}><JzText variant="caption" label={row.number} /></td>
              <td className={styles.clip} title={row.text}>
                <span className={styles.clipText}>{row.text}</span>
              </td>
              <td className={styles.num}><JzText variant="caption" label={row.tags} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.projects)} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.two)} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.three)} /></td>
              <td className={styles.num}><JzText variant="caption" label={String(row.four)} /></td>
              <td className={styles.num}><JzText variant="caption" label={row.fit} /></td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function AnalyticsNotice({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={styles.notice}>
      <JzText level={1} variant="heading" label={title} />
      <JzText variant="body-default" color="muted" label={detail} />
    </div>
  );
}

export function AnalyticsView({ data }: { data: AnalyticsPageData }) {
  const [focus, setFocus] = useState<Focus>(() => initialFocus(data));
  const [details, setDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rankingTab, setRankingTab] = useState<RankingTab>("projects");
  const projectsPane = useRef<HTMLDivElement>(null);
  const linesPane = useRef<HTMLDivElement>(null);

  const focusedLine =
    focus?.kind === "line"
      ? data.lines.find((line) => line.id === focus.id) ?? null
      : null;
  const focusedProjectId = focus?.kind === "project" ? focus.id : null;

  const projects = useMemo(() => {
    if (!focusedLine) return data.projects;
    const points = new Map(focusedLine.hits.map((hit) => [hit.projectId, hit.points]));
    return [...data.projects].sort((a, b) => {
      const diff =
        (points.get(b.id) ?? 0) * recencyWeight(b.year) -
        (points.get(a.id) ?? 0) * recencyWeight(a.year);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });
  }, [data.projects, focusedLine]);

  const lines = useMemo(() => {
    if (!focusedProjectId) return data.lines;
    const year = data.projects.find((project) => project.id === focusedProjectId)?.year;
    const weight = recencyWeight(year);
    const pointsOf = (line: AnalyticsLine) =>
      (line.hits.find((hit) => hit.projectId === focusedProjectId)?.points ?? 0) * weight;
    return [...data.lines].sort((a, b) => {
      const diff = pointsOf(b) - pointsOf(a);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });
  }, [data.lines, data.projects, focusedProjectId]);

  useEffect(() => {
    if (!focus) return;
    if (focus.kind === "line") {
      if (projectsPane.current) projectsPane.current.scrollTop = 0;
      document
        .getElementById(`analytics-line-${focus.id}`)
        ?.scrollIntoView({ block: "nearest" });
      return;
    }
    if (linesPane.current) linesPane.current.scrollTop = 0;
    document
      .getElementById(`analytics-project-${focus.id}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [focus]);

  const selectLine = (id: string) => {
    const line = data.lines.find((item) => item.id === id);
    if (!line?.selectable) return;
    setFocus((current) =>
      current?.kind === "line" && current.id === id ? null : { kind: "line", id },
    );
  };

  const selectProject = (id: string) => {
    setFocus((current) =>
      current?.kind === "project" && current.id === id ? null : { kind: "project", id },
    );
  };

  const lineHasPoints = focusedProjectId
    ? lines.some((line) =>
        line.hits.some((hit) => hit.projectId === focusedProjectId && hit.points > 0),
      )
    : false;

  async function rescore() {
    setSaving(true);
    try {
      const response = await fetch(
        `/api/analytics/rescore?jobPostingEntryId=${encodeURIComponent(data.entryId)}`,
        { method: "POST" },
      );
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(body.error || "Save failed");
      location.reload();
    } catch (error) {
      setSaving(false);
      const message = error instanceof Error ? error.message : "Save failed";
      alert(message);
    }
  }

  return (
    <div className={styles.page} data-details={details ? "" : undefined}>
      <aside className={styles.column}>
        <EvidencePageHeader>
          <div className={styles.titleRow}>
            <div className={styles.titleBlock}>
              <JzText
                variant="overline"
                color="muted"
                label={data.company}
                className={styles.title}
              />
              <JzText
                level={1}
                variant="heading"
                href={`/resume/${data.entryId}`}
                label={data.title}
                className={styles.title}
              />
            </div>
            <div className={styles.totalBlock}>
              <JzText variant="overline" color="muted" label="Total" />
              <JzText
                variant="display"
                label={data.projectFit ? String(data.projectFit.score) : "—"}
              />
            </div>
            <div className={styles.metaBlock}>
              <JzText
                variant="overline"
                color="muted"
                label={`scoring ${data.scoringVersion}`}
              />
              <JzText variant="overline" color="muted" label={data.postingId} />
              <JzText variant="overline" color="muted" label={data.entryId} />
              <JzText
                variant="overline"
                color="muted"
                label={`vocab ${data.vocabVersion ?? "none"}`}
              />
            </div>
          </div>
        </EvidencePageHeader>
        <div className={styles.tableTabs}>
          <JzTabGroup
            aria-label="Rankings"
            selectedTab={rankingTab}
            onChange={(event: Event) => {
              const next = selectedTabFromChange(event);
              if (next === "projects" || next === "lines") setRankingTab(next);
            }}
          >
            <JzTab label="Projects" value="projects" />
            <JzTab label="Job lines" value="lines" />
          </JzTabGroup>
        </div>
        <div className={styles.scroll}>
          {rankingTab === "projects" ? (
            <ProjectRanking
              rows={data.projectRows}
              selectedId={focusedProjectId}
              onSelect={selectProject}
            />
          ) : (
            <LineRanking
              rows={data.lineRows}
              selectedId={focusedLine?.id ?? null}
              onSelect={selectLine}
            />
          )}
        </div>
        <div className={styles.toolbar}>
          <label className={styles.detailsToggle}>
            <input
              type="checkbox"
              checked={details}
              onChange={(event) => setDetails(event.target.checked)}
            />
            <JzText variant="caption" color="secondary" label="details" />
          </label>
          <JzButton
            label={saving ? "Saving…" : "Rescore and save"}
            variant="secondary"
            showIcon={false}
            disabled={saving}
            onClick={() => {
              void rescore();
            }}
          />
        </div>
      </aside>
      <section className={styles.column}>
        <EvidencePageHeader>
          <JzText
            level={2}
            variant="heading"
            label={`Projects (${data.projects.length})`}
          />
        </EvidencePageHeader>
        <div ref={projectsPane} className={styles.scroll}>
          {projects.length === 0 ? (
            <JzText variant="caption" color="muted" label="No projects" />
          ) : (
            <div className={styles.stack}>
              {projects.map((project) => {
                const hit = focusedLine
                  ? focusedLine.hits.find((item) => item.projectId === project.id) ?? null
                  : null;
                const dimmed = Boolean(focusedLine && focusedLine.hits.length > 0 && !hit);
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    selected={focusedProjectId === project.id}
                    dimmed={dimmed}
                    hit={hit}
                    onSelect={() => selectProject(project.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className={styles.column}>
        <EvidencePageHeader>
          <JzText
            level={2}
            variant="heading"
            label={`Job lines (${data.lines.length})`}
          />
        </EvidencePageHeader>
        <div ref={linesPane} className={styles.scroll}>
          {lines.length === 0 ? (
            <JzText variant="caption" color="muted" label="No job lines" />
          ) : (
            <div className={styles.stack}>
              {lines.map((line) => {
                const hit = focusedProjectId
                  ? line.hits.find((item) => item.projectId === focusedProjectId) ?? null
                  : null;
                const dimmed = Boolean(focusedProjectId && lineHasPoints && !hit);
                return (
                  <LineCard
                    key={line.id}
                    line={line}
                    selected={focusedLine?.id === line.id}
                    dimmed={dimmed}
                    hit={focusedProjectId ? hit : null}
                    onSelect={() => selectLine(line.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
