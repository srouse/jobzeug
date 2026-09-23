/**
 * Run metrics stored on Mastra message `content.metadata` (and AI SDK
 * `message.metadata` after recall / stream finish). Not model-facing text.
 */
export type ChatRunMetrics = {
  durationMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
};

type UsageLike = {
  inputTokens?: unknown;
  outputTokens?: unknown;
  totalTokens?: unknown;
};

function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function buildChatRunMetrics(
  startedAtMs: number,
  usage?: UsageLike | null,
): ChatRunMetrics {
  return {
    durationMs: Math.max(0, Date.now() - startedAtMs),
    inputTokens: asFiniteNumber(usage?.inputTokens),
    outputTokens: asFiniteNumber(usage?.outputTokens),
    totalTokens: asFiniteNumber(usage?.totalTokens),
  };
}

export function chatRunMetricsFromUnknown(
  value: unknown,
): ChatRunMetrics | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const durationMs = asFiniteNumber(record.durationMs);
  if (durationMs == null) return null;
  return {
    durationMs,
    inputTokens: asFiniteNumber(record.inputTokens),
    outputTokens: asFiniteNumber(record.outputTokens),
    totalTokens: asFiniteNumber(record.totalTokens),
  };
}

/** Read metrics from an AI SDK / recalled UI message. */
export function chatRunMetricsFromMessage(message: {
  metadata?: unknown;
}): ChatRunMetrics | null {
  return chatRunMetricsFromUnknown(message.metadata);
}
