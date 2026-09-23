"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  idsFromCitations,
  type EvidenceCluster,
} from "@/lib/evidence-citations";

type ResumeHighlightContextValue = {
  activeCluster: EvidenceCluster | null;
  setActiveCluster: (next: EvidenceCluster | null) => void;
  clearActiveCluster: () => void;
  highlightedIds: Set<string>;
};

const ResumeHighlightContext = createContext<ResumeHighlightContextValue | null>(null);

export function ResumeHighlightProvider({ children }: { children: ReactNode }) {
  const [activeCluster, setActiveCluster] = useState<EvidenceCluster | null>(null);
  const value = useMemo<ResumeHighlightContextValue>(
    () => ({
      activeCluster,
      setActiveCluster,
      clearActiveCluster: () => setActiveCluster(null),
      highlightedIds: new Set(
        activeCluster ? idsFromCitations(activeCluster.citations) : [],
      ),
    }),
    [activeCluster],
  );
  return (
    <ResumeHighlightContext.Provider value={value}>{children}</ResumeHighlightContext.Provider>
  );
}

export function useResumeHighlights() {
  const ctx = useContext(ResumeHighlightContext);
  if (!ctx) throw new Error("useResumeHighlights must be used within ResumeHighlightProvider");
  return ctx;
}
