"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import Markdown from "react-markdown";
import { JzButton, JzIcon, JzIconButton, JzText } from "@jobzeug/design-system/react";
import { useJobPosting } from "@/components/job-posting";
import { useResumeHighlights } from "../../highlight-context";
import { useIdleScrollbar } from "@/lib/use-idle-scrollbar";
import { useActiveConnectionTarget } from "../../use-connection-target";
import type {
  ResumeProject,
  ResumeViewModel,
} from "@/lib/contentful/resume-model";
import type { JobPostingPanelData } from "@/lib/job-posting/schema";
import {
  coverageLineIds,
  lineExampleCoverage,
  strongExampleProjects,
  type HomeProject,
} from "@/lib/matching/home-coverage";
import {
  ProjectVideo,
  sameProjectId,
} from "../../project-presentation/project-presentation";

import styles from "./answer-stage.module.css";
import { PresentationEditor } from "./presentation-editor";

function SummaryCopy({ text }: { text: string }) {
  return (
    <Markdown
      components={{
        p: ({ children }: ComponentPropsWithoutRef<"p">) => (
          <JzText variant="body-default">{children}</JzText>
        ),
        strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
          <JzText variant="body-strong">{children}</JzText>
        ),
        em: ({ children }: ComponentPropsWithoutRef<"em">) => <em>{children}</em>,
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

const IDLE_COPY = "Select a project.";

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

function projectFocusMeta(employer?: string, year?: number): string | undefined {
  const parts = [employer, year != null ? String(year) : undefined].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length ? parts.join(" · ") : undefined;
}

function HubHeader({
  label,
  contentfulUrl,
  contentfulLabel,
  analysisUrl,
  employer,
  year,
  onBack,
  onDismiss,
  onEditTitle,
}: {
  label: string;
  contentfulUrl?: string | null;
  contentfulLabel: string;
  analysisUrl?: string | null;
  employer?: string;
  year?: number;
  onBack?: () => void;
  /** Close the project page. Lines stay with the job line. */
  onDismiss?: () => void;
  onEditTitle?: () => void;
}) {
  const { clearLineFocus } = useResumeHighlights();
  const meta = projectFocusMeta(employer, year);
  return (
    <div className={styles.hubIntro}>
      <div className={styles.hubHeader}>
        <div className={styles.hubTitleRow}>
          {onEditTitle ? (
            <button type="button" className={styles.hubTitleButton} onClick={onEditTitle}>
              <JzText
                level={1}
                variant="heading"
                label={label}
                className={styles.hubTitle}
              />
            </button>
          ) : (
            <JzText
              level={1}
              variant="heading"
              label={label}
              className={styles.hubTitle}
            />
          )}
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
      {meta ? (
        <JzText variant="caption" color="muted" label={meta} />
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
 * Top of the stage. A selected project fills it. Otherwise the home.
 */
export function ConnectionHub({
  resume,
  onViewProject,
  presentationId = null,
  onClosePresentation,
  canEdit = false,
  onPresentationSaved,
}: {
  resume: ResumeViewModel | null;
  onViewProject: (projectId: string) => void;
  presentationId?: string | null;
  onClosePresentation?: () => void;
  canEdit?: boolean;
  onPresentationSaved?: () => Promise<void>;
}) {
  const { stageProjectId, clearStageProject } = useResumeHighlights();
  const { data } = useJobPosting();
  const posting = data ?? null;
  const { scrollProps } = useIdleScrollbar();
  const [briefs, setBriefs] = useState<Record<string, string>>({});
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [titleEditRequest, setTitleEditRequest] = useState(0);
  if (
    editingProjectId &&
    (!stageProjectId || !sameProjectId(editingProjectId, stageProjectId))
  ) {
    setEditingProjectId(null);
  }
  const saveBrief = (kind: "project" | "jobLine", id: string, text: string) => {
    setBriefs((current) => ({ ...current, [briefKey(kind, id)]: text }));
  };

  let body: ReactNode;
  if (stageProjectId) {
    const focused = findProjectContext(resume, stageProjectId);
    const project = focused?.project ?? null;
    const editingPresentation =
      editingProjectId != null && sameProjectId(editingProjectId, stageProjectId);
    const showingVideo = Boolean(
      !editingPresentation &&
        project?.presentation?.videoUrl &&
        presentationId &&
        onClosePresentation &&
        sameProjectId(project.evidenceId, presentationId),
    );
    const header = (
      <HubHeader
        label={project?.name ?? "Project"}
        employer={focused?.employerName}
        year={project?.year}
        analysisUrl={
          posting?.entryId
            ? `/analytics?jobPostingEntryId=${encodeURIComponent(posting.entryId)}&projectId=${encodeURIComponent(project?.evidenceId ?? stageProjectId)}`
            : null
        }
        contentfulUrl={project?.contentfulUrl}
        contentfulLabel={`Open ${project?.name ?? "project"} in Contentful`}
        onBack={showingVideo ? onClosePresentation : undefined}
        onDismiss={clearStageProject}
        onEditTitle={
          canEdit && project?.presentation
            ? () => setTitleEditRequest((current) => current + 1)
            : undefined
        }
      />
    );
    body = (
      <>
        {editingPresentation ? null : <div className={styles.hubLead}>{header}</div>}
        <div
          className={styles.projectCopy}
          data-hidden={showingVideo ? "" : undefined}
          inert={showingVideo ? true : undefined}
        >
          <div className={styles.projectCopyInner}>
            {project?.presentation && canEdit ? (
              <PresentationEditor
                project={project}
                onSaved={onPresentationSaved ?? (async () => {})}
                onEditingChange={(open) => {
                  setEditingProjectId(open ? project.evidenceId : null);
                }}
                titleEditRequest={titleEditRequest}
              />
            ) : project?.presentation?.blurb ? (
              <SummaryCopy text={project.presentation.blurb} />
            ) : project?.presentation ? null : (
              <JzText variant="body-default" color="muted" label="no presentation" />
            )}
            {project?.presentation && !canEdit && project.presentation.metrics.length > 0 ? (
              <div className={styles.metrics}>
                {project.presentation.metrics.map((metric) => (
                  <div
                    key={`${metric.value}-${metric.label}`}
                    className={styles.metric}
                  >
                    <JzText variant="body-strong" label={metric.value} />
                    <JzText
                      variant="caption"
                      color="muted"
                      label={metric.label}
                    />
                  </div>
                ))}
              </div>
            ) : null}
            {!editingPresentation &&
            project?.presentation &&
            project.url &&
            !project.summary?.includes(project.url) ? (
              <JzText
                variant="body-default"
                href={project.url}
                target="_blank"
                label="Read the article"
              />
            ) : null}
            {!editingPresentation && project?.presentation?.videoUrl ? (
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
            {editingPresentation ? null : (
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
            )}
          </div>
        </div>
        {project?.presentation?.videoUrl && onClosePresentation ? (
          <ProjectVideoReveal
            open={showingVideo}
            project={project}
            onClose={onClosePresentation}
          />
        ) : null}
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
