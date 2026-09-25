/** Editable starter prompts for the answer-stage composer (auto-execute on click).
 *  Framed as a hiring manager / recruiter evaluating this candidate. */
export const RESUME_DEFAULT_PROMPTS = [
  "How strong is the fit for this role?",
  "What evidence best supports this posting?",
  "Where are the gaps against this job?",
  "Why hire this candidate?",
] as const;

/** Used when the user submits with attachments but no typed question. */
export const RESUME_CONTEXT_ONLY_PROMPT =
  "What should I know about this attached context for evaluating the candidate?";

export type AskContextSource = "resume" | "job";

export type AskContextItem = {
  id: string;
  source: AskContextSource;
  label: string;
  text: string;
};

/** Fold attached rows into the user message sent to themed chat. */
export function composeAskMessage(
  question: string,
  items: AskContextItem[],
): string {
  const q = question.trim();
  if (!items.length) return q;
  const lines = items.map((item) => `- [${item.source}] ${item.text}`);
  return `${q}\n\nContext:\n${lines.join("\n")}`;
}

/** Short chip label from row text (keep tags compact). */
export function askContextLabel(text: string, max = 18): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}
