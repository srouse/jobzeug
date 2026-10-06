"use client";

import { useEffect, useState } from "react";
import { JzIconButton } from "@jobzeug/design-system/react";
import { useResumeHighlights } from "../../highlight-context";
import styles from "./answer-stage.module.css";

type ColorMode = "light" | "dark" | "subtle" | "emphasized";

const COLOR_MODES: {
  id: ColorMode;
  label: string;
  icon: string;
}[] = [
  { id: "light", label: "Light", icon: "Sun" },
  { id: "dark", label: "Dark", icon: "Moon" },
  { id: "subtle", label: "Subtle", icon: "DropHalf" },
  { id: "emphasized", label: "Emphasized", icon: "Lightning" },
];

function applyBodyColorMode(mode: ColorMode) {
  if (typeof document === "undefined") return;
  if (mode === "light") {
    document.body.removeAttribute("data-mode");
  } else {
    document.body.setAttribute("data-mode", mode);
  }
}

export function StageTools({ onOpenDesign }: { onOpenDesign?: () => void }) {
  const {
    density,
    setDensity,
    lineFocus,
    stageProjectId,
    clearLineFocus,
    fitBarsVisible,
    setFitBarsVisible,
  } = useResumeHighlights();
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const modeMeta =
    COLOR_MODES.find((mode) => mode.id === colorMode) ?? COLOR_MODES[0];

  useEffect(() => {
    applyBodyColorMode(colorMode);
    return () => {
      document.body.removeAttribute("data-mode");
    };
  }, [colorMode]);

  const cycleColorMode = () => {
    const index = COLOR_MODES.findIndex((mode) => mode.id === colorMode);
    const next = COLOR_MODES[(index + 1) % COLOR_MODES.length];
    setColorMode(next.id);
  };

  const showEye = false;

  return (
    <div className={styles.stageTools}>
      <JzIconButton
        label="Home"
        icon="House"
        title="Home"
        aria-pressed={lineFocus == null && stageProjectId == null}
        onClick={clearLineFocus}
      />
      <JzIconButton
        label={`Color mode: ${modeMeta.label}. Click to cycle.`}
        icon={modeMeta.icon}
        title={`Mode: ${modeMeta.label}`}
        onClick={cycleColorMode}
      />
      {showEye ? (
      <JzIconButton
        label={
          density === "rolled"
            ? "Only direct objects on the other side. Click to show the rest."
            : "Showing every row. Click to keep only the direct objects."
        }
        icon={density === "rolled" ? "EyeClosed" : "Eye"}
        title={
          density === "rolled" ? "Direct objects only" : "Showing all"
        }
        aria-pressed={density === "rolled"}
        onClick={() => setDensity(density === "rolled" ? "full" : "rolled")}
      />
      ) : null}
      {onOpenDesign ? (
        <JzIconButton
          label="Open design"
          icon="Palette"
          title="Design"
          onClick={onOpenDesign}
        />
      ) : null}
      <JzIconButton
        label={fitBarsVisible ? "Hide score bars" : "Show score bars"}
        icon="ChartBar"
        title={fitBarsVisible ? "Hide score bars" : "Show score bars"}
        aria-pressed={fitBarsVisible}
        onClick={() => setFitBarsVisible(!fitBarsVisible)}
      />
    </div>
  );
}
