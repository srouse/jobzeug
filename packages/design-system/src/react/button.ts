"use client";

import React from "react";
import { createLazyLitComponent } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-button>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzButton = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzButtonElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/blue-button/blue-button.js"),
  ]);
  return createComponent({
    tagName: "jz-button",
    elementClass: JzButtonElement,
    react: React,
    events: {
      onClick: "click",
    },
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzButton");
