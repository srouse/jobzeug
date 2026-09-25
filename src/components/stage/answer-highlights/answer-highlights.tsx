"use client";

import {
  createElement,
  forwardRef,
  useEffect,
  useState,
  type ComponentType,
  type Ref,
} from "react";
import React from "react";

import { LAYOUT_MEDIUM_MIN_PX } from "@/components/resume/resume-highlight-context";

export type AnswerHighlightItem = {
  id: string;
  title: string;
  highlight: string;
  description: string;
};

type HighlightProps = {
  breakpoint?: "default" | "mobile";
  title?: string;
  highlight?: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: Event) => void;
};

/**
 * Loads jz-highlight once. Survives HMR redefine by falling back to
 * customElements.get — the package React wrapper rejects and renders null.
 */
const JzHighlight = forwardRef(function JzHighlight(
  props: HighlightProps,
  ref: Ref<HTMLElement>,
) {
  const [Comp, setComp] = useState<ComponentType<HighlightProps> | null>(
    () => highlightCache,
  );

  useEffect(() => {
    if (highlightCache) {
      setComp(() => highlightCache);
      return;
    }
    let cancelled = false;
    loadHighlight()
      .then((C) => {
        if (!cancelled) setComp(() => C);
      })
      .catch((err) => {
        console.error("[JzHighlight] failed to load", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Comp) return null;
  return createElement(Comp, { ...props, ref });
});

JzHighlight.displayName = "JzHighlight";

let highlightCache: ComponentType<HighlightProps> | null = null;
let highlightPending: Promise<ComponentType<HighlightProps>> | null = null;

async function loadHighlight(): Promise<ComponentType<HighlightProps>> {
  if (highlightCache) return highlightCache;
  highlightPending ??= (async () => {
    const { createComponent } = await import("@lit/react");

    if (!customElements.get("jz-highlight")) {
      try {
        await import("@jobzeug/design-system");
      } catch {
        // HMR / double-eval can throw on redefine; element may still exist.
      }
    }

    const elementClass = customElements.get("jz-highlight");
    if (!elementClass) {
      throw new Error("jz-highlight custom element did not register");
    }

    const Comp = createComponent({
      tagName: "jz-highlight",
      elementClass: elementClass as CustomElementConstructor & {
        // lit-react expects the element class constructor
        new (): HTMLElement;
      },
      react: React,
      events: {
        onClick: "click",
      },
    }) as ComponentType<HighlightProps>;

    highlightCache = Comp;
    return Comp;
  })();
  return highlightPending;
}

/**
 * Single-select JzHighlight stack. Click selected to clear (same as accordion close).
 */
export function AnswerHighlights({
  items,
  resetKey,
  selectedId: selectedIdProp,
  onSelectedIdChange,
}: {
  items: AnswerHighlightItem[];
  /** When this changes (e.g. new cluster id), select the first item. */
  resetKey?: string;
  /** Controlled selection from focusedSectionId; empty/null = none. */
  selectedId?: string | null;
  onSelectedIdChange?: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState("");
  const [breakpoint, setBreakpoint] = useState<"default" | "mobile">(
    "default",
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${LAYOUT_MEDIUM_MIN_PX - 1}px)`);
    const sync = () => setBreakpoint(mq.matches ? "mobile" : "default");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const next = items[0]?.id ?? "";
    setSelectedId(next);
    onSelectedIdChange?.(next);
    // Intentionally only when the answer identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (selectedIdProp === undefined) return;
    if (selectedIdProp == null || selectedIdProp === "") {
      setSelectedId("");
      return;
    }
    if (items.some((item) => item.id === selectedIdProp)) {
      setSelectedId(selectedIdProp);
    }
  }, [selectedIdProp, items]);

  if (!items.length) return null;

  const resolvedSelected =
    selectedId && items.some((item) => item.id === selectedId)
      ? selectedId
      : "";

  return (
    <>
      {items.map((item) => {
        const selected = resolvedSelected === item.id;
        return (
          <JzHighlight
            key={item.id}
            breakpoint={breakpoint}
            title={item.title}
            highlight={item.highlight}
            description={item.description}
            selected={selected}
            onClick={() => {
              const next = selected ? "" : item.id;
              setSelectedId(next);
              onSelectedIdChange?.(next);
            }}
          />
        );
      })}
    </>
  );
}

/** Flatten answer markdown into a single plain string for JzHighlight.description. */
export function markdownToPlain(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>+|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
