import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@/lib/ds-vars";

/** Persistent bottom chrome — above connector lines, below chat dock. */
export const root = style({
  flexShrink: 0,
  position: "relative",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: vars["semantic.space.gap.md"],
  width: "100%",
  boxSizing: "border-box",
  paddingBlock: vars["semantic.space.padding.sm"],
  paddingInline: vars["semantic.space.padding.md"],
  borderTop: `1px solid ${vars["semantic.color.border.default"]}`,
  background: vars["semantic.color.background.surface.default"],
  color: vars["semantic.color.text.default"],
  /* Connectors use modal-12; chat uses modal — sit between them. */
  zIndex: "calc(var(--jz-semantic-layer-modal, 100) - 5)",
});

export const tools = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: vars["semantic.space.gap.sm"],
  minWidth: 0,
  flex: "1 1 auto",
  overflowX: "auto",
  scrollbarWidth: "thin",
});

export const divider = style({
  width: "1px",
  alignSelf: "stretch",
  minHeight: "1.75rem",
  background: vars["semantic.color.border.subtle"],
  flexShrink: 0,
});

export const modeField = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: vars["semantic.space.gap.2xs"],
  flexShrink: 0,
});

export const modeLabel = style({
  flexShrink: 0,
});

export const modeSelect = style({
  fontFamily: vars["semantic.type.body.default.fontFamily"],
  fontSize: vars["semantic.type.label.sm.fontSize"],
  lineHeight: vars["semantic.type.label.sm.lineHeight"],
  paddingBlock: vars["semantic.space.padding.2xs"],
  paddingInline: vars["semantic.space.padding.sm"],
  border: `1px solid ${vars["semantic.color.border.default"]}`,
  borderRadius: vars["primitive.radius.sm"],
  background: vars["semantic.color.background.control.default"],
  color: vars["semantic.color.text.default"],
});

export const jobPosting = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: vars["semantic.space.gap.xs"],
  minWidth: 0,
  flex: "1 1 auto",
});

export const urlInput = style({
  minWidth: "10rem",
  flex: "1 1 12rem",
  maxWidth: "28rem",
  fontFamily: vars["semantic.type.body.default.fontFamily"],
  fontSize: vars["semantic.type.label.sm.fontSize"],
  lineHeight: vars["semantic.type.label.sm.lineHeight"],
  paddingBlock: vars["semantic.space.padding.2xs"],
  paddingInline: vars["semantic.space.padding.sm"],
  border: `1px solid ${vars["semantic.color.border.default"]}`,
  borderRadius: vars["primitive.radius.sm"],
  background: vars["semantic.color.background.control.default"],
  color: vars["semantic.color.text.default"],
});

export const boundMeta = style({
  margin: 0,
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "baseline",
  gap: vars["semantic.space.gap.xs"],
  minWidth: 0,
  maxWidth: "18rem",
});

export const boundTitle = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
});

export const entryId = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flexShrink: 1,
  display: "inline-block",
  maxWidth: "8rem",
});

export const jobStatus = style({
  margin: 0,
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: vars["semantic.space.gap.2xs"],
  whiteSpace: "nowrap",
});

export const jobError = style({
  display: "block",
  margin: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "16rem",
});

export const chatSlot = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  flexShrink: 0,
  marginInlineStart: "auto",
  paddingInlineStart: vars["semantic.space.gap.sm"],
  borderInlineStart: `1px solid ${vars["semantic.color.border.subtle"]}`,
});

globalStyle(`${root} a`, {
  color: "inherit",
});
