"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useJobPosting } from "@/components/job-posting";
import type { ConnectionTarget } from "@/lib/connection-targets";
import {
  LAYOUT_MEDIUM_MIN_PX,
  useResumeHighlights,
} from "../resume-highlight-context";
import { useActiveConnectionTarget } from "../use-connection-target";
import styles from "./evidence-connectors.module.css";

type ConnectorPath = {
  id: string;
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  focused: boolean;
  subject: boolean;
  opacity?: number;
};

/** Shared with the row wash so a click reads as one motion. */
const MORPH_MS = 700;

type Cubic = {
  x0: number;
  y0: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  x1: number;
  y1: number;
};

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function parseCubic(d: string): Cubic | null {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
  if (!nums || nums.length < 8) return null;
  const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = nums;
  if (
    x0 == null ||
    y0 == null ||
    c1x == null ||
    c1y == null ||
    c2x == null ||
    c2y == null ||
    x1 == null ||
    y1 == null
  ) {
    return null;
  }
  return { x0, y0, c1x, c1y, c2x, c2y, x1, y1 };
}

function formatCubic(cubic: Cubic): string {
  return `M ${cubic.x0} ${cubic.y0} C ${cubic.c1x} ${cubic.c1y}, ${cubic.c2x} ${cubic.c2y}, ${cubic.x1} ${cubic.y1}`;
}

function lerpCubic(from: Cubic, to: Cubic, t: number): Cubic {
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    x0: mix(from.x0, to.x0),
    y0: mix(from.y0, to.y0),
    c1x: mix(from.c1x, to.c1x),
    c1y: mix(from.c1y, to.c1y),
    c2x: mix(from.c2x, to.c2x),
    c2y: mix(from.c2y, to.c2y),
    x1: mix(from.x1, to.x1),
    y1: mix(from.y1, to.y1),
  };
}

function pathSide(path: ConnectorPath): "l" | "r" {
  const cubic = parseCubic(path.d);
  if (!cubic) return "l";
  return cubic.x0 <= cubic.x1 ? "l" : "r";
}

function rankObjects(paths: ConnectorPath[]): ConnectorPath[] {
  const out: ConnectorPath[] = [];
  for (const side of ["l", "r"] as const) {
    const ranked = paths
      .filter((path) => !path.subject && pathSide(path) === side)
      .sort((a, b) => a.start.y - b.start.y);
    ranked.forEach((path, index) => {
      out.push({ ...path, id: `${side}-${index}` });
    });
  }
  return out;
}

/** Subject keeps a fixed key so it never slides with the object lines. */
function withStableIds(paths: ConnectorPath[]): ConnectorPath[] {
  const subject = paths.find((path) => path.subject);
  return [
    ...(subject ? [{ ...subject, id: "subject", opacity: 1 }] : []),
    ...rankObjects(paths),
  ];
}

/** Slide direct-object curves. The subject line is already at its destination. */
function blendPaths(
  from: ConnectorPath[],
  to: ConnectorPath[],
  t: number,
): ConnectorPath[] {
  const eased = easeInOut(t);
  const fromSubject = from.find((path) => path.subject);
  const toSubject = to.find((path) => path.subject);
  const fromSubjectSide = fromSubject ? pathSide(fromSubject) : null;
  const toSubjectSide = toSubject ? pathSide(toSubject) : null;
  const out: ConnectorPath[] = [];
  for (const side of ["l", "r"] as const) {
    // A page that just became the subject drops its blue lines immediately.
    if (toSubjectSide === side && fromSubjectSide !== side) continue;
    const source = from
      .filter((path) => !path.subject && pathSide(path) === side)
      .sort((a, b) => a.start.y - b.start.y);
    const dest = to
      .filter((path) => !path.subject && pathSide(path) === side)
      .sort((a, b) => a.start.y - b.start.y);
    const count = Math.max(source.length, dest.length);
    for (let index = 0; index < count; index++) {
      const src = source[index];
      const dst = dest[index];
      const id = `${side}-${index}`;
      if (src && dst) {
        const fromCubic = parseCubic(src.d);
        const toCubic = parseCubic(dst.d);
        const geom =
          fromCubic && toCubic
            ? lerpCubic(fromCubic, toCubic, eased)
            : (toCubic ?? fromCubic);
        if (!geom) continue;
        out.push({
          id,
          d: formatCubic(geom),
          start: { x: geom.x0, y: geom.y0 },
          end: { x: geom.x1, y: geom.y1 },
          focused: dst.focused,
          subject: false,
          opacity: 1,
        });
      } else if (dst) {
        out.push({ ...dst, id, subject: false, opacity: eased });
      } else if (src && 1 - eased > 0.02) {
        out.push({ ...src, id, subject: false, opacity: 1 - eased });
      }
    }
  }
  const subject = to.find((path) => path.subject);
  if (subject) out.push({ ...subject, id: "subject", opacity: 1 });
  return out;
}

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
  primary: boolean;
  subject: boolean;
};

