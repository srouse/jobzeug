"use client";

import { useMemo } from "react";
import { useJobPosting } from "@/components/job-posting";
import {
  EMPTY_MATCH_EDGES,
  activeConnectionTarget,
} from "@/lib/connection-targets";
import { useResumeHighlights } from "./resume-highlight-context";

/** The single connection target the lines should follow right now. */
export function useActiveConnectionTarget() {
  const { lineFocus, focusedIds, pageBindingsVisible } = useResumeHighlights();
  const { data } = useJobPosting();
  const edges = data?.matchGraph?.edges ?? EMPTY_MATCH_EDGES;

  return useMemo(
    () =>
      activeConnectionTarget(lineFocus, edges, focusedIds, pageBindingsVisible),
    [lineFocus, edges, focusedIds, pageBindingsVisible],
  );
}
