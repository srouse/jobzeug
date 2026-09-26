import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-accordion>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzAccordion = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzAccordionElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-accordion/jz-accordion.js"),
  ]);
  return createComponent({
    tagName: "jz-accordion",
    elementClass: JzAccordionElement,
    react: litReactModule(React),
    events: {
      onChange: "change",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzAccordion");
