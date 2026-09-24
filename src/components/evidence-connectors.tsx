"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useJobPosting } from "@/components/job-posting";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import styles from "./evidence-connectors.module.css";

type ConnectorPath = {
  id: string;
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  focused: boolean;
};

const DESKTOP_MIN = 960;
const DOT_RADIUS = 4;
/** Keep card-side attachments clear of rounded corners. */
const CARD_EDGE_PAD = 20;
/** Inset attach Y below header / above footer so dots clear the body border. */
const ATTACH_BAND_INSET = 2;
/**
 * Minimum horizontal pull for the stage-side cubic handle so lines leave
 * the card edge more straight before bending toward the citation.
 */
const CARD_EXIT_HANDLE = 50;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cubicHorizontal(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): string {
  const span = Math.abs(x1 - x0);
  const sourceHandle = span * 0.5;
  // Stage is always the path end (x1,y1); keep a longer outward tangent there.
  const cardHandle = Math.max(span * 0.5, CARD_EXIT_HANDLE);
  const c1x = x0 < x1 ? x0 + sourceHandle : x0 - sourceHandle;
  const c2x = x0 < x1 ? x1 - cardHandle : x1 + cardHandle;
  return `M ${x0} ${y0} C ${c1x} ${y0}, ${c2x} ${y1}, ${x1} ${y1}`;
}

function cardAttachRange(card: HTMLElement, cardRect: DOMRect) {
  const header = card.querySelector<HTMLElement>("[data-answer-stage-header]");
  const footer = card.querySelector<HTMLElement>("[data-answer-stage-footer]");
  const headerRect = header?.getBoundingClientRect();
  const footerRect = footer?.getBoundingClientRect();

  // Attach along the body band: just inside the header/footer dividers.
  const top = headerRect
    ? headerRect.bottom + ATTACH_BAND_INSET
    : cardRect.top + CARD_EDGE_PAD;
  const bottom = footerRect
    ? footerRect.top - ATTACH_BAND_INSET
    : cardRect.bottom - CARD_EDGE_PAD;

  if (bottom <= top) {
    const mid = cardRect.top + cardRect.height / 2;
    return { top: mid, bottom: mid };
  }
  return { top, bottom };
}

function measurePaths(
  highlightedIds: Set<string>,
  focusedIds: Set<string>,
): ConnectorPath[] {
  const card = document.querySelector<HTMLElement>("[data-answer-stage-card]");
  if (!card || highlightedIds.size === 0) return [];

  const cardRect = card.getBoundingClientRect();
  if (cardRect.width <= 0 || cardRect.height <= 0) return [];

  const attach = cardAttachRange(card, cardRect);
  const midX = window.innerWidth / 2;
  const paths: ConnectorPath[] = [];

  for (const id of highlightedIds) {
    const el = document.querySelector<HTMLElement>(
      `[data-evidence-id="${CSS.escape(id)}"]`,
    );
    if (!el) continue;

    const sourceRect = el.getBoundingClientRect();
    if (sourceRect.width <= 0 && sourceRect.height <= 0) continue;

    const fromLeft = sourceRect.left + sourceRect.width / 2 < midX;
    const startX = fromLeft ? sourceRect.right : sourceRect.left;
    const endX = fromLeft ? cardRect.left : cardRect.right;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endY = clamp(startY, attach.top, attach.bottom);

    paths.push({
      id,
      d: cubicHorizontal(startX, startY, endX, endY),
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      focused: focusedIds.has(id),
    });
  }

  return paths;
}

/**
 * SVG connectors from cited resume/job rows into the answer stage card.
 * Always row-edge → card-edge beziers (including when the row is scrolled
 * off-screen), so lines keep running toward the real citation.
 *
 * Remeasures when the active cluster changes, when density rolls/unrolls
 * (rAF loop through the CSS transition), when the job posting finishes
 * loading, and when evidence nodes appear via MutationObserver.
 */
export function EvidenceConnectors() {
  const { highlightedIds, focusedIds, activeCluster, density } =
    useResumeHighlights();
  const { data: jobPosting, loading: jobLoading, busy: jobBusy } =
    useJobPosting();
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!desktop || !activeCluster || highlightedIds.size === 0) {
      setPaths([]);
      return;
    }

    let frame = 0;
    let secondFrame = 0;
    let densityLoop = 0;
    let densityDeadline = 0;
    const DENSITY_REMEASURE_MS = 450;

    const measure = () => {
      setPaths(measurePaths(highlightedIds, focusedIds));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
        // Second frame: BoundPanel / resume rows may still be laying out.
        if (secondFrame) window.cancelAnimationFrame(secondFrame);
        secondFrame = window.requestAnimationFrame(() => {
          secondFrame = 0;
          measure();
        });
      });
    };

    const tickDensity = (now: number) => {
      measure();
      if (now < densityDeadline) {
        densityLoop = window.requestAnimationFrame(tickDensity);
      } else {
        densityLoop = 0;
      }
    };

    const startDensityLoop = () => {
      if (densityLoop) window.cancelAnimationFrame(densityLoop);
      densityDeadline = performance.now() + DENSITY_REMEASURE_MS;
      densityLoop = window.requestAnimationFrame(tickDensity);
    };

    schedule();
    startDensityLoop();

    const scrollRoots = document.querySelectorAll("[data-evidence-scroll]");
    for (const root of scrollRoots) {
      root.addEventListener("scroll", schedule, { passive: true });
    }
    window.addEventListener("resize", schedule);

    const card = document.querySelector("[data-answer-stage-card]");
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;
    if (resizeObserver) {
      if (card) resizeObserver.observe(card);
      for (const root of scrollRoots) resizeObserver.observe(root);
    }

    // Citation nodes often mount after job-posting / resume fetch — remasure then.
    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver((records) => {
            for (const record of records) {
              if (record.type === "attributes") {
                if (record.attributeName === "data-evidence-id") {
                  schedule();
                  return;
                }
                continue;
              }
              for (const node of record.addedNodes) {
                if (!(node instanceof Element)) continue;
                if (
                  node.hasAttribute("data-evidence-id") ||
                  node.hasAttribute("data-evidence-scroll") ||
                  node.querySelector("[data-evidence-id], [data-evidence-scroll]")
                ) {
                  schedule();
                  return;
                }
              }
            }
          })
        : null;
    if (mutationObserver) {
      mutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-evidence-id"],
      });
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
      if (densityLoop) window.cancelAnimationFrame(densityLoop);
      for (const root of scrollRoots) {
        root.removeEventListener("scroll", schedule);
      }
      window.removeEventListener("resize", schedule);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [
    desktop,
    activeCluster,
    highlightedIds,
    focusedIds,
    density,
    // Rebind observers when the posting panel swaps loading ↔ BoundPanel.
    jobPosting?.entryId,
    jobLoading,
    jobBusy,
  ]);

  if (!desktop || !activeCluster || paths.length === 0) return null;

  return (
    <svg
      className={styles.overlay}
      width="100%"
      height="100%"
      aria-hidden
    >
      {paths
        .slice()
        .sort((a, b) => Number(a.focused) - Number(b.focused))
        .map((path) => (
        <g key={path.id}>
          <path
            d={path.d}
            className={path.focused ? styles.line : styles.lineDimmed}
            fill="none"
          />
          <circle
            className={path.focused ? styles.dot : styles.dotDimmed}
            cx={path.start.x}
            cy={path.start.y}
            r={DOT_RADIUS}
          />
        </g>
      ))}
    </svg>
  );
}
