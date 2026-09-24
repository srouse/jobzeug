import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { ensureEvidenceWorkspace, evidenceWorkspace } from "../workspace";

/**
 * Mastra's built-in `mastra_workspace_read_file` rejects `offset: 0` (1-indexed
 * only). Models often pass 0; coerce it so outline/agent runs don't burn a turn.
 */
const lineOffsetSchema = z.preprocess((value) => {
  if (value === 0 || value === "0") return 1;
  return value;
}, z.number().int().min(1).optional());

function formatLines(
  lines: string[],
  startLine: number,
  showLineNumbers: boolean,
): string {
  if (!showLineNumbers) return lines.join("\n");
  const width = String(startLine + lines.length - 1).length;
  return lines
    .map((line, index) => {
      const n = String(startLine + index).padStart(width, " ");
      return `${n}|${line}`;
    })
    .join("\n");
}

/**
 * Drop-in replacement for workspace read_file with offset coercion.
 * Register on evidence-backed agents; disable the built-in via workspace tools config.
 */
export const evidenceReadFileTool = createTool({
  id: "mastra_workspace_read_file",
  description:
    "Read a text file from the evidence workspace. Paths are relative to evidence/ (e.g. roles/INDEX.md). offset is 1-indexed (first line = 1); omit offset to start at the beginning. Use limit for a line window on large files.",
  inputSchema: z.object({
    path: z.string().min(1).describe("Path relative to the evidence workspace root"),
    offset: lineOffsetSchema.describe(
      "1-indexed start line (default 1). Never use 0.",
    ),
    limit: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe("Max number of lines to return from offset"),
    showLineNumbers: z
      .boolean()
      .optional()
      .default(false)
      .describe("Prefix each line with its line number"),
    encoding: z
      .enum(["utf-8", "utf8", "base64", "binary", "hex"])
      .optional()
      .describe("Ignored for text evidence files; always utf-8"),
  }),
  execute: async (input) => {
    await ensureEvidenceWorkspace();
    const filesystem = evidenceWorkspace.filesystem;
    if (!filesystem) {
      throw new Error("Evidence workspace filesystem is not available");
    }

    const raw = await filesystem.readFile(input.path, { encoding: "utf-8" });
    const text = typeof raw === "string" ? raw : Buffer.from(raw).toString("utf-8");
    const allLines = text.split("\n");
    // Trailing newline yields an empty last element — keep file shape as-is.
    const startLine = input.offset ?? 1;
    const startIndex = startLine - 1;
    const window = input.limit
      ? allLines.slice(startIndex, startIndex + input.limit)
      : allLines.slice(startIndex);

    return formatLines(window, startLine, Boolean(input.showLineNumbers));
  },
});
