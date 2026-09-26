import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-accordion-item>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzAccordionItem = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzAccordionItemElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-accordion-item/jz-accordion-item.js"),
  ]);
  return createComponent({
    tagName: "jz-accordion-item",
    elementClass: JzAccordionItemElement,
    react: litReactModule(React),
    events: {
      onToggle: "toggle",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzAccordionItem");
