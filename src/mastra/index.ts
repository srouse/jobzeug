import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { jobzeugAgent } from "./agents/jobzeug-agent";
import { jobzeugDesignTokensAgent } from "./agents/jobzeug-design-tokens";
import { jobPostingStructurerAgent } from "./agents/job-posting-structurer";
import { jobzeugThemeOutlineAgent } from "./agents/jobzeug-theme-outline";
import { jobzeugThemeWriterAgent } from "./agents/jobzeug-theme-writer";
import { storage } from "./storage";
import { ensureEvidenceWorkspace } from "./workspace";

void ensureEvidenceWorkspace().catch((err) => {
  console.error("[jobzeug] evidence workspace init failed:", err);
});

export const mastra = new Mastra({
  agents: {
    jobzeugAgent,
    jobzeugDesignTokensAgent,
    jobPostingStructurerAgent,
    jobzeugThemeOutlineAgent,
    jobzeugThemeWriterAgent,
  },
  storage,
  logger: new PinoLogger({
    name: "Jobzeug",
    level: "info",
  }),
});
