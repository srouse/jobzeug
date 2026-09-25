"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useJobPosting } from "@/components/job-posting";
import {
  LAYOUT_MEDIUM_MIN_PX,
  useResumeHighlights,
} from "../resume-highlight-context";
import styles from "./evidence-connectors.module.css";

type ConnectorPath = {
  id: string;
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  focused: boolean;
};

const DOT_RADIUS = 4;
/** Keep card-side attachments clear of rounded corners. */
const CARD_EDGE_PAD = 20;
/** Extra clearance below page headers so lines stay visible under the divider. */
const PAGE_HEADER_CLEARANCE = 20;
/** Inset above the stage footer so dots clear the footer border. */
const FOOTER_ATTACH_INSET = 2;
/** Stage-side attach band height, centered on the card. */
const STAGE_ATTACH_BAND_MAX = 200;
/** Minimum vertical gap between stage attach points (no shared Y). */
const STAGE_ATTACH_GAP = 4;
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

/** Bottom edge of the fixed resume / job page headers (hard ceiling for lines). */
function pageHeaderFloor(): number {
  const headers = document.querySelectorAll<HTMLElement>(
    "[data-evidence-page-header]",
  );
  let bottom = 0;
  for (const header of headers) {
    const rect = header.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    bottom = Math.max(bottom, rect.bottom);
  }
  return bottom;
}

/**
 * Stage attach Y band: up to STAGE_ATTACH_BAND_MAX tall, centered on the
 * card, then clipped to page-header floor / footer so lines stay clear.
 */
function cardAttachRange(card: HTMLElement, cardRect: DOMRect) {
  const footer = card.querySelector<HTMLElement>("[data-answer-stage-footer]");
  const footerRect = footer?.getBoundingClientRect();

  const pageFloor = pageHeaderFloor();
  const hardTop =
    pageFloor > 0
      ? pageFloor + PAGE_HEADER_CLEARANCE
      : cardRect.top + CARD_EDGE_PAD;
  const hardBottom = footerRect
    ? footerRect.top - FOOTER_ATTACH_INSET
    : cardRect.bottom - CARD_EDGE_PAD;

  const midY = cardRect.top + cardRect.height / 2;
  const half = STAGE_ATTACH_BAND_MAX / 2;
  let top = midY - half;
  let bottom = midY + half;

  // Clip the centered band into the legal stage body.
  top = Math.max(top, hardTop);
  bottom = Math.min(bottom, hardBottom);

  if (bottom <= top) {
    const mid = clamp(midY, hardTop, Math.max(hardBottom, hardTop));
    return { top: mid, bottom: mid };
  }
  return { top, bottom };
}

/**
 * Resolve preferred attach Ys into unique positions with ≥ gap between
 * neighbors. Order follows citation startY (top→bottom) so curves never
 * cross when fanning into the stage band.
 */
function spreadAttachYs(
  startYs: number[],
  preferred: number[],
  top: number,
  bottom: number,
  gap: number,
): number[] {
  const n = preferred.length;
  if (n === 0) return [];
  if (bottom < top) {
    const mid = (top + bottom) / 2;
    return preferred.map(() => mid);
  }
  if (n === 1) return [clamp(preferred[0]!, top, bottom)];

  // Keep document / citation sequence — not preferred-Y order.
  const order = startYs
    .map((y, i) => ({ y, i }))
    .sort((a, b) => a.y - b.y || a.i - b.i);

  const placed = order.map((entry) =>
    clamp(preferred[entry.i]!, top, bottom),
  );

  placed[0] = Math.max(placed[0]!, top);
  for (let i = 1; i < n; i++) {
    placed[i] = Math.max(placed[i]!, placed[i - 1]! + gap);
  }

  if (placed[n - 1]! > bottom) {
    placed[n - 1] = bottom;
    for (let i = n - 2; i >= 0; i--) {
      placed[i] = Math.min(placed[i]!, placed[i + 1]! - gap);
    }
  }

  if (placed[0]! < top) {
    const span = bottom - top;
    const need = (n - 1) * gap;
    if (need >= span) {
      for (let i = 0; i < n; i++) {
        placed[i] = top + (span * i) / (n - 1);
      }
    } else {
      const shift = top - placed[0]!;
      for (let i = 0; i < n; i++) placed[i] = placed[i]! + shift;
    }
  }

  const result = new Array<number>(n);
  for (let k = 0; k < n; k++) {
    result[order[k]!.i] = placed[k]!;
  }
  return result;
}

/** Active evidence scroll roots (wide: both; medium: selected tab only). */
function activeScrollRoots(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-evidence-pane-active] [data-evidence-scroll]",
    ),
  );
}

type DraftPath = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  preferredEndY: number;
  fromLeft: boolean;
};

