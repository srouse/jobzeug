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

export type ResumeDensity = "full" | "rolled";

type ResumeHighlightContextValue = {
  activeCluster: EvidenceCluster | null;
  setActiveCluster: (next: EvidenceCluster | null) => void;
  clearActiveCluster: () => void;
  /** Open accordion section id (themed answers). */
  focusedSectionId: string | null;
  setFocusedSectionId: (id: string | null) => void;
  /** Union of all turn citations — drives rollup (uncited → skeleton). */
  highlightedIds: Set<string>;
  /** Citations for the focused accordion section (blue). */
  focusedIds: Set<string>;
  /** Cited this turn but not in the focused section (gray). */
  dimmedIds: Set<string>;
  density: ResumeDensity;
  setDensity: (next: ResumeDensity) => void;
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
  const clusterIdRef = useRef<string | null>(null);

  const setActiveCluster = useCallback((next: EvidenceCluster | null) => {
    const prevId = clusterIdRef.current;
    const nextId = next?.id ?? null;
    clusterIdRef.current = nextId;
    setActiveClusterState(next);

    if (prevId !== nextId) {
      setFocusedSectionId(firstSectionId(next));
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
  }, []);

  const value = useMemo<ResumeHighlightContextValue>(() => {
    const highlightedIds = new Set(
      activeCluster ? idsFromCitations(activeCluster.citations) : [],
    );

    const sections = activeCluster?.sections;
    let focusedIds = new Set<string>();
    if (sections?.length) {
      // null focusedSectionId = all sections closed → everything dimmed.
      const match = focusedSectionId
        ? sections.find((section) => section.id === focusedSectionId)
        : undefined;
      if (match) {
        focusedIds = new Set(idsFromCitations(match.citations));
      }
    } else {
      focusedIds = highlightedIds;
    }

    const dimmedIds = new Set<string>();
    for (const id of highlightedIds) {
      if (!focusedIds.has(id)) dimmedIds.add(id);
    }

    return {
      activeCluster,
      setActiveCluster,
      clearActiveCluster,
      focusedSectionId,
      setFocusedSectionId,
      highlightedIds,
      focusedIds,
      dimmedIds,
      density,
      setDensity,
    };
  }, [
    activeCluster,
    focusedSectionId,
    density,
    setActiveCluster,
    clearActiveCluster,
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
