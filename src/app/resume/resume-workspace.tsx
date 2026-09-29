"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Ref } from "react";
import type { ResumeViewModel } from "@/lib/contentful/resume-model";
import {
  JobPostingPanel,
  JobPostingProvider,
  LoadingState,
  UnboundBindForm,
  useJobPosting,
} from "@/components/job-posting";
import type { LineFocus } from "@/lib/connection-targets";
import {
  EvidenceConnectors,
  LAYOUT_MEDIUM_MIN_PX,
  LAYOUT_WIDE_MIN_PX,
  ResumeChatDock,
  ResumeChatProvider,
  ResumeDocument,
  ResumeHighlightProvider,
  useResumeHighlights,
  type EvidencePage,
} from "@/components/resume";
import { AnswerStage, DesignModal, DesignSessionProvider } from "@/components/stage";
import { JzButton, JzTab, JzTabGroup, JzText } from "@jobzeug/design-system/react";
import {
  normalizeRouteEntryId,
  resumePath,
  resumeRouteFromPathname,
  type ResumeFocus,
} from "./resume-route";
import styles from "./resume.module.css";

const MEDIUM_TABS: Array<{ id: EvidencePage; label: string }> = [
  { id: "resume", label: "Resume" },
  { id: "job", label: "Job posting" },
];

const MOBILE_TABS: Array<{ id: EvidencePage; label: string }> = [
  { id: "resume", label: "Resume" },
  { id: "stage", label: "Answer" },
  { id: "job", label: "Job posting" },
];

function isEvidencePage(value: string): value is EvidencePage {
  return value === "resume" || value === "job" || value === "stage";
}

function selectedTabFromChange(event: Event): string | null {
  const detail = (event as CustomEvent<{ selectedTab?: string }>).detail;
  return typeof detail?.selectedTab === "string" ? detail.selectedTab : null;
}

/** Design-system tabs. `direction="top"` puts the mark on the content-facing edge. */
function EvidenceTabBar({
  tabs,
  selected,
  onSelect,
  label,
  className,
  barRef,
}: {
  tabs: ReadonlyArray<{ id: EvidencePage; label: string }>;
  selected: EvidencePage;
  onSelect: (page: EvidencePage) => void;
  label: string;
  className: string;
  barRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className={className} ref={barRef}>
      <JzTabGroup
        aria-label={label}
        direction="top"
        selectedTab={selected}
        onChange={(event: Event) => {
          const next = selectedTabFromChange(event);
          if (next && isEvidencePage(next)) onSelect(next);
        }}
      >
        {tabs.map((tab) => (
          <JzTab key={tab.id} label={tab.label} value={tab.id} />
        ))}
      </JzTabGroup>
    </div>
  );
}

/** Parse `/resume` or `/resume/{entryId}` from a pathname. */
export function entryIdFromPathname(pathname: string): string | null {
  return resumeRouteFromPathname(pathname).entryId;
}

function lineFromRoute(focus: ResumeFocus | null): LineFocus | null {
  return focus ? { kind: focus.kind, id: focus.id } : null;
}

function routeFromLine(focus: LineFocus | null): ResumeFocus | null {
  if (!focus || focus.kind === "answer") return null;
  return { kind: focus.kind, id: focus.id };
}

/**
 * Stage subject and the address stay the same value.
 * Route changes (load, Back, a new posting) apply onto line focus without
 * writing history. Clicks push a new entry.
 */
function FocusRouteSync({
  entryId,
  routeFocus,
  onRouteFocus,
}: {
  entryId: string | null;
  routeFocus: ResumeFocus | null;
  onRouteFocus: (focus: ResumeFocus | null) => void;
}) {
  const { lineFocus, applyLineFocus } = useResumeHighlights();
  const entryIdRef = useRef(entryId);
  entryIdRef.current = entryId;

  useEffect(() => {
    applyLineFocus(lineFromRoute(routeFocus));
  }, [routeFocus, applyLineFocus]);

  useEffect(() => {
    if (lineFocus?.kind === "answer") return;
    const next = routeFromLine(lineFocus);
    const url = resumePath(entryIdRef.current, next);
    if (url === window.location.pathname) return;
    window.history.pushState(null, "", url);
    onRouteFocus(next);
  }, [lineFocus, onRouteFocus]);

  return null;
}

