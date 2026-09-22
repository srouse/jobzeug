import {
  citeEvidenceSchema,
  emptyCitations,
  type CiteEvidencePayload,
} from "@/lib/evidence-citations";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function parseCitationPayload(value: unknown): CiteEvidencePayload | null {
  const parsed = citeEvidenceSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Extract citeEvidence tool result from an AI SDK / Mastra message parts list. */
export function extractCiteEvidence(parts: unknown[] | undefined): CiteEvidencePayload | null {
  if (!parts?.length) return null;

  for (const part of parts) {
    const record = asRecord(part);
    if (!record) continue;

    const type = typeof record.type === "string" ? record.type : "";
    const toolName =
      (typeof record.toolName === "string" && record.toolName) ||
      (typeof record.name === "string" && record.name) ||
      (type.startsWith("tool-") ? type.slice("tool-".length) : "");

    if (toolName !== "citeEvidence" && type !== "tool-citeEvidence") continue;

    const candidates = [
      record.output,
      record.result,
      record.input,
      asRecord(record.args)?.input,
      record.args,
    ];

    for (const candidate of candidates) {
      const payload = parseCitationPayload(candidate);
      if (payload) return payload;
    }

    // Nested tool-invocation shape
    const invocation = asRecord(record.toolInvocation);
    if (invocation) {
      const nested = [
        invocation.result,
        invocation.output,
        invocation.args,
      ];
      for (const candidate of nested) {
        const payload = parseCitationPayload(candidate);
        if (payload) return payload;
      }
    }
  }

  return null;
}

export function citationsFromMessages(
  messages: Array<{ role: string; parts?: unknown[] }>,
): CiteEvidencePayload {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "assistant") continue;
    const found = extractCiteEvidence(message.parts);
    if (found) return found;
  }
  return emptyCitations;
}
