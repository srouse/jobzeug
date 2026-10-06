"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  idsFromCitations,
  type EvidenceCluster,
} from "@/lib/evidence-citations";
import {
  askContextLabel,
  type AskContextItem,
  type AskContextSource,
} from "@/lib/resume-default-prompts";
import type { LineFocus } from "@/lib/connection-targets";
import { sameProjectId } from "./project-presentation/project-presentation";

export type { LineFocus };

export type ResumeDensity = "full" | "rolled";
/**
 * Foregrounded surface: medium uses resume|job; mobile also uses stage.
 * Wide shows resume + job together (value unused for visibility).
 */
export type EvidencePage = "resume" | "job" | "stage";
export type { AskContextItem, AskContextSource };

/** Wide three-column layout at/above this width. */
export const LAYOUT_WIDE_MIN_PX = 1300;
/** Medium left-rail + stage; below this is mobile with three-way tabs. */
export const LAYOUT_MEDIUM_MIN_PX = 900;

type ResumeHighlightContextValue = {
  activeCluster: EvidenceCluster | null;
  setActiveCluster: (next: EvidenceCluster | null) => void;
  clearActiveCluster: () => void;
  /** Selected highlight section id (themed answers). */
  focusedSectionId: string | null;
  setFocusedSectionId: (id: string | null) => void;
  /**
   * When false, hide connector/page cite visuals without clearing the answer.
   * Default true while a cluster is active.
   */
  pageBindingsVisible: boolean;
  setPageBindingsVisible: (next: boolean) => void;
  /** Union of all turn citations. */
  highlightedIds: Set<string>;
  /** Citations for the selected highlight section. Used when the line focus is the AI result. */
  focusedIds: Set<string>;
  /**
   * Who the connector lines follow. A job line or the AI result.
   * A project open in the stage does not move these lines.
   */
  lineFocus: LineFocus | null;
  /**
   * Project open in the stage. The same project again closes it.
   * Separate from the lines.
   */
  stageProjectId: string | null;
  /** Select a project or job line. The same row again clears that choice. */
  selectLine: (next: { kind: "project" | "jobLine"; id: string }) => void;
  /** Set the line driver exactly. Used when the URL changes. */
  applyLineFocus: (next: LineFocus | null) => void;
  /** Set the project open in the stage. Used when the URL changes. */
  applyStageProject: (id: string | null) => void;
  /** Close the project in the stage. The lines stay. */
  clearStageProject: () => void;
  /** Return the stage to the home landing and clear the lines. */
  clearLineFocus: () => void;
  /** Hand the lines to the current AI result. */
  focusAnswer: () => void;
  density: ResumeDensity;
  setDensity: (next: ResumeDensity) => void;
  /** Score bars under projects and job lines. Off until the stage toggle. */
  fitBarsVisible: boolean;
  setFitBarsVisible: (next: boolean) => void;
  /** Career timeline column in the resume. On until the stage toggle. */
  timelineVisible: boolean;
  setTimelineVisible: (next: boolean) => void;
  /** Right-hand job posting column. Off lets the stage run flush to the right. */
  jobPostingOpen: boolean;
  setJobPostingOpen: (next: boolean) => void;
  /** Medium-layout page tab (resume vs job). Unused for visibility on wide. */
  evidencePage: EvidencePage;
  setEvidencePage: (next: EvidencePage) => void;
  /** Pre-ask row attachments folded into the next question. */
  askContextItems: AskContextItem[];
  toggleAskContext: (item: Omit<AskContextItem, "label"> & { label?: string }) => void;
  removeAskContext: (id: string) => void;
  clearAskContext: () => void;
};

const ResumeHighlightContext = createContext<ResumeHighlightContextValue | null>(
  null,
);

function firstSectionId(cluster: EvidenceCluster | null): string | null {
  return cluster?.sections?.[0]?.id ?? null;
}

function sameLineFocus(a: LineFocus | null, b: LineFocus | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.kind === "answer" || b.kind === "answer") {
    return a.kind === "answer" && b.kind === "answer";
  }
  return a.kind === b.kind && a.id === b.id;
}

