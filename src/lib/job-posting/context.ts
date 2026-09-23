import { cookies } from "next/headers";

import {
  formatJobPostingContext,
  loadJobPostingByEntryId,
} from "./contentful";
import { JOB_POSTING_COOKIE, getBoundJobPostingEntryId } from "./session";

/** Load session-bound Job Posting as a system context string for jobzeug-agent. */
export async function loadBoundJobPostingContext(): Promise<string | null> {
  const jar = await cookies();
  const entryId = await getBoundJobPostingEntryId(
    jar.get(JOB_POSTING_COOKIE)?.value,
  );
  if (!entryId) return null;
  try {
    const view = await loadJobPostingByEntryId(entryId);
    if (!view) return null;
    return formatJobPostingContext(view);
  } catch {
    return null;
  }
}
