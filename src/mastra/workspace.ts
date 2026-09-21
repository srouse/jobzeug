import path from "node:path";
import { LocalFilesystem, Workspace } from "@mastra/core/workspace";

const evidenceBasePath = path.resolve(process.cwd(), "evidence");

export const evidenceWorkspace = new Workspace({
  id: "evidence",
  name: "Jobzeug evidence",
  filesystem: new LocalFilesystem({
    basePath: evidenceBasePath,
    readOnly: true,
    contained: true,
  }),
  bm25: true,
  autoIndexPaths: ["**/*.md"],
});

let initPromise: Promise<void> | undefined;

/** Singleton init so Next HMR and Studio do not double-index. */
export function ensureEvidenceWorkspace(): Promise<void> {
  if (!initPromise) {
    initPromise = evidenceWorkspace.init().catch((err) => {
      // Allow retry on next call after a failed init
      initPromise = undefined;
      throw err;
    });
  }
  return initPromise;
}
