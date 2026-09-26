import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzDividerDefinition = {
  "displayName": "jz-divider",
  "figma": {
    "componentSetName": "jz-divider",
    "nodeId": "8973:142"
  },
  "name": "jz-divider",
  "props": [
    {
      "default": "Default",
      "enum": [
        "brand",
        "Default",
        "strong",
        "subtle"
      ],
      "name": "design",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
