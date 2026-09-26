import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-tab>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzTab = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzTabElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-tab/jz-tab.js"),
  ]);
  return createComponent({
    tagName: "jz-tab",
    elementClass: JzTabElement,
    react: litReactModule(React),
    events: {
      onClick: "click",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzTab");
