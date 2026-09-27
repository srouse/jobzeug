"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { JzIconButton, JzText } from "@jobzeug/design-system/react";
import styles from "./modal.module.css";

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  wide = false,
  fit = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Near-full dialog, still inset from the viewport. */
  wide?: boolean;
  /** Height follows the content, still capped by the viewport. */
  fit?: boolean;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={dialogRef}
        className={[
          styles.dialog,
          wide ? styles.dialogWide : "",
          fit ? styles.dialogFit : "",
        ].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <JzText
            id={titleId}
            level={2}
            variant="heading2"
            label={title}
            className={styles.title}
          />
          <JzIconButton
            label="Close"
            icon="X"
            onClick={() => onOpenChange(false)}
          />
        </header>
        <div className={fit ? `${styles.body} ${styles.bodyFit}` : styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
