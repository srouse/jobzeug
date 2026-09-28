import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const connectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  text: z.string().default(""),
});

export const focusBriefRequestSchema = z.object({
  postingEntryId: z.string().trim().min(1).regex(/^[\w.-]+$/),
  kind: z.enum(["project", "jobLine"]),
  subject: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    text: z.string().default(""),
  }),
  connections: z.array(connectionSchema).max(4),
  refresh: z.boolean().optional(),
});

/** Stable Contentful entry id for one focus. Stays inside the 64-character limit. */
export function focusBriefEntryId(
  postingEntryId: string,
  kind: "project" | "jobLine",
  subjectId: string,
): string {
  const digest = createHash("sha256")
    .update(`${postingEntryId}\0${kind}\0${subjectId}`)
    .digest("hex")
    .slice(0, 40);
  return `jz-fb-${digest}`;
}

export type FocusBriefRequest = z.infer<typeof focusBriefRequestSchema>;

export const focusBriefOutputSchema = z.object({
  paragraph: z
    .string()
    .min(1)
    .describe(
      "Three or four sentences. Bold project names and job-line names with **markdown**. When the focus is a job line, the first sentence states that requirement as the question.",
    ),
});

/** Keep the first three or four sentences when the model runs long. */
export function capBriefSentences(paragraph: string, max = 4): string {
  const trimmed = paragraph.trim();
  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:["')\]]+)?|[^.!?]+$/g);
  if (!sentences || sentences.length <= max) return trimmed;
  return sentences.slice(0, max).join("").trim();
}

const PROJECT_ID = /^S\d+$/;
const TOP_MATCHES = 2;

function withTopMatches(input: FocusBriefRequest): FocusBriefRequest {
  return { ...input, connections: input.connections.slice(0, TOP_MATCHES) };
}

function projectIds(input: FocusBriefRequest): string[] {
  const ids = [
    input.kind === "project" ? input.subject.id : "",
    ...input.connections.map((item) => item.id),
  ];
  return [...new Set(ids.filter((id) => PROJECT_ID.test(id)))];
}

/** Load evidence/projects files whose names start with the evidence id. */
export async function loadProjectEvidence(
  input: FocusBriefRequest,
): Promise<Array<{ id: string; markdown: string }>> {
  const ids = projectIds(withTopMatches(input));
  if (ids.length === 0) return [];
  const dir = path.resolve(process.cwd(), "evidence/projects");
  const files = await readdir(dir);
  const loaded: Array<{ id: string; markdown: string }> = [];
  for (const id of ids) {
    const name = files.find(
      (file) => file.startsWith(`${id} `) || file.startsWith(`${id}.`),
    );
    if (!name) continue;
    const markdown = await readFile(path.join(dir, name), "utf8");
    loaded.push({ id, markdown });
  }
  return loaded;
}

export function focusBriefPrompt(
  input: FocusBriefRequest,
  files: Array<{ id: string; markdown: string }>,
): string {
  const focused = withTopMatches(input);
  const connections =
    focused.connections.length === 0
      ? "None."
      : focused.connections
          .map(
            (item) =>
              `- ${item.name}${item.text ? `: ${item.text}` : ""} (${item.id})`,
          )
          .join("\n");
  const records =
    files.length === 0
      ? "No project file was preloaded."
      : files
          .map((file) => `### ${file.id}\n${file.markdown}`)
          .join("\n\n");
  const jobLineFocus = focused.kind === "jobLine";
  const question = jobLineFocus
    ? "How do these projects apply to this line item?"
    : "How does this project apply to the highlighted line items?";
  const focusLabel = jobLineFocus ? "Focused job line" : "Focused project";
  const matchLabel = jobLineFocus
    ? "Top projects (use only these)"
    : "Top line items (use only these)";
  const shape = jobLineFocus
    ? "The job line is the question. Open by stating that requirement, in bold, as the question being answered. Do not start with a project. Then say how the top one or two projects apply."
    : "Connect the dots. Say that this project is a good example of each requirement, then the concrete reason. Lead with the project name in bold, then the requirement in bold. Cover only the top one or two line items.";
  return `Question: ${question}

${focusLabel}: ${focused.subject.title} (${focused.subject.id})
${focused.subject.text}

${matchLabel}:
${connections}

Preloaded project files:
${records}

${shape} Use only the matches listed above. Bold every project name and every job-line name with **markdown**. Three or four sentences. No first person, no third person, and no name. The sentences are about the project and the job lines only.`;
}
