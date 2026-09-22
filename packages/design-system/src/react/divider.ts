"use client";

import React from "react";
import { createLazyLitComponent } from "./lazy-lit.js";

/**
 * Browser-only React wrapper for `<jz-divider>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export const JzDivider = createLazyLitComponent(async () => {
  const [{ createComponent }, { JzDividerElement }] = await Promise.all([
    import("@lit/react"),
    import("../designSystem/components/blue-divider/blue-divider.js"),
  ]);
  return createComponent({
    tagName: "jz-divider",
    elementClass: JzDividerElement,
    react: React,
  }) as React.ComponentType<Record<string, unknown>>;
}, "JzDivider");
