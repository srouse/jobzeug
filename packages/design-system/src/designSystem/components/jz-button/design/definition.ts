import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzButtonDefinition = {
  "displayName": "jz-button",
  "figma": {
    "componentSetName": "jz-button",
    "nodeId": "8:337"
  },
  "name": "jz-button",
  "props": [
    {
      "default": "Default",
      "enum": [
        "Default",
        "Inverse",
        "Primary"
      ],
      "name": "icon-color",
      "nestedFrom": {
        "instanceName": "icon",
        "instanceNodeId": "1297:41673",
        "mainComponentName": "jz-icon"
      },
      "type": "string"
    },
    {
      "default": "1587:53302",
      "name": "icon-icon",
      "nestedFrom": {
        "instanceName": "icon",
        "instanceNodeId": "1297:41673",
        "mainComponentName": "jz-icon"
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
      "name": "icon-size",
      "nestedFrom": {
        "instanceName": "icon",
        "instanceNodeId": "1297:41673",
        "mainComponentName": "jz-icon"
      },
      "type": "string"
    },
    {
      "default": "Default",
      "enum": [
        "Active",
        "Default",
        "Disabled",
        "Hover"
      ],
      "name": "interactive",
      "type": "string"
    },
    {
      "default": "Label",
      "name": "label",
      "type": "string"
    },
    {
      "default": true,
      "name": "showicon",
      "type": "boolean"
    },
    {
      "default": true,
      "name": "showtext",
      "type": "boolean"
    },
    {
      "default": "Default",
      "enum": [
        "Default",
        "Small"
      ],
      "name": "size",
      "type": "string"
    },
    {
      "default": "Primary",
      "enum": [
        "Dark",
        "Inverse",
        "Primary",
        "Secondary"
      ],
      "name": "style",
      "type": "string"
    }
  ],
  "version": "0.1.0"
} satisfies ComponentDefinition;
