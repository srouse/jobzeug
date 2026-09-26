import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-icon>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzIcon = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzIconElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-icon/jz-icon.js"),
  ]);
  return createComponent({
    tagName: "jz-icon",
    elementClass: JzIconElement,
    react: litReactModule(React),
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzIcon");
