import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import {
  Observability,
  MastraStorageExporter,
  SensitiveDataFilter,
} from "@mastra/observability";

import { jobzeugAgent } from "./agents/jobzeug-agent";
import { storage } from "./storage";

export const mastra = new Mastra({
  agents: { jobzeugAgent },
  storage,
  logger: new PinoLogger({
    name: "Jobzeug",
    level: "info",
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "jobzeug",
        exporters: [new MastraStorageExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  }),
});
