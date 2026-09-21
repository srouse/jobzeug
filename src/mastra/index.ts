import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { jobzeugAgent } from "./agents/jobzeug-agent";
import { storage } from "./storage";
import { ensureEvidenceWorkspace } from "./workspace";

void ensureEvidenceWorkspace().catch((err) => {
  console.error("[jobzeug] evidence workspace init failed:", err);
});

export const mastra = new Mastra({
  agents: { jobzeugAgent },
  storage,
  logger: new PinoLogger({
    name: "Jobzeug",
    level: "info",
  }),
});
