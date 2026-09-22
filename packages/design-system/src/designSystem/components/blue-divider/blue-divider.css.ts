import { style } from "@vanilla-extract/css";

/**
 * Host is the line: FILL width, FIXED height matching the capture
 * (divider rectangle 336×1, fill `border/default`).
 */
export const root = style({
  display: "block",
  boxSizing: "border-box",
  width: "100%",
  height: "var(--jz-primitive-stroke-width-sm)",
  margin: 0,
  padding: 0,
  border: "none",
  background: "var(--jz-semantic-color-border-default)",
});