function measurePaths(target: ConnectionTarget | null): ConnectorPath[] {
  if (!target || target.ids.length === 0) return [];
  const card = document.querySelector<HTMLElement>("[data-answer-stage-card]");
  if (!card) return [];

  const cardRect = card.getBoundingClientRect();
  if (cardRect.width <= 0 || cardRect.height <= 0) return [];

  const roots = activeScrollRoots();
  if (roots.length === 0) return [];

  const attach = cardAttachRange(card, cardRect);
  const midX = window.innerWidth / 2;
  const drafts: DraftPath[] = [];

  for (const endpoint of target.ids) {
    const id = endpoint.id;
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
      primary: endpoint.role !== "subject" && endpoint.strength === "primary",
      subject: endpoint.role === "subject",
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
      focused: draft.primary,
      subject: draft.subject,
    };
  });
}

/**
 * SVG connectors from evidence rows into the stage card edge.
 * One focus at a time chooses the rows. The lines still meet the card the
 * same way: row edge to card edge, kept clear of the footer.
 *
 * Measures only active evidence panes (both on wide; selected tab on medium).
 * Remeasures on focus / density / evidence-page / job load / DOM mutations.
 */
export function EvidenceConnectors() {
  const { density, evidencePage } = useResumeHighlights();
  const target = useActiveConnectionTarget();
  const { data: jobPosting, loading: jobLoading, busy: jobBusy } =
    useJobPosting();
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const pathsRef = useRef(paths);
  pathsRef.current = paths;
  const [connectorsOn, setConnectorsOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${LAYOUT_MEDIUM_MIN_PX}px)`);
    const sync = () => setConnectorsOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!connectorsOn || !target) {
      setPaths([]);
      return;
    }

    let frame = 0;
    let secondFrame = 0;
    let densityLoop = 0;
    let densityDeadline = 0;
    let morphFrame = 0;
    let morphing = false;
    const DENSITY_REMEASURE_MS = 450;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const commit = (next: ConnectorPath[]) => {
      const stable = withStableIds(next);
      pathsRef.current = stable;
      setPaths(stable);
    };

    const measure = () => {
      if (morphing) return;
      commit(measurePaths(target));
    };

    const stopMorph = () => {
      morphing = false;
      if (morphFrame) {
        window.cancelAnimationFrame(morphFrame);
        morphFrame = 0;
      }
    };

    const startMorph = () => {
      const from = pathsRef.current;
      if (reduceMotion || from.length === 0) {
        commit(measurePaths(target));
        return;
      }
      stopMorph();
      morphing = true;
      const started = performance.now();
      const tick = (now: number) => {
        const dest = measurePaths(target);
        const t = Math.min(1, (now - started) / MORPH_MS);
        const blended = blendPaths(from, dest, t);
        pathsRef.current = blended;
        setPaths(blended);
        if (t < 1) {
          morphFrame = window.requestAnimationFrame(tick);
          return;
        }
        morphing = false;
        morphFrame = 0;
        commit(dest);
      };
      morphFrame = window.requestAnimationFrame(tick);
    };

    const schedule = (snap: boolean) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (snap) stopMorph();
        else if (morphing) return;
        measure();
        // Second frame: BoundPanel / resume rows may still be laying out.
        if (secondFrame) window.cancelAnimationFrame(secondFrame);
        secondFrame = window.requestAnimationFrame(() => {
          secondFrame = 0;
          if (snap) stopMorph();
          else if (morphing) return;
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

    startMorph();
    startDensityLoop();

    const snapToRows = () => schedule(true);
    const followLayout = () => schedule(false);
    const scrollRoots = activeScrollRoots();
    for (const root of scrollRoots) {
      root.addEventListener("scroll", snapToRows, { passive: true });
    }
    window.addEventListener("resize", snapToRows);

    const card = document.querySelector("[data-answer-stage-card]");
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(followLayout)
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
                  followLayout();
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
                  followLayout();
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
      if (morphFrame) window.cancelAnimationFrame(morphFrame);
      for (const root of scrollRoots) {
        root.removeEventListener("scroll", snapToRows);
      }
      window.removeEventListener("resize", snapToRows);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [
    connectorsOn,
    target,
    density,
    evidencePage,
    // Rebind observers when the posting panel swaps loading ↔ BoundPanel.
    jobPosting?.entryId,
    jobLoading,
    jobBusy,
  ]);

  if (!connectorsOn || paths.length === 0) return null;

  return (
    <svg
      className={styles.overlay}
      width="100%"
      height="100%"
      aria-hidden
    >
      {[...paths]
        .sort(
          (a, b) =>
            Number(a.focused) + Number(a.subject) * 2 -
            (Number(b.focused) + Number(b.subject) * 2),
        )
        .map((path) => (
        <g key={path.id} opacity={path.opacity ?? 1}>
          <path
            d={path.d}
            className={
              path.subject
                ? styles.lineSubject
                : path.focused
                  ? styles.line
                  : styles.lineDimmed
            }
            fill="none"
          />
          <circle
            className={
              path.subject
                ? styles.dotSubject
                : path.focused
                  ? styles.dot
                  : styles.dotDimmed
            }
            cx={path.subject ? path.end.x : path.start.x}
            cy={path.subject ? path.end.y : path.start.y}
            r={DOT_RADIUS}
          />
        </g>
      ))}
    </svg>
  );
}
