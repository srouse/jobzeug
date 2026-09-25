"use client";

import type { ReactNode } from "react";
import styles from "./evidence-page-header.module.css";

/**
 * Fixed-height page chrome for resume / job columns.
 * Main content left; optional actions slot right — vertically centered,
 * tighter trailing padding than the leading page pad.
 */
export function EvidencePageHeader({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className={styles.root} data-evidence-page-header>
      <div className={styles.main}>{children}</div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