export function ResumeHighlightProvider({
  children,
  initialLineFocus = null,
  initialStageProjectId = null,
}: {
  children: ReactNode;
  initialLineFocus?: LineFocus | null;
  initialStageProjectId?: string | null;
}) {
  const [activeCluster, setActiveClusterState] =
    useState<EvidenceCluster | null>(null);
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);
  const [density, setDensity] = useState<ResumeDensity>("full");
  const [fitBarsVisible, setFitBarsVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [jobPostingOpen, setJobPostingOpen] = useState(true);
  const [evidencePage, setEvidencePage] = useState<EvidencePage>(() => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < LAYOUT_MEDIUM_MIN_PX
    ) {
      return "stage";
    }
    return "resume";
  });
  const [askContextItems, setAskContextItems] = useState<AskContextItem[]>([]);
  const [pageBindingsVisible, setPageBindingsVisible] = useState(true);
  const [lineFocus, setLineFocus] = useState<LineFocus | null>(initialLineFocus);
  const [stageProjectId, setStageProjectId] = useState<string | null>(
    initialStageProjectId,
  );
  const clusterIdRef = useRef<string | null>(null);

  const selectLine = useCallback(
    (next: { kind: "project" | "jobLine"; id: string }) => {
      if (next.kind === "project") {
        setStageProjectId(next.id);
        return;
      }
      setLineFocus((current) => {
        if (
          current &&
          current.kind === next.kind &&
          current.id === next.id
        ) {
          return null;
        }
        return next;
      });
    },
    [],
  );

  const applyLineFocus = useCallback((next: LineFocus | null) => {
    setLineFocus((current) => (sameLineFocus(current, next) ? current : next));
  }, []);

  const applyStageProject = useCallback((id: string | null) => {
    setStageProjectId((current) => {
      if (current === id) return current;
      if (current && id && sameProjectId(current, id)) return current;
      return id;
    });
  }, []);

  const clearStageProject = useCallback(() => {
    setStageProjectId(null);
  }, []);

  const clearLineFocus = useCallback(() => {
    setLineFocus(null);
    setStageProjectId(null);
  }, []);

  const focusAnswer = useCallback(() => {
    setLineFocus({ kind: "answer" });
  }, []);

  const clearAskContext = useCallback(() => {
    setAskContextItems([]);
  }, []);

  const removeAskContext = useCallback((id: string) => {
    setAskContextItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleAskContext = useCallback(
    (item: Omit<AskContextItem, "label"> & { label?: string }) => {
      setAskContextItems((prev) => {
        if (prev.some((existing) => existing.id === item.id)) {
          return prev.filter((existing) => existing.id !== item.id);
        }
        const text = item.text.trim();
        if (!text) return prev;
        return [
          ...prev,
          {
            id: item.id,
            source: item.source,
            text,
            label: item.label?.trim() || askContextLabel(text),
          },
        ];
      });
    },
    [],
  );

  const setActiveCluster = useCallback((next: EvidenceCluster | null) => {
    const prevId = clusterIdRef.current;
    const nextId = next?.id ?? null;
    clusterIdRef.current = nextId;
    setActiveClusterState(next);

    if (prevId !== nextId) {
      setFocusedSectionId(firstSectionId(next));
      // New answer (or clear) → show page bindings again.
      setPageBindingsVisible(Boolean(next));
      if (next) setLineFocus({ kind: "answer" });
      else {
        setLineFocus((current) => (current?.kind === "answer" ? null : current));
      }
      return;
    }

    setFocusedSectionId((current) => {
      if (!next?.sections?.length) return null;
      if (current && next.sections.some((section) => section.id === current)) {
        return current;
      }
      return firstSectionId(next);
    });
  }, []);

  const clearActiveCluster = useCallback(() => {
    clusterIdRef.current = null;
    setActiveClusterState(null);
    setFocusedSectionId(null);
    setPageBindingsVisible(true);
    setLineFocus((current) => (current?.kind === "answer" ? null : current));
  }, []);

  const value = useMemo<ResumeHighlightContextValue>(() => {
    const emptyIds = new Set<string>();
    const highlightedIds = !pageBindingsVisible
      ? emptyIds
      : new Set(activeCluster ? idsFromCitations(activeCluster.citations) : []);

    const sections = activeCluster?.sections;
    let focusedIds = emptyIds;
    if (pageBindingsVisible && sections?.length) {
      // No open section → nothing focused; columns stay full (no roll).
      const match = focusedSectionId
        ? sections.find((section) => section.id === focusedSectionId)
        : undefined;
      if (match) {
        focusedIds = new Set(idsFromCitations(match.citations));
      }
    } else if (pageBindingsVisible) {
      focusedIds = highlightedIds;
    }

    return {
      activeCluster,
      setActiveCluster,
      clearActiveCluster,
      focusedSectionId,
      setFocusedSectionId,
      pageBindingsVisible,
      setPageBindingsVisible,
      highlightedIds,
      focusedIds,
      lineFocus,
      stageProjectId,
      selectLine,
      applyLineFocus,
      applyStageProject,
      clearStageProject,
      clearLineFocus,
      focusAnswer,
      density,
      setDensity,
      fitBarsVisible,
      setFitBarsVisible,
      timelineVisible,
      setTimelineVisible,
      jobPostingOpen,
      setJobPostingOpen,
      evidencePage,
      setEvidencePage,
      askContextItems,
      toggleAskContext,
      removeAskContext,
      clearAskContext,
    };
  }, [
    activeCluster,
    focusedSectionId,
    pageBindingsVisible,
    density,
    fitBarsVisible,
    timelineVisible,
    jobPostingOpen,
    evidencePage,
    askContextItems,
    lineFocus,
    stageProjectId,
    selectLine,
    applyLineFocus,
    applyStageProject,
    clearStageProject,
    clearLineFocus,
    focusAnswer,
    setActiveCluster,
    clearActiveCluster,
    toggleAskContext,
    removeAskContext,
    clearAskContext,
  ]);

  return (
    <ResumeHighlightContext.Provider value={value}>
      {children}
    </ResumeHighlightContext.Provider>
  );
}

export function useResumeHighlights() {
  const ctx = useContext(ResumeHighlightContext);
  if (!ctx)
    throw new Error(
      "useResumeHighlights must be used within ResumeHighlightProvider",
    );
  return ctx;
}
