"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  emptyCitations,
  type CiteEvidencePayload,
} from "@/lib/evidence-citations";

export type ResumeCitations = CiteEvidencePayload;
export type ResumeHighlightMode = "titles" | "rollup";

type ResumeHighlightContextValue = {
  citations: ResumeCitations;
  setCitations: (next: ResumeCitations) => void;
  clearCitations: () => void;
  highlightedIds: Set<string>;
  highlightMode: ResumeHighlightMode;
  setHighlightMode: (mode: ResumeHighlightMode) => void;
};

const ResumeHighlightContext = createContext<ResumeHighlightContextValue | null>(null);

export function ResumeHighlightProvider({ children }: { children: ReactNode }) {
  const [citations, setCitations] = useState<ResumeCitations>(emptyCitations);
  const [highlightMode, setHighlightMode] = useState<ResumeHighlightMode>("titles");
  const value = useMemo<ResumeHighlightContextValue>(
    () => ({
      citations,
      setCitations,
      clearCitations: () => setCitations(emptyCitations),
      highlightedIds: new Set([
        ...citations.employers,
        ...citations.roles,
        ...citations.projects,
      ]),
      highlightMode,
      setHighlightMode,
    }),
    [citations, highlightMode],
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
