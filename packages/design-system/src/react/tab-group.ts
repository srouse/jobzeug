import React from "react";
import { createLazyLitComponent, litReactModule } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-tab-group>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzTabGroup = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzTabGroupElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/jz-tab-group/jz-tab-group.js"),
  ]);
  return createComponent({
    tagName: "jz-tab-group",
    elementClass: JzTabGroupElement,
    react: litReactModule(React),
    events: {
      onChange: "change",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzTabGroup");
