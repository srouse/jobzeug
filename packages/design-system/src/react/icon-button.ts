import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-icon-button>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzIconButton = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzIconButtonElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-icon-button/jz-icon-button.js"),
  ]);
  return createComponent({
    tagName: "jz-icon-button",
    elementClass: JzIconButtonElement,
    react: litReactModule(React),
    events: {
      onClick: "click",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzIconButton");
