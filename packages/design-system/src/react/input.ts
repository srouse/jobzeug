import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-input>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzInput = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzInputElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-input/jz-input.js"),
  ]);
  return createComponent({
    tagName: "jz-input",
    elementClass: JzInputElement,
    react: litReactModule(React),
    events: {
      onChange: "change",
      onInput: "input",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzInput");
