"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_MATCH_EDGES } from "@/lib/connection-targets";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import {
  JobPostingProvider,
  LoadingState,
  UnboundBindForm,
  useJobPosting,
} from "@/components/job-posting";
import { EvidencePageHeader } from "@/components/evidence-page-header";
import { JzButton, JzIconButton, JzText } from "@jobzeug/design-system/react";
import { CareerTimeline } from "@/components/resume/career-timeline/career-timeline";

import { ResumeConnectors } from "./connectors";
import {
  ResumeHighlightProvider,
  useResumeHighlights,
  type LineFocus,
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
import {
  useWatchedProjects,
  WatchedProjectsProvider,
} from "./watched-projects";

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
  return (
    <WatchedProjectsProvider>
      <ResumePageView />
    </WatchedProjectsProvider>
  );
}

function ResumePageView() {
  const {
    lineFocus,
    stageProjectId,
    applyStageProject,
    jobPostingOpen,
    setJobPostingOpen,
  } = useResumeHighlights();
  const { markWatched, clearWatched } = useWatchedProjects();
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
  const timelineSelection = useMemo(
    () =>
      stageProjectId
        ? [{ id: stageProjectId, strength: "primary" as const }]
        : [],
    [stageProjectId],
  );

  return (
    <main className={styles.root}>
      <div
        className={styles.shell}
        data-job-closed={jobPostingOpen ? undefined : ""}
        inert={covered ? true : undefined}
        aria-hidden={covered || undefined}
      >
        <div
          className={styles.job}
          data-resume2-job
          data-evidence-pane="job"
          data-evidence-pane-active={jobPostingOpen ? "" : undefined}
        >
          <div
            className={styles.jobBody}
            inert={jobPostingOpen ? undefined : true}
            aria-hidden={jobPostingOpen ? undefined : true}
          >
            <JobPostingPanel resumeProjectIds={resumeProjectIds} />
          </div>
        </div>
        {jobPostingOpen ? null : (
          <div className={styles.jobToggle}>
            <JzIconButton
              label="Show job posting"
              icon="SidebarSimple"
              title="Show job posting"
              aria-pressed={false}
              onClick={() => setJobPostingOpen(true)}
            />
          </div>
        )}
        <div className={styles.main}>
          <EvidencePageHeader
            actions={
              <JzButton
                label="Clear watched"
                variant="secondary"
                size="small"
                showIcon={false}
                onClick={clearWatched}
              />
            }
          >
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
              <CareerTimeline
                employers={resume?.employers}
                selectedProjects={timelineSelection}
                open={!jobPostingOpen}
              >
                {error ? (
                  <JzText
                    variant="label"
                    color="error"
                    label={error}
                    className={styles.status}
                  />
                ) : (
                  <MiddleProjects
                    matched={jobPostingOpen && lineId != null}
                    topThree={topThree}
                    employers={resume?.employers ?? []}
                    stageProjectId={stageProjectId}
                    onOpenProject={applyStageProject}
                  />
                )}
              </CareerTimeline>
            </section>
            <div className={styles.stageCol}>
              <AnswerStage
                resume={resume}
                presentationId={presentationId}
                onClosePresentation={() => setPresentationId(null)}
                onViewProject={(projectId) => {
                  setPresentationId(projectId);
                  markWatched(projectId);
                }}
                onOpenDesign={() => setDesignOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <ResumeConnectors
        covered={covered}
        postingOpen={jobPostingOpen}
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
 * Writes the posting, job line, and stage project into the address.
 * pushState only. The page stays mounted.
 */
function ResumeRouteSync({
  entryId,
  navEpoch,
  setEntryId,
}: {
  entryId: string | null;
  navEpoch: number;
  setEntryId: (entryId: string | null) => void;
}) {
  const {
    lineFocus,
    stageProjectId,
    applyLineFocus,
    applyStageProject,
  } = useResumeHighlights();
  const lineId = lineFocus?.kind === "jobLine" ? lineFocus.id : null;
  const navSeen = useRef(navEpoch);

  useEffect(() => {
    const onPopState = () => {
      const route = resumeRouteFromPathname(window.location.pathname);
      setEntryId(route.entryId);
      applyLineFocus(route.lineId ? { kind: "jobLine", id: route.lineId } : null);
      applyStageProject(route.projectId);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [applyLineFocus, applyStageProject, setEntryId]);

  useEffect(() => {
    if (navSeen.current !== navEpoch) {
      navSeen.current = navEpoch;
      const path = resumePath(entryId, null, null);
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
      if (lineId) applyLineFocus(null);
      if (stageProjectId) applyStageProject(null);
      return;
    }
    const path = resumePath(entryId, lineId, stageProjectId);
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  }, [
    applyLineFocus,
    applyStageProject,
    entryId,
    lineId,
    navEpoch,
    stageProjectId,
  ]);

  return null;
}

/**
 * Client shell for `/resume-2`. The posting, job line, and stage project
 * are stored in the address. Selection changes use history.pushState.
 */
export function ResumeWorkspace({
  initialEntryId,
  initialLineId,
  initialProjectId,
}: {
  initialEntryId: string | null;
  initialLineId: string | null;
  initialProjectId: string | null;
}) {
  const [entryId, setEntryId] = useState<string | null>(() =>
    normalizeRouteEntryId(initialEntryId),
  );
  const [navEpoch, setNavEpoch] = useState(0);
  const initialLineFocus: LineFocus | null = initialLineId
    ? { kind: "jobLine", id: initialLineId }
    : null;

  const entryIdRef = useRef(normalizeRouteEntryId(initialEntryId));

  const setEntryFromRoute = useCallback((next: string | null) => {
    const resolved = normalizeRouteEntryId(next);
    entryIdRef.current = resolved;
    setEntryId(resolved);
  }, []);

  const navigateEntryId = useCallback((next: string | null) => {
    const resolved = normalizeRouteEntryId(next);
    if (entryIdRef.current === resolved) return;
    entryIdRef.current = resolved;
    setEntryId(resolved);
    setNavEpoch((epoch) => epoch + 1);
  }, []);

  return (
    <ResumeHighlightProvider
      initialLineFocus={initialLineFocus}
      initialStageProjectId={initialProjectId}
    >
      <JobPostingProvider entryId={entryId} navigateEntryId={navigateEntryId}>
        <DesignSessionProvider>
          <ResumeRouteSync
            entryId={entryId}
            navEpoch={navEpoch}
            setEntryId={setEntryFromRoute}
          />
          <ResumePageBody />
        </DesignSessionProvider>
      </JobPostingProvider>
    </ResumeHighlightProvider>
  );
}
