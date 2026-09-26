import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzTabGroupDefinition = {
  "displayName": "jz-tab-group",
  "figma": {
    "componentSetName": "jz-tab-group",
    "nodeId": "8974:21469"
  },
  "name": "jz-tab-group",
  "props": [
    {
      "default": "bottom",
      "enum": [
        "bottom",
        "top"
      ],
      "name": "direction",
      "type": "string"
    }
  ],
  "slots": [
    {
      "name": "slot"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
