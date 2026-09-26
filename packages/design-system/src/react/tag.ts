import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-tag>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzTag = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzTagElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-tag/jz-tag.js"),
  ]);
  return createComponent({
    tagName: "jz-tag",
    elementClass: JzTagElement,
    react: litReactModule(React),
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzTag");
