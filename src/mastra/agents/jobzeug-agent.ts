import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

/**
 * Stub agent for Jobzeug / Figma Role evidence work.
 * Evidence file tools come later — for now this is a smoke-test agent for Studio + /chat.
 */
export const jobzeugAgent = new Agent({
  id: "jobzeug-agent",
  name: "Jobzeug Agent",
  instructions: `You are a helpful assistant for the Jobzeug workspace: Scott's Figma Forward Deployed Engineer application evidence base.

The canonical knowledge lives in the local \`evidence/\` Markdown workspace (employers, roles, projects, customers, clients, perspectives). You do not yet have tools to read those files — say so clearly if asked for specific career facts, and do not invent metrics, employers, or outcomes.

Help with clarifying questions, structuring application materials, and explaining the evidence model (C00x employers, R00x roles, S00x projects, CU00x customers, CL00x clients, P00x perspectives). Keep answers concise.`,
  model: "openai/gpt-4o-mini",
  memory: new Memory({
    options: {
      generateTitle: true,
    },
  }),
});
