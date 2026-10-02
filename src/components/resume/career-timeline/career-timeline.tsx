"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { JzText } from "@jobzeug/design-system/react";
import { CAREER_TIMELINE_ENABLED } from "./enabled";
import {
  careerTimelineScale,
  type CareerTimelineEmployer,
  type CareerTimelineSelection,
} from "./scale";
import styles from "./career-timeline.module.css";

/** Smallest grabbable band. The real height is the time currently on screen. */
const WINDOW_MIN_FALLBACK = 32;

type TimeAnchor = {
  /** Content Y in the scrollport's scroll coordinates. */
  y: number;
  /** Fraction down the timeline. 0 is the present. Never decreases as y grows. */
  offset: number;
};

function evidenceKey(id: string): string {
  return id.startsWith("jz-") ? id.slice(3) : id;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Monotone map from content position to timeline time.
 * Walking the rows top to bottom, an overlap holds the previous time instead
 * of pulling the thumb back up. The scroll content itself is pinned to both ends.
 */
function timeAnchors(
  scroller: HTMLElement,
  offsets: ReadonlyMap<string, number>,
): TimeAnchor[] {
  const found: TimeAnchor[] = [];
  const seen = new Set<string>();
  const scrollerTop = scroller.getBoundingClientRect().top;
  for (const node of scroller.querySelectorAll<HTMLElement>("[data-evidence-id]")) {
    const id = node.dataset.evidenceId;
    if (!id || seen.has(id)) continue;
    const offset = offsets.get(evidenceKey(id));
    if (offset == null) continue;
    const rect = node.getBoundingClientRect();
    if (rect.height <= 0) continue;
    seen.add(id);
    found.push({
      y: rect.top - scrollerTop + scroller.scrollTop,
      offset: clamp01(offset),
    });
  }
  found.sort((a, b) => a.y - b.y || a.offset - b.offset);

  const anchors: TimeAnchor[] = [{ y: 0, offset: 0 }];
  let lastOffset = 0;
  for (const anchor of found) {
    if (anchor.y <= 0) continue;
    const offset = Math.max(anchor.offset, lastOffset);
    const prev = anchors[anchors.length - 1];
    if (anchor.y <= prev.y) prev.offset = offset;
    else anchors.push({ y: anchor.y, offset });
    lastOffset = offset;
  }
  const endY = scroller.scrollHeight;
  const last = anchors[anchors.length - 1];
  if (endY > last.y) anchors.push({ y: endY, offset: 1 });
  else if (last.y > 0) last.offset = 1;
  return anchors;
}

function timelineOffsets(
  scale: {
    segments: readonly { roleId: string; top: number }[];
    marks: readonly { projectId: string; offset: number }[];
  } | null,
): Map<string, number> {
  const offsets = new Map<string, number>();
  if (!scale) return offsets;
  for (const segment of scale.segments) {
    offsets.set(evidenceKey(segment.roleId), segment.top);
  }
  for (const mark of scale.marks) {
    offsets.set(evidenceKey(mark.projectId), mark.offset);
  }
  return offsets;
}

function offsetAtContentY(anchors: readonly TimeAnchor[], y: number): number {
  if (anchors.length === 0) return 0;
  if (y <= anchors[0].y) return anchors[0].offset;
  for (let i = 1; i < anchors.length; i++) {
    const prev = anchors[i - 1];
    const next = anchors[i];
    if (y > next.y) continue;
    const span = next.y - prev.y;
    const t = span <= 0 ? 0 : (y - prev.y) / span;
    return prev.offset + t * (next.offset - prev.offset);
  }
  return anchors[anchors.length - 1].offset;
}

/** Left inverse: the content Y where the timeline first reaches `offset`. */
function contentYAtOffset(anchors: readonly TimeAnchor[], offset: number): number {
  if (anchors.length === 0) return 0;
  if (offset <= anchors[0].offset) return anchors[0].y;
  for (let i = 1; i < anchors.length; i++) {
    const prev = anchors[i - 1];
    const next = anchors[i];
    const span = next.offset - prev.offset;
    if (span <= 0) continue;
    if (offset <= next.offset || i === anchors.length - 1) {
      const t = (offset - prev.offset) / span;
      return prev.y + clamp01(t) * (next.y - prev.y);
    }
  }
  return anchors[anchors.length - 1].y;
}

/**
 * True timeline offsets of rows on screen.
 * `earliest` is any real intersection (the top of the thumb already tracks this).
 * `latest` ignores a sliver at the fold so a project that is still off screen
 * cannot pull its dot into the thumb.
 */
function visibleOffsets(
  scroller: HTMLElement,
  offsets: ReadonlyMap<string, number>,
): { earliest: number; latest: number } | null {
  const viewTop = scroller.getBoundingClientRect().top;
  const viewBottom = viewTop + scroller.clientHeight;
  let earliest: number | null = null;
  let latest: number | null = null;
  const seen = new Set<string>();
  for (const node of scroller.querySelectorAll<HTMLElement>("[data-evidence-id]")) {
    const id = node.dataset.evidenceId;
    if (!id || seen.has(id)) continue;
    const offset = offsets.get(evidenceKey(id));
    if (offset == null) continue;
    const rect = node.getBoundingClientRect();
    if (rect.height <= 0) continue;
    const overlap =
      Math.min(rect.bottom, viewBottom - 1) - Math.max(rect.top, viewTop + 1);
    if (overlap <= 0) continue;
    seen.add(id);
    const time = clamp01(offset);
    if (earliest == null || time < earliest) earliest = time;
    const onScreen = overlap >= Math.min(12, rect.height * 0.5);
    if (onScreen && (latest == null || time > latest)) latest = time;
  }
  if (earliest == null) return null;
  return { earliest, latest: latest ?? earliest };
}

function visibleWindow(
  scroller: HTMLElement,
  anchors: readonly TimeAnchor[],
  offsets: ReadonlyMap<string, number>,
): { top: number; span: number } {
  const maxScroll = scroller.scrollHeight - scroller.clientHeight;
  const atStart = scroller.scrollTop <= 0;
  const atEnd = scroller.scrollTop >= maxScroll - 0.5;
  const edgeTop = offsetAtContentY(anchors, atStart ? 0 : scroller.scrollTop);
  const bottomY = atEnd
    ? scroller.scrollHeight
    : scroller.scrollTop + scroller.clientHeight;
  const edgeBottom = offsetAtContentY(anchors, bottomY);
  const visible = visibleOffsets(scroller, offsets);
  const top = visible == null ? edgeTop : Math.min(edgeTop, visible.earliest);
  // The scroll edge interpolates toward the next row before that row is on
  // screen, which pulls the next project dot into the thumb. Hold the bottom
  // on the oldest row that is actually visible.
  const bottom = visible == null || atEnd ? edgeBottom : visible.latest;
  return { top, span: Math.max(0, bottom - top) };
}

/** Scroll so the top of the viewport sits at `topOffset`, keeping `span` of time in view. */
function scrollTopForWindow(
  anchors: readonly TimeAnchor[],
  topOffset: number,
  span: number,
  maxScroll: number,
): number {
  if (topOffset <= 0) return 0;
  if (topOffset + span >= 1 - 1e-4) return maxScroll;
  const y = contentYAtOffset(anchors, clamp01(topOffset));
  return Math.min(maxScroll, Math.max(0, y));
}

function thumbBox(
  spanHeight: number,
  minHeight: number,
  topOffset: number,
  bottomOffset: number,
  atStart: boolean,
  atEnd: boolean,
): { top: number; height: number } {
  const rawTop = clamp01(topOffset) * spanHeight;
  const rawBottom = clamp01(bottomOffset) * spanHeight;
  const height = Math.min(spanHeight, Math.max(rawBottom - rawTop, minHeight));
  const limit = Math.max(0, spanHeight - height);
  if (atStart) return { top: 0, height };
  if (atEnd) return { top: limit, height };
  const center = (rawTop + rawBottom) / 2;
  return {
    top: Math.min(limit, Math.max(0, center - height / 2)),
    height,
  };
}

function bindScrollWindow(
  page: HTMLElement,
  marker: HTMLElement,
  hit: HTMLElement,
  offsetsRef: { current: ReadonlyMap<string, number> },
  placeRef: { current: () => void },
): () => void {
  const scroller = page.querySelector("[data-evidence-scroll]");
  if (!(scroller instanceof HTMLElement)) {
    marker.hidden = true;
    hit.hidden = true;
    return () => {};
  }

  const place = () => {
    const span = marker.parentElement;
    const spanHeight = span?.clientHeight ?? 0;
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    if (!span || spanHeight <= 0 || maxScroll <= 1) {
      marker.hidden = true;
      hit.hidden = true;
      return;
    }
    const minHeight = Math.min(
      spanHeight,
      Number.parseFloat(
        getComputedStyle(span).getPropertyValue("--timeline-window-min"),
      ) || WINDOW_MIN_FALLBACK,
    );
    const anchors = timeAnchors(scroller, offsetsRef.current);
    const atStart = scroller.scrollTop <= 0;
    const atEnd = scroller.scrollTop >= maxScroll - 0.5;
    const view = visibleWindow(scroller, anchors, offsetsRef.current);
    const box = thumbBox(
      spanHeight,
      minHeight,
      view.top,
      view.top + view.span,
      atStart,
      atEnd,
    );
    const top = `${box.top}px`;
    const heightPx = `${box.height}px`;
    marker.hidden = false;
    hit.hidden = false;
    marker.style.height = heightPx;
    marker.style.top = top;
    hit.style.height = heightPx;
    hit.style.top = top;
  };

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      place();
    });
  };

  placeRef.current = place;
  place();
  scroller.addEventListener("scroll", schedule, { passive: true });
  const resize = new ResizeObserver(schedule);
  resize.observe(scroller);
  const watchContent = () => {
    for (const child of scroller.children) {
      if (child instanceof HTMLElement) resize.observe(child);
    }
  };
  watchContent();
  const mutations = new MutationObserver(() => {
    watchContent();
    schedule();
  });
  mutations.observe(scroller, { childList: true });

  return () => {
    placeRef.current = () => {};
    scroller.removeEventListener("scroll", schedule);
    resize.disconnect();
    mutations.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}

