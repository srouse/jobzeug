import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-text>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 * Prefer `label` for plain strings; children project through the shadow slot.
 * Use `level` for heading tags (`0` = span, `1`–`6` = h1–h6).
 * Set `interactive` for control hover; use `onClick` for host clicks.
 */
export const JzText = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzTextElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-text/jz-text.js"),
  ]);
  return createComponent({
    tagName: "jz-text",
    elementClass: JzTextElement,
    react: litReactModule(React),
    events: {
      onClick: "click",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzText");
