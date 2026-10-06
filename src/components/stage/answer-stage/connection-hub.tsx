"use client";

import { useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import Markdown from "react-markdown";
import { JzButton, JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";
import { useJobPosting } from "@/components/job-posting";
import { useResumeHighlights } from "@/components/resume";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import { useActiveConnectionTarget } from "@/components/resume/use-connection-target";
import type {
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import type { JobPostingPanelData } from "@/lib/job-posting/schema";
import {
  coverageLineIds,
  lineExampleCoverage,
  lineFitBars,
  projectFitBars,
  strongExampleProjects,
  type FitBar,
  type HomeProject,
} from "@/lib/matching/home-coverage";
import {
  ProjectVideo,
  sameProjectId,
} from "@/components/resume/project-presentation/project-presentation";

import styles from "./answer-stage.module.css";

function SummaryCopy({ text }: { text: string }) {
  return (
    <Markdown
      components={{
        p: ({ children }: ComponentPropsWithoutRef<"p">) => (
          <JzText variant="body-default">{children}</JzText>
        ),
        a: ({ href, children }: ComponentPropsWithoutRef<"a">) =>
          href?.startsWith("https://") || href?.startsWith("http://") ? (
            <JzText href={href} target="_blank" variant="body-default">
              {children}
            </JzText>
          ) : (
            <span>{children}</span>
          ),
      }}
    >
      {text}
    </Markdown>
  );
}

const SECTION_LABELS: Record<string, string> = {
  description: "Job description",
  responsibility: "Job responsibility",
  required: "Job requirement",
  preferred: "Preferred job requirement",
};

const IDLE_COPY = "Select a project or a job line.";

function resumeProjects(resume: ResumeViewModel | null): HomeProject[] {
  if (!resume) return [];
  const projects: HomeProject[] = [];
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      for (const project of role.projects) {
        projects.push({ id: project.evidenceId, name: project.name });
      }
    }
  }
  return projects;
}

function HomeStat({
  value,
  detail,
  title,
}: {
  value: string;
  detail: string;
  title?: string;
}) {
  return (
    <div className={styles.homeStat}>
      {title ? (
        <JzText variant="overline" color="muted" label={title} />
      ) : null}
      <span className={styles.homeStatValue}>{value}</span>
      <JzText variant="caption" color="muted" label={detail} />
    </div>
  );
}

function HomeLanding({
  resume,
  posting,
}: {
  resume: ResumeViewModel | null;
  posting: JobPostingPanelData;
}) {
  const edges = posting.matchGraph?.edges ?? [];
  const projects = resumeProjects(resume);
  const projectIds = projects.map((project) => project.id);
  const lines = coverageLineIds(posting.lines);
  const required = lineExampleCoverage(lines.required, edges, projectIds);
  const preferred = lineExampleCoverage(lines.preferred, edges, projectIds);
  const requiredStrong = strongExampleProjects(
    projectIds,
    edges,
    lines.required,
  );
  const preferredStrong = strongExampleProjects(
    projectIds,
    edges,
    lines.preferred,
  );

  return (
    <div className={styles.home}>
      <div className={styles.homePair}>
        <HomeStat
          title="REQUIRED"
          value={`${required.percent}%`}
          detail={`${required.covered} / ${required.total}`}
        />
        <HomeStat
          title="STRONG PROJECTS"
          value={String(requiredStrong)}
          detail="Required"
        />
      </div>
      <div className={`${styles.homePair} ${styles.homeBand}`}>
        <HomeStat
          title="PREFERRED"
          value={`${preferred.percent}%`}
          detail={`${preferred.covered} / ${preferred.total}`}
        />
        <HomeStat
          title="STRONG PROJECTS"
          value={String(preferredStrong)}
          detail="Preferred"
        />
      </div>
    </div>
  );
}

function HubHeader({
  label,
  contentfulUrl,
  contentfulLabel,
  analysisUrl,
  score,
  employer,
  projectTotal,
  rowTotal,
  onBack,
  onDismiss,
}: {
  label: string;
  contentfulUrl?: string | null;
  contentfulLabel: string;
  analysisUrl?: string | null;
  score?: FitBar;
  employer?: string;
  /** Resume project count. Present on a job-line focus. */
  projectTotal?: number;
  /** Project-scoped job line count. Present on a project focus. */
  rowTotal?: number;
  onBack?: () => void;
  /** Close the project page. Lines stay with the job line. */
  onDismiss?: () => void;
}) {
  const { clearLineFocus } = useResumeHighlights();
  const rows = score?.rows ?? 0;
  const tags = score?.tags ?? 0;
  const tagLabel = Number.isInteger(tags) ? String(tags) : tags.toFixed(1);
  const countLabel =
    projectTotal != null
      ? `${rows} / ${projectTotal} ${projectTotal === 1 ? "project" : "projects"}`
      : rowTotal != null
        ? `${rows} / ${rowTotal} ${rowTotal === 1 ? "row" : "rows"}`
        : `${rows} ${rows === 1 ? "row" : "rows"}`;
  const stats = `${countLabel} · ${tagLabel} ${tags === 1 ? "tag" : "tags"} · ${score?.percent ?? 0}% overall`;
  return (
    <div className={styles.hubIntro}>
      <div className={styles.hubHeader}>
        <div className={styles.hubTitleRow}>
          <JzText
            level={1}
            variant="heading"
            label={label}
            className={styles.hubTitle}
          />
        </div>
        <div className={styles.hubHeaderTools}>
          {analysisUrl ? (
            <JzIconButton
              className={styles.hubLink}
              label="Open match analysis"
              icon="ChartBar"
              title="Analysis"
              onClick={() => {
                window.open(analysisUrl, "jobzeug-debug");
              }}
            />
          ) : null}
          {contentfulUrl ? (
            <JzIconButton
              className={styles.hubLink}
              label={contentfulLabel}
              icon="ArrowSquareOut"
              title="Contentful"
              onClick={() => {
                window.open(contentfulUrl, "jobzeug-contentful");
              }}
            />
          ) : null}
          <JzIconButton
            className={styles.hubLink}
            label={onBack ? "Done" : onDismiss ? "Close" : "Home"}
            icon="X"
            title={onBack ? "Done" : onDismiss ? "Close" : "Home"}
            onClick={onBack ?? onDismiss ?? clearLineFocus}
          />
        </div>
      </div>
      {score ? (
        <JzText
          variant="caption"
          color="muted"
          label={employer ? `${employer} · ${stats}` : stats}
        />
      ) : null}
    </div>
  );
}

function findProject(
  resume: ResumeViewModel | null,
  projectId: string,
): ResumeProject | null {
  return findProjectContext(resume, projectId)?.project ?? null;
}

function findProjectContext(
  resume: ResumeViewModel | null,
  projectId: string,
): { project: ResumeProject; employerName: string } | null {
  if (!resume) return null;
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      const match = role.projects.find(
        (project) => project.evidenceId === projectId,
      );
      if (match) return { project: match, employerName: employer.name };
    }
  }
  return null;
}

