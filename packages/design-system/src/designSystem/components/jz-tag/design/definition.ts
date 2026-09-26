import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzTagDefinition = {
  "displayName": "jz-tag",
  "figma": {
    "componentSetName": "jz-tag",
    "nodeId": "85:1880"
  },
  "name": "jz-tag",
  "props": [
    {
      "default": true,
      "name": "show-icon",
      "type": "boolean"
    },
    {
      "default": "Default",
      "enum": [
        "Active",
        "Default",
        "Hover"
      ],
      "name": "state",
      "type": "string"
    },
    {
      "default": "Default",
      "enum": [
        "Default",
        "outline",
        "primary"
      ],
      "name": "style",
      "type": "string"
    },
    {
      "default": "Title",
      "name": "title",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
