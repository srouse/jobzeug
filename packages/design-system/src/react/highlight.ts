import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-highlight>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzHighlight = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzHighlightElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-highlight/jz-highlight.js"),
  ]);
  return createComponent({
    tagName: "jz-highlight",
    elementClass: JzHighlightElement,
    react: litReactModule(React),
    events: {
      onClick: "click",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzHighlight");