function briefKey(kind: "project" | "jobLine", id: string): string {
  return `${kind}:${id}`;
}

function BriefCopy({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <JzText variant="body-default">
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <JzText key={index} variant="body-strong" label={part.slice(2, -2)} />
        ) : (
          part
        ),
      )}
    </JzText>
  );
}

/** The brief stays in the app. Flip this to show it and let a focus load it again. */
const FOCUS_BRIEF_PAUSED: boolean = true;

const PRESENT_MS = 700;

function ProjectVideoReveal({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: ResumeProject;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) return;
    const timeout = window.setTimeout(() => setMounted(false), PRESENT_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  return (
    <div className={styles.projectVideo} data-open={open ? "" : undefined}>
      <div className={styles.projectVideoInner}>
        {mounted ? (
          <>
            <ProjectVideo project={project} active={open} />
            <JzButton
              label="DONE"
              variant="inverse"
              size="small"
              showIcon={false}
              onClick={onClose}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function FocusBrief({
  kind,
  subject,
  resume,
  posting,
  paragraph,
  onParagraph,
}: {
  kind: "project" | "jobLine";
  subject: { id: string; title: string; text: string };
  resume: ResumeViewModel | null;
  posting: JobPostingPanelData | null;
  paragraph: string | null;
  onParagraph: (text: string) => void;
}) {
  const connection = useActiveConnectionTarget();
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const cachedOnMount = useRef(paragraph != null);
  const [open, setOpen] = useState(paragraph != null);

  const connections = (connection?.ids ?? []).flatMap((endpoint) => {
    if (endpoint.role !== "reference" || endpoint.strength !== "primary") {
      return [];
    }
    if (kind === "project") {
      const line = posting?.lines.find((item) => item.entryId === endpoint.id);
      if (!line) return [];
      return [{ id: line.entryId, name: line.theme, text: line.text }];
    }
    const project = findProject(resume, endpoint.id);
    if (!project) return [];
    return [
      {
        id: project.evidenceId,
        name: project.name,
        text: project.summary ?? "",
      },
    ];
  }).slice(0, 2);

  const postingEntryId = posting?.entryId ?? "";
  const connectionKey = connections.map((item) => item.id).join("\n");

  const run = async (refresh = false) => {
    if (running || !postingEntryId) return;
    setRunning(true);
    setFailed(false);
    try {
      const response = await fetch("/api/focus-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postingEntryId,
          kind,
          subject,
          connections,
          refresh,
        }),
      });
      if (!response.ok) throw new Error("Focus brief failed");
      const payload = (await response.json()) as { paragraph?: string };
      if (!payload.paragraph?.trim()) throw new Error("Empty brief");
      onParagraph(payload.paragraph.trim());
    } catch {
      setFailed(true);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    if (FOCUS_BRIEF_PAUSED || paragraph || !postingEntryId) return;
    void run();
    // The focused row loads its brief once. connectionKey reruns only if the matches change before a paragraph exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paragraph, postingEntryId, kind, subject.id, connectionKey]);

  useEffect(() => {
    if (!paragraph) {
      setOpen(false);
      return;
    }
    if (cachedOnMount.current) {
      setOpen(true);
      return;
    }
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [paragraph]);

  if (FOCUS_BRIEF_PAUSED) return null;

  return (
    <div className={styles.connectionBlock}>
      <div className={styles.briefHeader}>
        <JzText variant="overline" weight="300" color="muted" label="AI summary" />
        <JzIconButton
          className={styles.hubLink}
          label="Rebuild AI summary"
          icon="ArrowClockwise"
          title="Rebuild"
          disabled={running || !postingEntryId}
          onClick={() => void run(true)}
        />
      </div>
      {running ? (
        <div
          className={styles.briefLoading}
          role="status"
          aria-live="polite"
          aria-label="Loading AI summary"
        >
          <JzIcon
            icon="CircleNotch"
            weight="regular"
            size="small"
            spin
            aria-hidden
          />
        </div>
      ) : (
        <>
          {failed ? (
            <JzText
              variant="caption"
              color="muted"
              label="Could not write the brief."
            />
          ) : null}
          <div
            className={styles.briefReveal}
            data-open={open ? "" : undefined}
          >
            <div className={styles.briefRevealInner}>
              {paragraph ? <BriefCopy text={paragraph} /> : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Top of the stage. A project or job-line focus fills it.
 * Otherwise one line of copy, and the lines are not aimed here.
 */
export function ConnectionHub({
  resume,
  onViewProject,
  presentationId = null,
  onClosePresentation,
}: {
  resume: ResumeViewModel | null;
  onViewProject: (projectId: string) => void;
  presentationId?: string | null;
  onClosePresentation?: () => void;
}) {
  const { lineFocus, stageProjectId, clearStageProject } = useResumeHighlights();
  const { data } = useJobPosting();
  const posting = data ?? null;
  const edges = posting?.matchGraph?.edges;
  const projectIds = useMemo(
    () => resumeProjects(resume).map((project) => project.id),
    [resume],
  );
  const lineCount = useMemo(
    () =>
      (posting?.lines ?? []).filter(
        (line) => line.matchingRequirement?.scope === "project",
      ).length,
    [posting],
  );
  const projectBars = useMemo(
    () => projectFitBars(projectIds, edges ?? [], lineCount),
    [projectIds, edges, lineCount],
  );
  const lineBars = useMemo(
    () =>
      lineFitBars(
        (posting?.lines ?? []).map((line) => line.entryId),
        edges ?? [],
        projectIds,
      ),
    [posting, edges, projectIds],
  );
  const { scrollProps } = useIdleScrollbar();
  const [briefs, setBriefs] = useState<Record<string, string>>({});
  const saveBrief = (kind: "project" | "jobLine", id: string, text: string) => {
    setBriefs((current) => ({ ...current, [briefKey(kind, id)]: text }));
  };

  let body: ReactNode;
  if (stageProjectId) {
    const focused = findProjectContext(resume, stageProjectId);
    const project = focused?.project ?? null;
    const showingVideo = Boolean(
      project?.presentation &&
        presentationId &&
        onClosePresentation &&
        sameProjectId(project.evidenceId, presentationId),
    );
    const header = (
      <HubHeader
        label={project?.name ?? "Project"}
        employer={focused?.employerName}
        analysisUrl={
          posting?.entryId
            ? `/analytics?jobPostingEntryId=${encodeURIComponent(posting.entryId)}&projectId=${encodeURIComponent(project?.evidenceId ?? stageProjectId)}`
            : null
        }
        contentfulUrl={project?.contentfulUrl}
        contentfulLabel={`Open ${project?.name ?? "project"} in Contentful`}
        rowTotal={lineCount}
        score={
          edges
            ? projectBars.get(project?.evidenceId ?? stageProjectId)
            : undefined
        }
        onBack={showingVideo ? onClosePresentation : undefined}
        onDismiss={clearStageProject}
      />
    );
    body = (
      <>
        <div className={styles.hubLead}>{header}</div>
        <div
          className={styles.projectCopy}
          data-hidden={showingVideo ? "" : undefined}
          inert={showingVideo ? true : undefined}
        >
          <div className={styles.projectCopyInner}>
            {project?.summary ? <SummaryCopy text={project.summary} /> : null}
            {project?.url && !project.summary?.includes(project.url) ? (
              <JzText
                variant="body-default"
                href={project.url}
                target="_blank"
                label="Read the article"
              />
            ) : null}
            {project?.presentation ? (
              <div className={styles.hubActions}>
                <JzButton
                  label="Details"
                  variant="secondary"
                  size="small"
                  showIcon={false}
                  onClick={() => onViewProject(project.evidenceId)}
                />
              </div>
            ) : null}
            <FocusBrief
              key={stageProjectId}
              kind="project"
              subject={{
                id: project?.evidenceId ?? stageProjectId,
                title: project?.name ?? "Project",
                text: project?.summary ?? "",
              }}
              resume={resume}
              posting={posting}
              paragraph={
                briefs[briefKey("project", project?.evidenceId ?? stageProjectId)] ??
                null
              }
              onParagraph={(text) =>
                saveBrief("project", project?.evidenceId ?? stageProjectId, text)
              }
            />
          </div>
        </div>
        {project?.presentation && onClosePresentation ? (
          <ProjectVideoReveal
            open={showingVideo}
            project={project}
            onClose={onClosePresentation}
          />
        ) : null}
      </>
    );
  } else if (lineFocus?.kind === "jobLine") {
    const line = data?.lines.find((item) => item.entryId === lineFocus.id);
    const sectionLabel = line
      ? (SECTION_LABELS[line.section] ?? line.section)
      : "Job line";
    body = (
      <>
        <div className={styles.hubLead}>
          <HubHeader
            label={sectionLabel}
            analysisUrl={
              posting?.entryId
                ? `/analytics?jobPostingEntryId=${encodeURIComponent(posting.entryId)}&lineEntryId=${encodeURIComponent(line?.entryId ?? lineFocus.id)}`
                : null
            }
            contentfulUrl={line?.contentfulUrl}
            contentfulLabel="Open job line in Contentful"
            projectTotal={projectIds.length}
            score={
              edges ? lineBars.get(line?.entryId ?? lineFocus.id) : undefined
            }
          />
          {line?.text ? (
            <JzText variant="body-default" label={line.text} />
          ) : null}
        </div>
        <FocusBrief
          key={lineFocus.id}
          kind="jobLine"
          subject={{
            id: line?.entryId ?? lineFocus.id,
            title: sectionLabel,
            text: line?.text ?? "",
          }}
          resume={resume}
          posting={posting}
          paragraph={
            briefs[briefKey("jobLine", line?.entryId ?? lineFocus.id)] ?? null
          }
          onParagraph={(text) =>
            saveBrief("jobLine", line?.entryId ?? lineFocus.id, text)
          }
        />
      </>
    );
  } else if (posting?.matchGraph) {
    body = <HomeLanding resume={resume} posting={posting} />;
  } else {
    body = <JzText variant="body-default" color="muted" label={IDLE_COPY} />;
  }

  return (
    <div className={styles.hub} {...scrollProps}>
      <div className={styles.hubColumn}>{body}</div>
    </div>
  );
}
