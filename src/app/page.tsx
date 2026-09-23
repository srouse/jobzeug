"use client";

import Link from "next/link";
import { JzText } from "@jobzeug/design-system/react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.root}>
      <div aria-hidden className={styles.glow} />
      <div className={styles.content}>
        <JzText
          variant="display"
          color="inverse"
          label="Jobzeug"
          className={styles.brand}
        />
        <JzText
          variant="body-default"
          color="muted"
          label="Evidence workspace and agent surface for the Figma Forward Deployed Engineer application. Dynamic UI comes next."
          className={styles.lede}
        />
        <div className={styles.actions}>
          <Link href="/resume" className={styles.primary}>
            <JzText variant="label" label="Open resume" />
          </Link>
          <Link href="/chat" className={styles.secondary}>
            <JzText variant="label" color="inverse" label="Open agent chat" />
          </Link>
          <Link href="/api/logout" className={styles.secondary}>
            <JzText variant="label" color="inverse" label="Log out" />
          </Link>
          <JzText
            variant="caption"
            color="muted"
            label="Studio: npm run dev:studio"
            className={styles.hint}
          />
        </div>
      </div>
    </main>
  );
}
