"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marks a scroll container with `data-scrolling` while the user is scrolling it,
 * cleared after `idleMs` of no scroll events. Pair with idle-scrollbar CSS.
 */
export function useIdleScrollbar(idleMs = 900) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clearTimer = () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const onScroll = () => {
      setScrolling(true);
      clearTimer();
      timerRef.current = setTimeout(() => {
        setScrolling(false);
        timerRef.current = null;
      }, idleMs);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimer();
    };
  }, [idleMs]);

  return {
    ref,
    scrolling,
    /** Spread onto the scroll element. */
    scrollProps: {
      ref,
      "data-scrolling": scrolling || undefined,
    } as const,
  };
}