function ResumeCover({ resumeLoading }: { resumeLoading: boolean }) {
  const { data, busy, loading: postingLoading } = useJobPosting();
  const working = busy || postingLoading || (Boolean(data) && resumeLoading);
  return (
    <div className={styles.cover}>
      <div className={styles.coverInner}>
        <JzText level={1} variant="heading" label="Scott Rouse" />
        {working ? <LoadingState /> : <UnboundBindForm />}
      </div>
    </div>
  );
}

function ResumePageBody() {
  const { evidencePage, setEvidencePage } = useResumeHighlights();
  const { data: posting } = useJobPosting();
  const [resume, setResume] = useState<ResumeViewModel | null>(null);
  const resumeProjectIds = useMemo(() => {
    if (!resume) return [];
    const ids: string[] = [];
    for (const employer of resume.employers) {
      for (const role of employer.roles) {
        for (const project of role.projects) ids.push(project.evidenceId);
      }
    }
    return ids;
  }, [resume]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  /** Chat button and dock. Off until that entry comes back. */
  const showResumeChat = false;
  const [designOpen, setDesignOpen] = useState(false);
  const [walkthroughId, setWalkthroughId] = useState<string | null>(null);
  const [wide, setWide] = useState(true);
  const [mobile, setMobile] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const mobileTabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
        if (!cancelled) setResume(data as ResumeViewModel);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // App shell: lock document scroll and drop the reserved scrollbar gutter.
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

  useEffect(() => {
    const wideMq = window.matchMedia(`(min-width: ${LAYOUT_WIDE_MIN_PX}px)`);
    const mobileMq = window.matchMedia(
      `(max-width: ${LAYOUT_MEDIUM_MIN_PX - 1}px)`,
    );
    const sync = () => {
      setWide(wideMq.matches);
      setMobile(mobileMq.matches);
    };
    sync();
    wideMq.addEventListener("change", sync);
    mobileMq.addEventListener("change", sync);
    return () => {
      wideMq.removeEventListener("change", sync);
      mobileMq.removeEventListener("change", sync);
    };
  }, []);

  // Publish the design-system tab height so fixed chrome clears the bar.
  useEffect(() => {
    const root = rootRef.current;
    const bar = mobileTabBarRef.current;
    if (!mobile || !root || !bar) return;

    const publish = () => {
      const height = bar.getBoundingClientRect().height;
      if (height > 0) {
        root.style.setProperty("--resume-mobile-tab-height", `${height}px`);
      }
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--resume-mobile-tab-height");
    };
  }, [mobile]);

  // Medium left-rail only knows resume|job — leave stage if we leave mobile.
  useEffect(() => {
    if (!mobile && evidencePage === "stage") {
      setEvidencePage("resume");
    }
  }, [mobile, evidencePage, setEvidencePage]);

  const resumeActive = wide || evidencePage === "resume";
  const jobActive = wide || evidencePage === "job";
  const stageVisible = !mobile || evidencePage === "stage";
  const pagesVisible = !mobile || evidencePage !== "stage";

  const selectPage = (page: EvidencePage) => {
    setEvidencePage(page);
  };
  const covered = !posting || loading;

  return (
    <main
      ref={rootRef}
      className={styles.root}
      data-mobile-view={mobile ? evidencePage : undefined}
    >
      <div
        className={styles.shell}
        inert={covered ? true : undefined}
        aria-hidden={covered || undefined}
      >
      <div className={styles.workspace}>
        <div className={`${styles.inner} ${styles.innerBound}`}>
          <div
            className={styles.leftRail}
            hidden={!pagesVisible ? true : undefined}
            inert={!pagesVisible ? true : undefined}
          >
            <div className={styles.paneHost}>
              <div
                className={`${styles.pagePane} ${styles.pagePaneResume}`}
                data-evidence-pane="resume"
                data-evidence-pane-active={resumeActive ? "" : undefined}
                hidden={!resumeActive ? true : undefined}
                inert={!resumeActive ? true : undefined}
              >
                <ResumeDocument
                  resume={resume}
                  loading={loading}
                  error={error}
                  projectId={walkthroughId}
                  onProjectIdChange={setWalkthroughId}
                />
              </div>
              <div
                className={`${styles.pagePane} ${styles.pagePaneJob}`}
                data-evidence-pane="job"
                data-evidence-pane-active={jobActive ? "" : undefined}
                hidden={!jobActive ? true : undefined}
                inert={!jobActive ? true : undefined}
              >
                <JobPostingPanel resumeProjectIds={resumeProjectIds} />
              </div>
            </div>
            <EvidenceTabBar
              className={styles.pageTabs}
              label="Evidence pages"
              tabs={MEDIUM_TABS}
              selected={evidencePage === "stage" ? "resume" : evidencePage}
              onSelect={selectPage}
            />
          </div>
        </div>
      </div>
      <EvidenceConnectors />
      <AnswerStage
        hidden={!stageVisible}
        resume={resume}
        onViewProject={setWalkthroughId}
        onOpenDesign={() => setDesignOpen(true)}
      />
      <EvidenceTabBar
        className={styles.mobileTabBar}
        barRef={mobileTabBarRef}
        label="Views"
        tabs={MOBILE_TABS}
        selected={evidencePage}
        onSelect={selectPage}
      />
      <DesignModal open={designOpen} onOpenChange={setDesignOpen} />
      {showResumeChat ? (
        <>
          <JzButton
            variant={chatOpen ? "secondary" : "primary"}
            size="small"
            label={chatOpen ? "Close chat" : "Chat"}
            showIcon={false}
            className={styles.chatFab}
            onClick={() => setChatOpen((value) => !value)}
            aria-pressed={chatOpen}
          />
          <ResumeChatDock open={chatOpen} onOpenChange={setChatOpen} />
        </>
      ) : null}
      </div>
      {covered ? <ResumeCover resumeLoading={loading} /> : null}
    </main>
  );
}

/**
 * Single client shell for `/resume`, `/resume/{entryId}`,
 * `/resume/{entryId}/project/{projectId}`, and
 * `/resume/{entryId}/job-line/{lineId}`.
 * Ids live in React state. URL updates use history.pushState so Next does
 * not remount this tree.
 */
export function ResumeWorkspace({
  initialEntryId,
  initialFocus,
}: {
  initialEntryId: string | null;
  initialFocus: ResumeFocus | null;
}) {
  const [entryId, setEntryId] = useState<string | null>(() =>
    normalizeRouteEntryId(initialEntryId),
  );
  const [focus, setFocus] = useState<ResumeFocus | null>(initialFocus);

  useEffect(() => {
    setEntryId(normalizeRouteEntryId(initialEntryId));
  }, [initialEntryId]);

  const initialFocusKind = initialFocus?.kind ?? "";
  const initialFocusId = initialFocus?.id ?? "";
  useEffect(() => {
    setFocus(
      initialFocusKind === "project" || initialFocusKind === "jobLine"
        ? { kind: initialFocusKind, id: initialFocusId }
        : null,
    );
  }, [initialFocusKind, initialFocusId]);

  useEffect(() => {
    const onPopState = () => {
      const route = resumeRouteFromPathname(window.location.pathname);
      setEntryId(route.entryId);
      setFocus(route.focus);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateEntryId = useCallback((next: string | null) => {
    const resolved = normalizeRouteEntryId(next);
    window.history.pushState(null, "", resumePath(resolved, null));
    setEntryId(resolved);
    setFocus(null);
  }, []);

  return (
    <ResumeHighlightProvider initialLineFocus={lineFromRoute(initialFocus)}>
      <FocusRouteSync
        entryId={entryId}
        routeFocus={focus}
        onRouteFocus={setFocus}
      />
      <JobPostingProvider entryId={entryId} navigateEntryId={navigateEntryId}>
        <ResumeChatProvider>
          <DesignSessionProvider>
            <ResumePageBody />
          </DesignSessionProvider>
        </ResumeChatProvider>
      </JobPostingProvider>
    </ResumeHighlightProvider>
  );
}
