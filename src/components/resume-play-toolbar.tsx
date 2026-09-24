"use client";

import { useEffect, useState } from "react";
import { JzButton, JzText } from "@jobzeug/design-system/react";
import {
  useResumeHighlights,
  type ResumeDensity,
} from "@/components/resume-highlight-context";
import styles from "./resume-play-toolbar.module.css";

type ColorMode = "light" | "dark" | "subtle" | "emphasized";

const colorModes: { id: ColorMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "subtle", label: "Subtle" },
  { id: "emphasized", label: "Emphasized" },
];

const densityTabs: { id: ResumeDensity; label: string }[] = [
  { id: "full", label: "Full" },
  { id: "rolled", label: "Rolled up" },
];

function applyBodyColorMode(mode: ColorMode) {
  if (typeof document === "undefined") return;
  if (mode === "light") {
    document.body.removeAttribute("data-mode");
  } else {
    document.body.setAttribute("data-mode", mode);
  }
}

export function ResumePlayToolbar({
  chatOpen,
  onToggleChat,
}: {
  chatOpen: boolean;
  onToggleChat: () => void;
}) {
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const { density, setDensity } = useResumeHighlights();

  useEffect(() => {
    applyBodyColorMode(colorMode);
    return () => {
      document.body.removeAttribute("data-mode");
    };
  }, [colorMode]);

  return (
    <footer className={styles.root} aria-label="Resume tools">
      <div className={styles.tools}>
        <div className={styles.modeField}>
          <label htmlFor="resume-color-mode" className={styles.modeLabel}>
            <JzText variant="label-sm" color="muted" label="Mode" />
          </label>
          <select
            id="resume-color-mode"
            className={styles.modeSelect}
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
          >
            {colorModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className={styles.densityTabs}
          role="tablist"
          aria-label="Document density"
        >
          {densityTabs.map((tab) => {
            const selected = density === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? `${styles.densityTab} ${styles.densityTabActive}`
                    : styles.densityTab
                }
                onClick={() => setDensity(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.chatSlot}>
        <JzButton
          variant={chatOpen ? "secondary" : "primary"}
          size="small"
          label={chatOpen ? "Close chat" : "Chat"}
          showIcon={false}
          onClick={onToggleChat}
          aria-pressed={chatOpen}
        />
      </div>
    </footer>
  );
}
