import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzProjectCardDefinition = {
  "displayName": "jz-project-card",
  "figma": {
    "componentSetName": "jz-project-card",
    "nodeId": "8959:21439"
  },
  "name": "jz-project-card",
  "props": [
    {
      "default": "call to action",
      "name": "call-to-action",
      "type": "string"
    },
    {
      "default": "description",
      "name": "description",
      "type": "string"
    },
    {
      "default": "supertitle",
      "name": "supertitle",
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