function measurePaths(focusedIds: Set<string>): ConnectorPath[] {
  const card = document.querySelector<HTMLElement>("[data-answer-stage-card]");
  if (!card || focusedIds.size === 0) return [];

  const cardRect = card.getBoundingClientRect();
  if (cardRect.width <= 0 || cardRect.height <= 0) return [];

  const roots = activeScrollRoots();
  if (roots.length === 0) return [];

  const attach = cardAttachRange(card, cardRect);
  const midX = window.innerWidth / 2;
  const drafts: DraftPath[] = [];

  for (const id of focusedIds) {
    let el: HTMLElement | null = null;
    for (const root of roots) {
      el = root.querySelector<HTMLElement>(
        `[data-evidence-id="${CSS.escape(id)}"]`,
      );
      if (el) break;
    }
    if (!el) continue;

    const sourceRect = el.getBoundingClientRect();
    if (sourceRect.width <= 0 && sourceRect.height <= 0) continue;

    const fromLeft = sourceRect.left + sourceRect.width / 2 < midX;
    const startX = fromLeft ? sourceRect.right : sourceRect.left;
    const endX = fromLeft ? cardRect.left : cardRect.right;
    // Start follows the citation even when it scrolls under the page header.
    const startY = sourceRect.top + sourceRect.height / 2;
    const preferredEndY = clamp(startY, attach.top, attach.bottom);

    drafts.push({
      id,
      startX,
      startY,
      endX,
      preferredEndY,
      fromLeft,
    });
  }

  // Stack attach points per stage edge so left/right never share a Y.
  const leftIdx: number[] = [];
  const rightIdx: number[] = [];
  for (let i = 0; i < drafts.length; i++) {
    if (drafts[i]!.fromLeft) leftIdx.push(i);
    else rightIdx.push(i);
  }

  const endYs = new Array<number>(drafts.length);
  const placeSide = (indices: number[]) => {
    const startYs = indices.map((i) => drafts[i]!.startY);
    const preferred = indices.map((i) => drafts[i]!.preferredEndY);
    const spread = spreadAttachYs(
      startYs,
      preferred,
      attach.top,
      attach.bottom,
      STAGE_ATTACH_GAP,
    );
    for (let k = 0; k < indices.length; k++) {
      endYs[indices[k]!] = spread[k]!;
    }
  };
  placeSide(leftIdx);
  placeSide(rightIdx);

  return drafts.map((draft, i) => {
    const endY = endYs[i]!;
    return {
      id: draft.id,
      d: cubicHorizontal(draft.startX, draft.startY, draft.endX, endY),
      start: { x: draft.startX, y: draft.startY },
      end: { x: draft.endX, y: endY },
      focused: true,
    };
  });
}

/**
 * SVG connectors from cited resume/job rows into the answer stage card.
 * Always row-edge → card-edge beziers (including when the row is scrolled
 * off-screen), so lines keep running toward the real citation.
 *
 * Measures only active evidence panes (both on wide; selected tab on medium).
 * Remeasures on cluster / density / evidence-page / job load / DOM mutations.
 */
export function EvidenceConnectors() {
  const { focusedIds, activeCluster, density, evidencePage } =
    useResumeHighlights();
  const { data: jobPosting, loading: jobLoading, busy: jobBusy } =
    useJobPosting();
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const [connectorsOn, setConnectorsOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${LAYOUT_MEDIUM_MIN_PX}px)`);
    const sync = () => setConnectorsOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!connectorsOn || !activeCluster || focusedIds.size === 0) {
      setPaths([]);
      return;
    }

    let frame = 0;
    let secondFrame = 0;
    let densityLoop = 0;
    let densityDeadline = 0;
    const DENSITY_REMEASURE_MS = 450;

    const measure = () => {
      setPaths(measurePaths(focusedIds));
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

    const scrollRoots = activeScrollRoots();
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
                if (
                  record.attributeName === "data-evidence-id" ||
                  record.attributeName === "data-evidence-pane-active"
                ) {
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
                  node.querySelector(
                    "[data-evidence-id], [data-evidence-scroll]",
                  )
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
        attributeFilter: [
          "data-evidence-id",
          "data-evidence-pane-active",
        ],
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
    connectorsOn,
    activeCluster,
    focusedIds,
    density,
    evidencePage,
    // Rebind observers when the posting panel swaps loading ↔ BoundPanel.
    jobPosting?.entryId,
    jobLoading,
    jobBusy,
  ]);

  if (!connectorsOn || !activeCluster || paths.length === 0) return null;

  return (
    <svg
      className={styles.overlay}
      width="100%"
      height="100%"
      aria-hidden
    >
      {paths.map((path) => (
        <g key={path.id}>
          <path d={path.d} className={styles.line} fill="none" />
          <circle
            className={styles.dot}
            cx={path.start.x}
            cy={path.start.y}
            r={DOT_RADIUS}
          />
        </g>
      ))}
    </svg>
  );
}
