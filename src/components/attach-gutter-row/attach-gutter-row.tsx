"use client";

import type { ReactNode } from "react";
import styles from "./attach-gutter-row.module.css";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ") || undefined;
}

/**
 * Prompt-stage row chrome: optional 40px left gutter (checkbox when attachable)
 * so content stays aligned with page headers. Hover wash covers the full row
 * behind the checkbox.
 */
export function AttachGutterRow({
  gutter,
  checked = false,
  onToggle,
  label = "Add to question context",
  contentId,
  contentClassName,
  children,
}: {
  /** Reserve the left page-pad column (prompt / attach mode). */
  gutter?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  label?: string;
  contentId?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  const attachable = Boolean(gutter && onToggle);

  if (!gutter) {
    return (
      <div
        id={contentId}
        data-evidence-id={contentId}
        className={contentClassName}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        styles.row,
        attachable && styles.attachable,
      )}
    >
      <div className={styles.gutter}>
        {attachable ? (
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={checked}
            aria-label={label}
            onChange={(event) => {
              event.stopPropagation();
              onToggle?.();
            }}
            onClick={(event) => event.stopPropagation()}
          />
        ) : null}
      </div>
      <div
        id={contentId}
        data-evidence-id={contentId}
        className={classNames(
          styles.content,
          contentClassName,
          attachable && styles.contentHit,
        )}
        role={attachable ? "button" : undefined}
        tabIndex={attachable ? 0 : undefined}
        aria-pressed={attachable ? checked : undefined}
        onClick={attachable ? onToggle : undefined}
        onKeyDown={
          attachable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle?.();
                }
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
