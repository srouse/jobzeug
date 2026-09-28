"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
  coveragePercent,
  postingHitsResume,
  resumeHitsPosting,
  topHomeProjects,
  type HomeCoverage,
  type HomeProject,
} from "@/lib/matching/home-coverage";

import styles from "./answer-stage.module.css";

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

function FitBox({
  label,
  coverage,
}: {
  label: string;
  coverage: HomeCoverage;
}) {
  return (
    <div className={styles.homeFit}>
      <JzText variant="overline" color="muted" label={label} />
      <JzText
        variant="display-large"
        label={`${coveragePercent(coverage)}%`}
      />
      <JzText
        variant="heading2"
        color="muted"
        label={`${coverage.score} of ${coverage.ceiling}`}
      />
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
  const { selectLine } = useResumeHighlights();
  const edges = posting.matchGraph?.edges ?? [];
  const projects = resumeProjects(resume);
  const top = topHomeProjects(projects, edges);

  return (
    <div className={styles.home}>
      <div className={styles.homeFits}>
        <FitBox
          label="Resume hits posting"
          coverage={resumeHitsPosting(posting.lines, edges)}
        />
        <FitBox
          label="Posting hits resume"
          coverage={postingHitsResume(projects, edges)}
        />
      </div>
      {top.length > 0 ? (
        <ul className={styles.homeProjects}>
          {top.map((project) => (
            <li key={project.projectId}>
              <button
                type="button"
                className={styles.homeProject}
                onClick={() =>
                  selectLine({ kind: "project", id: project.projectId })
                }
              >
                <JzText variant="body-default" label={project.name} />
                <JzText
                  variant="body-default"
                  color="muted"
                  label={String(project.points)}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function HubHeader({
  label,
  contentfulUrl,
  contentfulLabel,
}: {
  label: string;
  contentfulUrl?: string | null;
  contentfulLabel: string;
}) {
  return (
    <div className={styles.hubHeader}>
      <JzText
        level={1}
        variant="heading"
        label={label}
        className={styles.hubTitle}
      />
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
    </div>
  );
}

function findProject(
  resume: ResumeViewModel | null,
  projectId: string,
): ResumeProject | null {
  if (!resume) return null;
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      const match = role.projects.find(
        (project) => project.evidenceId === projectId,
      );
      if (match) return match;
    }
  }
  return null;
}

function TopConnections({
  kind,
  resume,
  posting,
}: {
  kind: "project" | "jobLine";
  resume: ResumeViewModel | null;
  posting: JobPostingPanelData | null;
}) {
  const connection = useActiveConnectionTarget();
  const names = (connection?.ids ?? []).flatMap((endpoint) => {
    if (endpoint.role !== "reference" || endpoint.strength !== "primary") {
      return [];
    }
    const name =
      kind === "project"
        ? posting?.lines.find((line) => line.entryId === endpoint.id)?.theme
        : findProject(resume, endpoint.id)?.name;
    return name ? [{ id: endpoint.id, name }] : [];
  });

  if (names.length === 0) return null;

  const heading = kind === "project" ? "Top job items" : "Top projects";

  return (
    <div className={styles.connectionBlock}>
      <JzText variant="overline" weight="300" color="muted" label={heading} />
      <ul className={styles.connections}>
        {names.map((item) => (
          <li key={item.id}>
            <JzText
              variant="body-default"
              label={item.name}
              className={styles.connectionName}
            />
          </li>
        ))}
      </ul>
    </div>
  );
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

  const run = async () => {
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
    if (paragraph || !postingEntryId) return;
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

  return (
    <div className={styles.connectionBlock}>
      <JzText variant="overline" weight="300" color="muted" label="AI summary" />
      {running && !paragraph ? (
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
      ) : null}
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
}: {
  resume: ResumeViewModel | null;
  onViewProject: (projectId: string) => void;
}) {
  const { lineFocus } = useResumeHighlights();
  const { data } = useJobPosting();
  const posting = data ?? null;
  const { scrollProps } = useIdleScrollbar();
  const [briefs, setBriefs] = useState<Record<string, string>>({});
  const saveBrief = (kind: "project" | "jobLine", id: string, text: string) => {
    setBriefs((current) => ({ ...current, [briefKey(kind, id)]: text }));
  };

  let body: ReactNode;
  if (lineFocus?.kind === "project") {
    const project = findProject(resume, lineFocus.id);
    body = (
      <>
        <div className={styles.hubLead}>
          <HubHeader
            label={project?.name ?? "Project"}
            contentfulUrl={project?.contentfulUrl}
            contentfulLabel={`Open ${project?.name ?? "project"} in Contentful`}
          />
          {project?.summary ? (
            <JzText variant="body-default" label={project.summary} />
          ) : null}
        </div>
        {project?.presentation ? (
          <div className={styles.hubActions}>
            <JzButton
              label="Watch walkthrough"
              variant="secondary"
              size="small"
              showIcon={false}
              onClick={() => onViewProject(project.evidenceId)}
            />
          </div>
        ) : null}
        <TopConnections kind="project" resume={resume} posting={posting} />
        <FocusBrief
          key={lineFocus.id}
          kind="project"
          subject={{
            id: project?.evidenceId ?? lineFocus.id,
            title: project?.name ?? "Project",
            text: project?.summary ?? "",
          }}
          resume={resume}
          posting={posting}
          paragraph={
            briefs[briefKey("project", project?.evidenceId ?? lineFocus.id)] ??
            null
          }
          onParagraph={(text) =>
            saveBrief("project", project?.evidenceId ?? lineFocus.id, text)
          }
        />
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
            contentfulUrl={line?.contentfulUrl}
            contentfulLabel="Open job line in Contentful"
          />
          {line?.text ? (
            <JzText variant="body-default" label={line.text} />
          ) : null}
        </div>
        <TopConnections kind="jobLine" resume={resume} posting={posting} />
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
      {body}
    </div>
  );
}
