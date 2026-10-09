"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { sameProjectId } from "./project-presentation/project-presentation";
import styles from "./connectors.module.css";

/** Line morph while the posting stays open. */
const MORPH_MS = 500;
/** Vertical gap between curve starts on the job line. */
const JOB_START_GAP = 8;

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

function pxVar(style: CSSStyleDeclaration, name: string, fallback: number): number {
  const value = Number.parseFloat(style.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

let padTopCache: { raw: string; px: number } | null = null;

/** Target padding. The value does not change between compact and matched. */
function stackPadTop(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue("--stack-pad-top").trim();
  if (padTopCache?.raw === raw) return padTopCache.px;
  const px = lengthPx(el, raw, 16);
  padTopCache = { raw, px };
  return px;
}

function lengthPx(el: HTMLElement, raw: string, fallback: number): number {
  const value = raw.trim();
  if (!value) return fallback;
  if (value.endsWith("px")) {
    const px = Number.parseFloat(value);
    return Number.isFinite(px) ? px : fallback;
  }
  const probe = el.ownerDocument.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;height:${value}`;
  el.appendChild(probe);
  const resolved = probe.getBoundingClientRect().height;
  probe.remove();
  return resolved > 0 ? resolved : fallback;
}

function blockHeight(el: HTMLElement): number {
  const style = getComputedStyle(el);
  const marginTop = Number.parseFloat(style.marginTop) || 0;
  const marginBottom = Number.parseFloat(style.marginBottom) || 0;
  return marginTop + el.offsetHeight + marginBottom;
}

type Stack = {
  left: number;
  right: number;
  centers: Map<string, number>;
};

/**
 * Final row centers from the fixed closed/open sizes, top-aligned.
 * Ignores the in-flight height transition, which is what was leaving the
 * measured lines behind.
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
    const linked =
      openSet.has(id) || projectIds.some((openId) => sameProjectId(openId, id));
    return linked ? open : closed;
  };

  let y =
    scroller.getBoundingClientRect().top +
    stackPadTop(scroller) -
    scroller.scrollTop;

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

/**
 * Compact-list centers. Header text keeps its height while the grid row
 * around it animates, and both modes share the same top padding.
 */
function compactCenters(): Stack | null {
  const scroller = document.querySelector<HTMLElement>("[data-resume2-scroll]");
  const list = scroller?.querySelector<HTMLElement>("[data-resume2-list]");
  if (!scroller || !list) return null;

  const listStyle = getComputedStyle(list);
  const rowH = pxVar(listStyle, "--project-list", 28);
  const gap = pxVar(listStyle, "--project-list-gap", 2);
  const centers = new Map<string, number>();
  let y =
    scroller.getBoundingClientRect().top +
    stackPadTop(scroller) -
    scroller.scrollTop;

  for (const group of list.children) {
    if (!(group instanceof HTMLElement)) continue;
    const header = group.querySelector<HTMLElement>("[data-resume2-employer]");
    if (header) y += blockHeight(header);
    const cards = group.querySelectorAll<HTMLElement>("[data-resume2-card]");
    cards.forEach((card, index) => {
      const id = card.getAttribute("data-resume2-card");
      if (!id) return;
      centers.set(id, y + rowH / 2);
      y += rowH;
      if (index < cards.length - 1) y += gap;
    });
  }

  if (centers.size === 0) return null;
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

type StackLayout = "matched" | "compact";

function measure(
  lineId: string,
  orderedIds: readonly string[],
  projectIds: readonly string[],
  layout: StackLayout,
): ConnectorPath[] {
  const job = document.querySelector<HTMLElement>("[data-resume2-job]");
  const line = job?.querySelector<HTMLElement>(
    `[data-evidence-id="${CSS.escape(lineId)}"]`,
  );
  const stack =
    layout === "compact"
      ? compactCenters()
      : stackCenters(orderedIds, projectIds);
  if (!job || !line || !stack) return [];
  const lineRect = line.getBoundingClientRect();
  if (lineRect.height <= 0) return [];
  if (layout === "matched" && lineRect.width <= 0) return [];

  const startX =
    layout === "compact"
      ? job.getBoundingClientRect().left +
        pxVar(getComputedStyle(job), "--resume-job-strip", 56)
      : lineRect.right;
  const startY = lineRect.top + lineRect.height / 2;
  const paths: ConnectorPath[] = [];

  const ends = projectIds
    .map((projectId) => ({ endY: centerOf(stack, projectId) }))
    .filter((row): row is { endY: number } => row.endY != null)
    .sort((a, b) => a.endY - b.endY);
  const seriesTop = startY - ((ends.length - 1) * JOB_START_GAP) / 2;

  ends.forEach((row, index) => {
    paths.push({
      id: `slot-${index}`,
      d: cubicHorizontal(startX, seriesTop + index * JOB_START_GAP, stack.left, row.endY),
      strong: false,
    });
  });
  return paths;
}

function blend(
  from: ConnectorPath[],
  to: ConnectorPath[],
  t: number,
  pinStart: boolean,
): ConnectorPath[] {
  const eased = easeInOut(t);
  const fromById = new Map(from.map((path) => [path.id, path]));
  return to.map((path) => {
    const previous = fromById.get(path.id);
    const fromCubic = previous ? parseCubic(previous.d) : null;
    const toCubic = parseCubic(path.d);
    if (!fromCubic || !toCubic) return path;
    const mixed = lerpCubic(fromCubic, toCubic, eased);
    if (pinStart && path.id.startsWith("slot-")) {
      mixed.x0 = toCubic.x0;
      mixed.y0 = toCubic.y0;
      mixed.c1x = toCubic.c1x;
      mixed.c1y = toCubic.c1y;
    }
    return { ...path, d: formatCubic(mixed) };
  });
}

/**
 * Curves from the selected job line to the top three cards.
 * They draw only while the posting is fully open. Closing clears them
 * immediately. A job-line change while the posting stays open keeps the
 * start pinned.
 */
export function ResumeConnectors({
  covered,
  postingOpen,
  lineId,
  orderedIds,
  projectIds,
  stageProjectId,
}: {
  covered: boolean;
  postingOpen: boolean;
  lineId: string | null;
  orderedIds: readonly string[];
  projectIds: readonly string[];
  stageProjectId: string | null;
}) {
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const pathsRef = useRef<ConnectorPath[]>([]);
  const postingOpenRef = useRef(postingOpen);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const postingChanged = postingOpenRef.current !== postingOpen;
    postingOpenRef.current = postingOpen;
    let frame = 0;
    let morphFrame = 0;
    let settleTimer = 0;
    let disposed = false;
    let settled = !postingChanged || reduceMotion;

    const commit = (next: ConnectorPath[]) => {
      if (disposed) return;
      pathsRef.current = next;
      setPaths(next);
    };

    const read = () =>
      !covered && postingOpen && lineId
        ? measure(lineId, orderedIds, projectIds, "matched")
        : [];

    const stopMorph = () => {
      if (morphFrame) {
        window.cancelAnimationFrame(morphFrame);
        morphFrame = 0;
      }
    };

    const startMorph = (pinStart: boolean) => {
      const from = pathsRef.current;
      const dest = read();
      if (reduceMotion || from.length === 0) {
        commit(dest);
        return;
      }
      stopMorph();
      const started = performance.now();
      commit(blend(from, dest, 0, pinStart));
      const tick = (now: number) => {
        if (disposed) return;
        const next = read();
        const t = Math.min(1, (now - started) / MORPH_MS);
        const blended = blend(from, next, t, pinStart);
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
      if (!settled || morphFrame || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!settled || morphFrame) return;
        commit(read());
      });
    };

    const drawing = Boolean(!covered && postingOpen && lineId);
    const waitForOpen = drawing && postingChanged && !reduceMotion;
    const job = drawing
      ? document.querySelector<HTMLElement>("[data-resume2-job]")
      : null;

    if (!drawing || waitForOpen) {
      commit([]);
    }

    const showSettled = () => {
      if (disposed || settled) return;
      settled = true;
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      job?.removeEventListener("transitionend", onJobSettled);
      startMorph(true);
    };

    const onJobSettled = (event: TransitionEvent) => {
      if (event.target !== job) return;
      if (event.propertyName !== "width" && event.propertyName !== "flex-basis") {
        return;
      }
      showSettled();
    };

    if (waitForOpen && job) {
      job.addEventListener("transitionend", onJobSettled);
      const raw = getComputedStyle(job).getPropertyValue("--resume-collapse");
      const ms = Number.parseFloat(raw);
      settleTimer = window.setTimeout(
        showSettled,
        (Number.isFinite(ms) ? ms : 320) + 40,
      );
    } else if (waitForOpen) {
      settled = true;
    }

    const kick = window.requestAnimationFrame(() => {
      if (disposed || !drawing || !settled) return;
      startMorph(!postingChanged);
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
          document.querySelector("[data-resume2-list]"),
          document.querySelector("[data-answer-stage-card]"),
        ].filter((node): node is Element => node != null)
      : [];
    const resizeObserver = drawing ? new ResizeObserver(snap) : null;
    for (const node of observed) resizeObserver?.observe(node);

    return () => {
      disposed = true;
      stopMorph();
      window.clearTimeout(settleTimer);
      job?.removeEventListener("transitionend", onJobSettled);
      window.cancelAnimationFrame(kick);
      if (frame) window.cancelAnimationFrame(frame);
      for (const root of scrolls) root.removeEventListener("scroll", snap);
      window.removeEventListener("resize", snap);
      resizeObserver?.disconnect();
    };
  }, [covered, postingOpen, lineId, orderedIds, projectIds, stageProjectId]);

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
