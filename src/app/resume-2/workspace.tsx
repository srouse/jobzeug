"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EMPTY_MATCH_EDGES } from "@/lib/connection-targets";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import {
  JobPostingProvider,
  LoadingState,
  UnboundBindForm,
  useJobPosting,
} from "@/components/job-posting";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { JzText } from "@jobzeug/design-system/react";

import { ResumeConnectors } from "./connectors";
import {
  ResumeHighlightProvider,
  useResumeHighlights,
} from "./highlight-context";
import { JobPostingPanel } from "./job-panel/job-posting-panel";
import { MiddleProjects } from "./middle-projects";
import { sameProjectId } from "./project-presentation/project-presentation";
import { listResumeProjects, topProjectsForLine } from "./rank-projects";
import {
  normalizeRouteEntryId,
  resumePath,
  resumeRouteFromPathname,
} from "./resume-route";
import styles from "./resume-2.module.css";
import { AnswerStage } from "./stage/answer-stage/answer-stage";
import { DesignModal } from "./stage/design-modal/design-modal";
import { DesignSessionProvider } from "./stage/design-session-context";

const DEFAULT_NAME = "Scott Rouse";

function ResumeCover({ resumeLoading }: { resumeLoading: boolean }) {
  const { data, busy, loading: postingLoading } = useJobPosting();
  const working = busy || postingLoading || (Boolean(data) && resumeLoading);
  return (
    <div className={styles.cover}>
      <div className={styles.coverInner}>
        <JzText level={1} variant="heading" label={DEFAULT_NAME} />
        {working ? <LoadingState /> : <UnboundBindForm />}
      </div>
    </div>
  );
}

function ResumePageBody() {
  const { lineFocus, stageProjectId, applyStageProject } = useResumeHighlights();
  const { data: posting } = useJobPosting();
  const [resume, setResume] = useState<ResumeViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [designOpen, setDesignOpen] = useState(false);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [presentationProjectId, setPresentationProjectId] = useState<
    string | null
  >(stageProjectId);
  if (presentationProjectId !== stageProjectId) {
    setPresentationProjectId(stageProjectId);
    if (
      presentationId &&
      (!stageProjectId || !sameProjectId(stageProjectId, presentationId))
    ) {
      setPresentationId(null);
    }
  }
  const projects = useMemo(() => listResumeProjects(resume), [resume]);
  const resumeProjectIds = useMemo(
    () => projects.map((project) => project.id),
    [projects],
  );
  const lineId = lineFocus?.kind === "jobLine" ? lineFocus.id : null;
  const edges = posting?.matchGraph?.edges ?? EMPTY_MATCH_EDGES;
  const topThree = useMemo(
    () =>
      lineId
        ? topProjectsForLine(
            projects,
            edges,
            lineId,
            posting?.matchGraph?.projectYears,
          )
        : [],
    [projects, edges, lineId, posting?.matchGraph?.projectYears],
  );
  const topThreeIds = useMemo(
    () => topThree.map((project) => project.id),
    [topThree],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
        if (!cancelled) setResume(data as ResumeViewModel);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load resume");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevGutter = html.style.scrollbarGutter;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.scrollbarGutter = "auto";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.scrollbarGutter = prevGutter;
    };
  }, []);

  const covered = !posting || loading;
  const name = resume?.name ?? DEFAULT_NAME;

  return (
    <main className={styles.root}>
      <div
        className={styles.shell}
        inert={covered ? true : undefined}
        aria-hidden={covered || undefined}
      >
        <div
          className={styles.job}
          data-resume2-job
          data-evidence-pane="job"
          data-evidence-pane-active=""
        >
          <JobPostingPanel resumeProjectIds={resumeProjectIds} />
        </div>
        <div className={styles.main}>
          <EvidencePageHeader>
            <JzText
              variant="overline"
              color="muted"
              label="Resume"
              className={styles.eyebrow}
            />
            <JzText
              level={1}
              variant="heading"
              label={name}
              className={styles.name}
            />
          </EvidencePageHeader>
          <div className={styles.body}>
            <section className={styles.projects} aria-label="Projects">
              {error ? (
                <JzText
                  variant="label"
                  color="error"
                  label={error}
                  className={styles.status}
                />
              ) : (
                <MiddleProjects
                  lineSelected={lineId != null}
                  topThree={topThree}
                  allProjects={projects}
                  stageProjectId={stageProjectId}
                  onOpenProject={applyStageProject}
                />
              )}
            </section>
            <div
              className={styles.stageCol}
              data-presenting={presentationId ? "" : undefined}
            >
              <AnswerStage
                resume={resume}
                presentationId={presentationId}
                onClosePresentation={() => setPresentationId(null)}
                onViewProject={setPresentationId}
                onOpenDesign={() => setDesignOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <ResumeConnectors
        enabled={!covered && lineId != null}
        lineId={lineId}
        orderedIds={resumeProjectIds}
        projectIds={topThreeIds}
        stageProjectId={stageProjectId}
      />
      <DesignModal open={designOpen} onOpenChange={setDesignOpen} />
      {covered ? <ResumeCover resumeLoading={loading} /> : null}
    </main>
  );
}

/**
 * Client shell for `/resume-2` and `/resume-2/{entryId}`.
 * The posting id follows the address. The job line and the stage project
 * stay in React state so both can be active together.
 */
export function ResumeWorkspace({
  initialEntryId,
}: {
  initialEntryId: string | null;
}) {
  const [entryId, setEntryId] = useState<string | null>(() =>
    normalizeRouteEntryId(initialEntryId),
  );

  useEffect(() => {
    const onPopState = () => {
      setEntryId(resumeRouteFromPathname(window.location.pathname).entryId);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateEntryId = useCallback((next: string | null) => {
    const resolved = normalizeRouteEntryId(next);
    window.history.pushState(null, "", resumePath(resolved));
    setEntryId(resolved);
  }, []);

  return (
    <ResumeHighlightProvider>
      <JobPostingProvider entryId={entryId} navigateEntryId={navigateEntryId}>
        <DesignSessionProvider>
          <ResumePageBody />
        </DesignSessionProvider>
      </JobPostingProvider>
    </ResumeHighlightProvider>
  );
}
