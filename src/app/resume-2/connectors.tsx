"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { sameProjectId } from "./project-presentation/project-presentation";
import styles from "./connectors.module.css";

/** Line morph. Matches the resume connectors. */
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

type ConnectorPath = {
  id: string;
  d: string;
  strong: boolean;
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

function cubicHorizontal(x0: number, y0: number, x1: number, y1: number): string {
  const span = Math.abs(x1 - x0);
  const handle = span * 0.5;
  const c1x = x0 < x1 ? x0 + handle : x0 - handle;
  const c2x = x0 < x1 ? x1 - handle : x1 + handle;
  return `M ${x0} ${y0} C ${c1x} ${y0}, ${c2x} ${y1}, ${x1} ${y1}`;
}

/** Straight segment as a cubic so it can morph with the curves. */
function linearCubic(x0: number, y0: number, x1: number, y1: number): string {
  const c1x = x0 + (x1 - x0) / 3;
  const c1y = y0 + (y1 - y0) / 3;
  const c2x = x0 + ((x1 - x0) * 2) / 3;
  const c2y = y0 + ((y1 - y0) * 2) / 3;
  return `M ${x0} ${y0} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x1} ${y1}`;
}

function pxVar(style: CSSStyleDeclaration, name: string, fallback: number): number {
  const value = Number.parseFloat(style.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

type Stack = {
  left: number;
  right: number;
  centers: Map<string, number>;
};

/**
 * Final row centers from the fixed closed/open sizes. Ignores the in-flight
 * height transition, which is what was leaving the measured lines behind.
 */
function stackCenters(
  orderedIds: readonly string[],
  projectIds: readonly string[],
): Stack | null {
  const scroller = document.querySelector<HTMLElement>("[data-resume2-scroll]");
  const list = scroller?.querySelector<HTMLElement>("[data-resume2-list]");
  if (!scroller || !list || orderedIds.length === 0) return null;

  const listStyle = getComputedStyle(list);
  const closed = pxVar(listStyle, "--project-closed", 6);
  const open = pxVar(listStyle, "--project-open", 74);
  const gap = pxVar(listStyle, "--project-gap", 4);
  const openSet = new Set(projectIds);

  const heightOf = (id: string) => {
    const isOpen = openSet.has(id) || projectIds.some((openId) => sameProjectId(openId, id));
    return isOpen ? open : closed;
  };

  let content = 0;
  orderedIds.forEach((id, index) => {
    content += heightOf(id);
    if (index < orderedIds.length - 1) content += gap;
  });

  const scrollerStyle = getComputedStyle(scroller);
  const padTop = Number.parseFloat(scrollerStyle.paddingTop) || 0;
  const padBottom = Number.parseFloat(scrollerStyle.paddingBottom) || 0;
  const free = scroller.clientHeight - padTop - padBottom - content;
  const leading = free > 0 ? free / 2 : 0;
  let y =
    scroller.getBoundingClientRect().top + padTop + leading - scroller.scrollTop;

  const centers = new Map<string, number>();
  orderedIds.forEach((id, index) => {
    const height = heightOf(id);
    centers.set(id, y + height / 2);
    y += height;
    if (index < orderedIds.length - 1) y += gap;
  });

  const listRect = list.getBoundingClientRect();
  return { left: listRect.left, right: listRect.right, centers };
}

function centerOf(stack: Stack, projectId: string): number | null {
  const direct = stack.centers.get(projectId);
  if (direct != null) return direct;
  for (const [id, y] of stack.centers) {
    if (sameProjectId(id, projectId)) return y;
  }
  return null;
}

function measure(
  lineId: string,
  orderedIds: readonly string[],
  projectIds: readonly string[],
): ConnectorPath[] {
  const job = document.querySelector<HTMLElement>("[data-resume2-job]");
  const line = job?.querySelector<HTMLElement>(
    `[data-evidence-id="${CSS.escape(lineId)}"]`,
  );
  const stack = stackCenters(orderedIds, projectIds);
  if (!line || !stack) return [];
  const lineRect = line.getBoundingClientRect();
  if (lineRect.width <= 0 || lineRect.height <= 0) return [];

  const startX = lineRect.right;
  const startY = lineRect.top + lineRect.height / 2;
  const paths: ConnectorPath[] = [];

  const ends = projectIds
    .map((projectId) => ({ endY: centerOf(stack, projectId) }))
    .filter((row): row is { endY: number } => row.endY != null)
    .sort((a, b) => a.endY - b.endY);

  ends.forEach((row, index) => {
    paths.push({
      id: `slot-${index}`,
      d: cubicHorizontal(startX, startY, stack.left, row.endY),
      strong: false,
    });
  });
  return paths;
}

const STAGE_LINK = "stage-link";

/** Straight line from the open project card to the left edge of the stage. */
function stageLink(
  stageProjectId: string | null,
  orderedIds: readonly string[],
  projectIds: readonly string[],
): ConnectorPath | null {
  if (!stageProjectId) return null;
  const stack = stackCenters(orderedIds, projectIds);
  const stage = document.querySelector<HTMLElement>("[data-answer-stage-card]");
  if (!stack || !stage) return null;
  const y0 = centerOf(stack, stageProjectId);
  const stageRect = stage.getBoundingClientRect();
  if (y0 == null || stageRect.width <= 0 || stageRect.height <= 0) return null;
  const y1 = Math.min(Math.max(y0, stageRect.top), stageRect.bottom);
  return {
    id: STAGE_LINK,
    d: linearCubic(stack.right, y0, stageRect.left, y1),
    strong: true,
  };
}

function blend(
  from: ConnectorPath[],
  to: ConnectorPath[],
  t: number,
): ConnectorPath[] {
  const eased = easeInOut(t);
  const fromById = new Map(from.map((path) => [path.id, path]));
  return to.map((path) => {
    const previous = fromById.get(path.id);
    const fromCubic = previous ? parseCubic(previous.d) : null;
    const toCubic = parseCubic(path.d);
    if (!fromCubic || !toCubic) return path;
    const mixed = lerpCubic(fromCubic, toCubic, eased);
    if (path.id.startsWith("slot-")) {
      mixed.x0 = toCubic.x0;
      mixed.y0 = toCubic.y0;
      mixed.c1x = toCubic.c1x;
      mixed.c1y = toCubic.c1y;
    }
    return { ...path, d: formatCubic(mixed) };
  });
}

/**
 * Curves from the selected job line to the top three cards, plus a straight
 * line from the open project to the stage.
 */
export function ResumeConnectors({
  enabled,
  lineId,
  orderedIds,
  projectIds,
  stageProjectId,
}: {
  enabled: boolean;
  lineId: string | null;
  orderedIds: readonly string[];
  projectIds: readonly string[];
  stageProjectId: string | null;
}) {
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const pathsRef = useRef<ConnectorPath[]>([]);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let morphFrame = 0;
    let disposed = false;

    const commit = (next: ConnectorPath[]) => {
      if (disposed) return;
      pathsRef.current = next;
      setPaths(next);
    };

    const read = () => {
      const curves = enabled && lineId ? measure(lineId, orderedIds, projectIds) : [];
      const link = stageLink(stageProjectId, orderedIds, projectIds);
      return link ? [...curves, link] : curves;
    };

    const stopMorph = () => {
      if (morphFrame) {
        window.cancelAnimationFrame(morphFrame);
        morphFrame = 0;
      }
    };

    const startMorph = () => {
      const from = pathsRef.current;
      const dest = read();
      if (reduceMotion || from.length === 0) {
        commit(dest);
        return;
      }
      stopMorph();
      const started = performance.now();
      commit(blend(from, dest, 0));
      const tick = (now: number) => {
        if (disposed) return;
        const next = read();
        const t = Math.min(1, (now - started) / MORPH_MS);
        const blended = blend(from, next, t);
        pathsRef.current = blended;
        setPaths(blended);
        if (t < 1) {
          morphFrame = window.requestAnimationFrame(tick);
          return;
        }
        morphFrame = 0;
        commit(next);
      };
      morphFrame = window.requestAnimationFrame(tick);
    };

    const snap = () => {
      if (morphFrame || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (morphFrame) return;
        commit(read());
      });
    };

    const drawing = Boolean((enabled && lineId) || stageProjectId);

    const kick = window.requestAnimationFrame(() => {
      if (!drawing) {
        commit([]);
        return;
      }
      startMorph();
    });

    const scrolls = drawing
      ? Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-resume2-job] [data-evidence-scroll], [data-resume2-scroll], [data-answer-stage-card]",
          ),
        )
      : [];
    for (const root of scrolls) {
      root.addEventListener("scroll", snap, { passive: true });
    }
    if (drawing) window.addEventListener("resize", snap);

    const observed = drawing
      ? [
          document.querySelector("[data-resume2-job]"),
          document.querySelector("[data-resume2-scroll]"),
          document.querySelector("[data-answer-stage-card]"),
        ].filter((node): node is Element => node != null)
      : [];
    const resizeObserver = drawing ? new ResizeObserver(snap) : null;
    for (const node of observed) resizeObserver?.observe(node);

    return () => {
      disposed = true;
      stopMorph();
      window.cancelAnimationFrame(kick);
      if (frame) window.cancelAnimationFrame(frame);
      for (const root of scrolls) root.removeEventListener("scroll", snap);
      window.removeEventListener("resize", snap);
      resizeObserver?.disconnect();
    };
  }, [enabled, lineId, orderedIds, projectIds, stageProjectId]);

  if (paths.length === 0) return null;

  return (
    <svg className={styles.overlay} aria-hidden="true">
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          fill="none"
          className={path.strong ? styles.lineStrong : styles.line}
        />
      ))}
    </svg>
  );
}
