import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzTabDefinition = {
  "displayName": "jz-tab",
  "figma": {
    "componentSetName": "jz-tab",
    "nodeId": "85:2250"
  },
  "name": "jz-tab",
  "props": [
    {
      "default": "bottom",
      "enum": [
        "bottom",
        "top"
      ],
      "name": "direction",
      "type": "string"
    },
    {
      "default": "default",
      "enum": [
        "active",
        "default",
        "disabeld",
        "hover"
      ],
      "name": "interactive",
      "type": "string"
    },
    {
      "default": "label",
      "name": "label",
      "type": "string"
    },
    {
      "default": "false",
      "enum": [
        "false",
        "true"
      ],
      "name": "selected",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
