import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzIconDefinition = {
  "displayName": "jz-icon",
  "figma": {
    "componentSetName": "jz-icon",
    "nodeId": "593:6024"
  },
  "name": "jz-icon",
  "props": [
    {
      "default": "Default",
      "enum": [
        "Default",
        "Inverse",
        "Primary"
      ],
      "name": "color",
      "type": "string"
    },
    {
      "default": "1587:53302",
      "name": "icon",
      "type": "string"
    },
    {
      "default": "Stroke",
      "enum": [
        "Outline",
        "Stroke"
      ],
      "name": "icon-format",
      "nestedFrom": {
        "instanceName": "icon",
        "instanceNodeId": "593:6026",
        "mainComponentName": "Info"
      },
      "type": "string"
    },
    {
      "default": "Regular",
      "enum": [
        "Bold",
        "Duotone",
        "Fill",
        "Light",
        "Regular",
        "Thin"
      ],
      "name": "icon-weight",
      "nestedFrom": {
        "instanceName": "icon",
        "instanceNodeId": "593:6026",
        "mainComponentName": "Info"
      },
      "type": "string"
    },
    {
      "default": "Large",
      "enum": [
        "Large",
        "Medium",
        "Small"
      ],
      "name": "size",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
