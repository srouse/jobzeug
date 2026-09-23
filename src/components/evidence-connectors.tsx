"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useResumeHighlights } from "@/components/resume-highlight-context";
import styles from "./evidence-connectors.module.css";

type ConnectorPath = {
  id: string;
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

const DESKTOP_MIN = 960;
const DOT_RADIUS = 4;
/** Keep card-side attachments clear of rounded corners. */
const CARD_EDGE_PAD = 20;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cubicHorizontal(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): string {
  const dx = Math.abs(x1 - x0) * 0.5;
  const c1x = x0 < x1 ? x0 + dx : x0 - dx;
  const c2x = x0 < x1 ? x1 - dx : x1 + dx;
  return `M ${x0} ${y0} C ${c1x} ${y0}, ${c2x} ${y1}, ${x1} ${y1}`;
}

function cardAttachRange(cardRect: DOMRect) {
  const top = cardRect.top + CARD_EDGE_PAD;
  const bottom = cardRect.bottom - CARD_EDGE_PAD;
  if (bottom <= top) {
    const mid = cardRect.top + cardRect.height / 2;
    return { top: mid, bottom: mid };
  }
  return { top, bottom };
}

function measurePaths(highlightedIds: Set<string>): ConnectorPath[] {
  const card = document.querySelector<HTMLElement>("[data-answer-stage-card]");
  if (!card || highlightedIds.size === 0) return [];

  const cardRect = card.getBoundingClientRect();
  if (cardRect.width <= 0 || cardRect.height <= 0) return [];

  const attach = cardAttachRange(cardRect);
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
    });
  }

  return paths;
}

/**
 * SVG connectors from cited resume/job rows into the answer stage card.
 * Always row-edge → card-edge beziers (including when the row is scrolled
 * off-screen), so lines keep running toward the real citation.
 */
export function EvidenceConnectors() {
  const { highlightedIds, activeCluster } = useResumeHighlights();
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
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setPaths(measurePaths(highlightedIds));
      });
    };

    schedule();

    const scrollRoots = document.querySelectorAll("[data-evidence-scroll]");
    for (const root of scrollRoots) {
      root.addEventListener("scroll", schedule, { passive: true });
    }
    window.addEventListener("resize", schedule);

    const card = document.querySelector("[data-answer-stage-card]");
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;
    if (observer) {
      if (card) observer.observe(card);
      for (const root of scrollRoots) observer.observe(root);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      for (const root of scrollRoots) {
        root.removeEventListener("scroll", schedule);
      }
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, [desktop, activeCluster, highlightedIds]);

  if (!desktop || !activeCluster || paths.length === 0) return null;

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
