import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-project-card>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzProjectCard = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzProjectCardElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-project-card/jz-project-card.js"),
  ]);
  return createComponent({
    tagName: "jz-project-card",
    elementClass: JzProjectCardElement,
    react: litReactModule(React),
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzProjectCard");
