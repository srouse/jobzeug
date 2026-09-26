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

export type ResumeDensity = "full" | "rolled";
/**
 * Foregrounded surface: medium uses resume|job; mobile also uses stage.
 * Wide shows resume + job together (value unused for visibility).
 */
export type EvidencePage = "resume" | "job" | "stage";
export type { AskContextItem, AskContextSource };

/** Wide three-column layout at/above this width. */
export const LAYOUT_WIDE_MIN_PX = 1400;
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
  /** Union of all turn citations — drives rollup (uncited → skeleton). */
  highlightedIds: Set<string>;
  /** Citations for the selected highlight section (selected / primary). */
  focusedIds: Set<string>;
  density: ResumeDensity;
  setDensity: (next: ResumeDensity) => void;
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

export function ResumeHighlightProvider({ children }: { children: ReactNode }) {
  const [activeCluster, setActiveClusterState] =
    useState<EvidenceCluster | null>(null);
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);
  const [density, setDensity] = useState<ResumeDensity>("rolled");
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
  const clusterIdRef = useRef<string | null>(null);

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
      density,
      setDensity,
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
    evidencePage,
    askContextItems,
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
