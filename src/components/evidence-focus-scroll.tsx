"use client";

import { useEffect } from "react";
import { useResumeHighlights } from "@/components/resume-highlight-context";

/** First focused citation inside a scroll column, in DOM order. */
function firstFocusedInRoot(
  root: ParentNode,
  focusedIds: Set<string>,
): HTMLElement | null {
  const nodes = root.querySelectorAll<HTMLElement>("[data-evidence-id]");
  for (const node of nodes) {
    const id = node.getAttribute("data-evidence-id");
    if (id && focusedIds.has(id)) return node;
  }
  return null;
}

/**
 * When accordion focus changes, scroll the first focused citation in each
 * evidence column (resume + job posting) to the top of that column.
 */
export function EvidenceFocusScroll() {
  const { focusedIds, focusedSectionId, density } = useResumeHighlights();

  useEffect(() => {
    if (focusedIds.size === 0) return;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      const roots = document.querySelectorAll("[data-evidence-scroll]");
      for (const root of roots) {
        const el = firstFocusedInRoot(root, focusedIds);
        if (!el) continue;
        el.scrollIntoView({
          block: "start",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    };

    // Wait a frame (and one more after roll density) so layout settles.
    let timeout = 0;
    const frame = window.requestAnimationFrame(() => {
      run();
      timeout = window.setTimeout(run, density === "rolled" ? 420 : 0);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [focusedIds, focusedSectionId, density]);

  return null;
}
