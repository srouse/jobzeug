"use client";

import type { ReactNode } from "react";
import styles from "./attach-gutter-row.module.css";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

/**
 * Prompt-stage row chrome: clickable attach without checkbox chrome.
 * Selected state is shown via content color (callers) + aria-pressed.
 */
export function AttachGutterRow({
  checked = false,
  washed = false,
  onToggle,
  label = "Add to question context",
  contentId,
  contentClassName,
  fitBarsOff = false,
  edge = "right",
  children,
}: {
  checked?: boolean;
  washed?: boolean;
  onToggle?: () => void;
  label?: string;
  contentId?: string;
  contentClassName?: string;
  fitBarsOff?: boolean;
  /** Hover rule sits on this side. Resume rows use the right; job lines use the left. */
  edge?: "left" | "right";
  children: ReactNode;
}) {
  const attachable = Boolean(onToggle);

  if (!attachable) {
    return (
      <div
        id={contentId}
        data-evidence-id={contentId}
        data-fit-bars={fitBarsOff ? "off" : undefined}
        className={contentClassName}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      id={contentId}
      data-evidence-id={contentId}
      data-fit-bars={fitBarsOff ? "off" : undefined}
      className={classNames(
        styles.row,
        styles.attachable,
        contentClassName,
      )}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={checked}
      data-edge={edge}
      data-wash={washed ? "" : undefined}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle?.();
        }
      }}
    >
      {children}
    </div>
  );
}
