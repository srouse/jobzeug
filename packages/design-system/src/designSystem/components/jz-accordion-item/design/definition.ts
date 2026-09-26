import type { ComponentDefinition } from "@contentful/design-system-squared-agent-kit";

/**
 * Bootstrapped from Figma (`ds2 figma components capture`).
 * Machine contract for props/slots/figma binding; refresh via capture, not by hand-editing structure.
 */
export const jzAccordionItemDefinition = {
  "displayName": "jz-accordion-item",
  "figma": {
    "componentSetName": "jz-accordion-item",
    "nodeId": "39:527"
  },
  "name": "jz-accordion-item",
  "props": [
    {
      "default": "Description",
      "name": "description",
      "type": "string"
    },
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
    },
    {
      "default": false,
      "name": "show-content",
      "type": "boolean"
    },
    {
      "default": true,
      "name": "show-slot",
      "type": "boolean"
    },
    {
      "default": true,
      "name": "show-subtitle",
      "type": "boolean"
    },
    {
      "default": "Subtitle",
      "name": "subtitle",
      "type": "string"
    },
    {
      "default": "Accordion title",
      "name": "title",
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
