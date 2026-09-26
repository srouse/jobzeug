import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzIconButtonDefinition = {
  "displayName": "jz-icon-button",
  "figma": {
    "componentSetName": "jz-icon-button",
    "nodeId": "8963:23139"
  },
  "name": "jz-icon-button",
  "props": [
    {
      "default": "Default",
      "enum": [
        "active",
        "Default",
        "disabled",
        "hover"
      ],
      "name": "interactive",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
