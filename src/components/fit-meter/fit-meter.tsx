import type { FitBarTone } from "@/lib/matching/home-coverage";

import styles from "./fit-meter.module.css";

/** 2px score bar along the bottom of the text box. */
export function FitMeter({
  width,
  tone,
}: {
  width: number;
  tone: FitBarTone | null;
}) {
  if (width <= 0 || tone == null) return null;
  return (
    <span
      className={styles.meter}
      data-tone={tone}
      style={{ width: `${width * 100}%` }}
      aria-hidden
    />
  );
}