type WindowMetrics = {
  span: HTMLElement;
  scroller: HTMLElement;
  height: number;
  maxScroll: number;
};

function readWindow(
  page: HTMLElement | null,
  marker: HTMLElement | null,
): WindowMetrics | null {
  if (!page || !marker || marker.hidden) return null;
  const span = marker.parentElement;
  const scroller = page.querySelector("[data-evidence-scroll]");
  if (!span || !(scroller instanceof HTMLElement)) return null;
  const maxScroll = scroller.scrollHeight - scroller.clientHeight;
  const height = marker.getBoundingClientRect().height;
  if (span.clientHeight <= 0 || maxScroll <= 1 || height <= 0) return null;
  return { span, scroller, height, maxScroll };
}

function YearLabel({
  year,
  className,
  style,
}: {
  year: number;
  className: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      <JzText variant="caption" color="muted" label={String(year)} />
    </span>
  );
}

export function CareerTimeline({
  employers,
  selectedProjects = [],
  open = true,
  children,
}: {
  employers?: readonly CareerTimelineEmployer[];
  /** Projects in the current selection, with highlight strength. */
  selectedProjects?: readonly CareerTimelineSelection[];
  /** When false, the column collapses. The page stays put. */
  open?: boolean;
  children: ReactNode;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const placeRef = useRef<() => void>(() => {});
  const offsetsRef = useRef<ReadonlyMap<string, number>>(new Map());
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    startTopOffset: number;
    startSpan: number;
  } | null>(null);

  useEffect(() => {
    if (!CAREER_TIMELINE_ENABLED) return;
    const page = pageRef.current;
    const marker = markerRef.current;
    const hit = hitRef.current;
    if (!page || !marker || !hit) return;
    return bindScrollWindow(page, marker, hit, offsetsRef, placeRef);
  }, []);

  if (!CAREER_TIMELINE_ENABLED) return children;

  const scale = careerTimelineScale(employers ?? [], new Date(), selectedProjects);
  offsetsRef.current = timelineOffsets(scale);
  const top = scale?.labels.find((label) => label.edge === "top");
  const bottom = scale?.labels.find((label) => label.edge === "bottom");
  const middle = scale?.labels.filter((label) => label.edge === "middle") ?? [];

  const metrics = () => readWindow(pageRef.current, markerRef.current);

  const setDragging = (on: boolean) => {
    const column = columnRef.current;
    if (!column) return;
    if (on) column.dataset.dragging = "";
    else delete column.dataset.dragging;
  };

  const scrollTo = (scroller: HTMLElement, maxScroll: number, next: number) => {
    scroller.scrollTop = Math.min(maxScroll, Math.max(0, next));
    placeRef.current();
  };

  const onThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const band = metrics();
    if (!band) return;
    event.preventDefault();
    event.stopPropagation();
    const anchors = timeAnchors(band.scroller, offsetsRef.current);
    const view = visibleWindow(band.scroller, anchors, offsetsRef.current);
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTopOffset: view.top,
      startSpan: view.span,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onTrackPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    if (hitRef.current?.contains(event.target as Node)) return;
    const band = metrics();
    if (!band) return;
    event.preventDefault();
    const spanHeight = band.span.clientHeight;
    const y = event.clientY - band.span.getBoundingClientRect().top;
    const clickOffset = clamp01(spanHeight <= 0 ? 0 : y / spanHeight);
    const anchors = timeAnchors(band.scroller, offsetsRef.current);
    const view = visibleWindow(band.scroller, anchors, offsetsRef.current);
    const topOffset = clickOffset - view.span / 2;
    scrollTo(
      band.scroller,
      band.maxScroll,
      scrollTopForWindow(anchors, topOffset, view.span, band.maxScroll),
    );
    const landed = visibleWindow(band.scroller, anchors, offsetsRef.current);
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTopOffset: landed.top,
      startSpan: landed.span,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const band = metrics();
    if (!band) return;
    const spanHeight = band.span.clientHeight;
    if (spanHeight <= 0) return;
    const topOffset =
      drag.startTopOffset + (event.clientY - drag.startY) / spanHeight;
    const anchors = timeAnchors(band.scroller, offsetsRef.current);
    scrollTo(
      band.scroller,
      band.maxScroll,
      scrollTopForWindow(anchors, topOffset, drag.startSpan, band.maxScroll),
    );
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div className={styles.sheet}>
      <aside
        ref={columnRef}
        className={styles.column}
        data-closed={open ? undefined : ""}
        aria-label="Career timeline"
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {top ? <YearLabel year={top.year} className={styles.edgeLabel} /> : null}
        <div className={styles.span}>
          <div ref={markerRef} className={styles.marker} aria-hidden />
          <div className={styles.track}>
            {middle.map((label) => (
              <YearLabel
                key={label.year}
                year={label.year}
                className={styles.yearLabel}
                style={{ top: `${label.offset * 100}%` }}
              />
            ))}
            <span className={styles.notch} style={{ top: 0 }} aria-hidden />
            {(scale?.segments ?? []).map((segment) => (
              <span
                key={segment.roleId}
                className={styles.notch}
                style={{ top: `${(segment.top + segment.height) * 100}%` }}
                title={segment.tooltip}
                aria-label={segment.tooltip}
              />
            ))}
            {(scale?.marks ?? []).map((mark) => (
              <span
                key={mark.projectId}
                className={styles.mark}
                data-selected={mark.selected ?? undefined}
                style={{ top: `${mark.offset * 100}%` }}
                title={mark.name}
                aria-label={mark.name}
              >
                <span className={styles.dot} aria-hidden />
                {mark.selected ? (
                  <span
                    className={styles.ball}
                    data-strength={mark.selected}
                    aria-hidden
                  />
                ) : null}
              </span>
            ))}
          </div>
          <div
            ref={hitRef}
            className={styles.hit}
            aria-hidden
            onPointerDown={onThumbPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>
        {bottom ? <YearLabel year={bottom.year} className={styles.edgeLabel} /> : null}
      </aside>
      <div ref={pageRef} className={styles.page}>
        {children}
      </div>
    </div>
  );
}
