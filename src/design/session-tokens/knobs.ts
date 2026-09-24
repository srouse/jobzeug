/**
 * Session design-token knobs — Design tab experiment only.
 * Agent (later) edits this shape only; derived --jz-* flood from the builder.
 */

export type SessionTokenKnobs = {
  // —— Color (one mid swatch per family → 50…950 ladder) ——
  /** Mid primary (~400). Default matches frozen DS primary-400. */
  primary: string;
  /** Mid secondary / brand orange (~400). */
  secondary: string;
  /** Mid gray (~500). */
  neutral: string;
  /**
   * Warmth/cool tint mixed into the neutral ladder.
   * Same as `neutral` → achromatic; cool blue-gray / warm taupe / weird hues all OK.
   * Agent system prompt can steer “colder” vs “warmer”.
   */
  neutralWarmth: string;

  // —— Space ——
  /** Base unit (= primitive space-1). */
  space: string;

  // —— Type ——
  /** Sans family name (Geist is already loaded by frozen tokens.css). */
  fontFamily: string;
  /** Body / scale “1” size (maps to ~font-size-400). */
  fontSize: string;
  /** Global type zoom multiplier (1 = default). */
  typeScale: string;
  weightRegular: string;
  weightMedium: string;
  weightStrong: string;
  weightBold: string;
};

/**
 * Defaults match frozen design-system midpoints (tokens.css).
 * neutralWarmth matches neutral → no default hue shift.
 */
export const DEFAULT_SESSION_TOKEN_KNOBS: SessionTokenKnobs = {
  primary: "#2563eb",
  secondary: "#ea580c",
  neutral: "#737373",
  neutralWarmth: "#737373",
  space: "8px",
  fontFamily: "Geist",
  fontSize: "14px",
  typeScale: "1",
  weightRegular: "400",
  weightMedium: "500",
  weightStrong: "600",
  weightBold: "700",
};

/**
 * Fixed mids for families we still flood in CSS but do not expose as knobs
 * (tertiary + feedback). Match frozen design-system midpoints.
 */
export const FIXED_SESSION_COLOR_MIDS = {
  tertiary: "#03531d",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f97316",
} as const;
