import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzHighlightDefinition = {
  "displayName": "jz-highlight",
  "figma": {
    "componentSetName": "jz-highlight",
    "nodeId": "8963:24348"
  },
  "name": "jz-highlight",
  "props": [
    {
      "default": "Default",
      "enum": [
        "Default",
        "mobile"
      ],
      "name": "breakpoint",
      "type": "string"
    },
    {
      "default": "description",
      "name": "description",
      "type": "string"
    },
    {
      "default": "question",
      "name": "question",
      "type": "string"
    },
    {
      "default": "title",
      "name": "title",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
