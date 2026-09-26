import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-divider>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzDivider = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzDividerElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-divider/jz-divider.js"),
  ]);
  return createComponent({
    tagName: "jz-divider",
    elementClass: JzDividerElement,
    react: litReactModule(React),
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzDivider");
