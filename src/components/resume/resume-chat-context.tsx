"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useJobPosting } from "@/components/job-posting";
import { useResumeHighlights } from "./resume-highlight-context";
import {
  emptyCitations,
  formatElapsed,
  type CiteEvidencePayload,
  type EvidenceCluster,
} from "@/lib/evidence-citations";
import { toChatJobPostingPayload } from "@/lib/job-posting/schema";
import {
  sectionsToAnswerMarkdown,
  unionCitations,
  type AnswerSection,
} from "@/lib/themed-answer";

export const RESUME_CHAT_API = "/api/chat/themed";

export function textFromParts(
  parts: Array<{ type: string; text?: string }> | undefined,
): string {
  if (!parts?.length) return "";
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type ChatMessage = {
  id: string;
  role: string;
  parts?: Array<{ type: string; text?: string }>;
  metadata?: unknown;
};

type ResumeChatContextValue = {
  messages: ChatMessage[];
  isLoading: boolean;
  /** True until the initial session hydrate from `/api/chat/themed` finishes. */
  sessionLoading: boolean;
  status: string;
  clearing: boolean;
  runStartedAt: number | null;
  elapsedMs: number;
  liveElapsedLabel: string | undefined;
  clusterByMessageId: Record<string, EvidenceCluster>;
  /** Pre-ask only: attach row context when no answer is showing and chat is idle. */
  canAttachContext: boolean;
  ask: (text: string) => void;
  clearSession: () => Promise<void>;
  selectAssistantCluster: (message: ChatMessage) => void;
};

const ResumeChatContext = createContext<ResumeChatContextValue | null>(null);

type ThemedMeta = {
  sections?: AnswerSection[];
  citations?: CiteEvidencePayload;
  durationMs?: number;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
};

function metaFromUnknown(value: unknown): ThemedMeta {
  if (!value || typeof value !== "object") return {};
  return value as ThemedMeta;
}

function questionBeforeAssistant(
  messages: ChatMessage[],
  assistantId: string,
): string {
  const index = messages.findIndex((message) => message.id === assistantId);
  if (index <= 0) return "";
  for (let i = index - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "user") {
      return textFromParts(messages[i].parts);
    }
  }
  return "";
}

function clusterFromMessage(
  message: ChatMessage,
  existing?: EvidenceCluster,
  question = "",
): EvidenceCluster {
  const meta = metaFromUnknown(message.metadata);
  const sections = meta.sections ?? existing?.sections;
  const answerMarkdown =
    textFromParts(message.parts) ||
    (sections ? sectionsToAnswerMarkdown(sections) : "") ||
    existing?.answerMarkdown ||
    "";
  const citations =
    meta.citations ??
    (sections
      ? unionCitations(sections.map((section) => section.citations))
      : undefined) ??
    existing?.citations ??
    emptyCitations;

  return {
    id: message.id,
    citations,
    createdAt: existing?.createdAt ?? Date.now(),
    durationMs: meta.durationMs ?? existing?.durationMs ?? 0,
    inputTokens: meta.inputTokens ?? existing?.inputTokens,
    outputTokens: meta.outputTokens ?? existing?.outputTokens,
    totalTokens: meta.totalTokens ?? existing?.totalTokens,
    answerMarkdown,
    question: question || existing?.question || "",
    sections,
  };
}

async function readSseEvents(
  response: Response,
  onEvent: (data: Record<string, unknown>) => void,
): Promise<void> {
  if (!response.body) throw new Error("No response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const line = chunk
        .split("\n")
        .map((part) => part.trim())
        .find((part) => part.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;
      try {
        onEvent(JSON.parse(payload) as Record<string, unknown>);
      } catch {
        // Skip malformed event chunks.
      }
    }
  }
}

export function ResumeChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [clearing, setClearing] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [runStartedAt, setRunStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [clusterByMessageId, setClusterByMessageId] = useState<
    Record<string, EvidenceCluster>
  >({});
  const { setActiveCluster, clearActiveCluster, clearAskContext, activeCluster } =
    useResumeHighlights();
  const { data: jobPosting } = useJobPosting();
  const jobPostingRef = useRef(jobPosting);
  jobPostingRef.current = jobPosting;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const clusterByMessageIdRef = useRef(clusterByMessageId);
  clusterByMessageIdRef.current = clusterByMessageId;
  /** Bumped on clear so in-flight ask SSE cannot repopulate the UI. */
  const sessionEpochRef = useRef(0);

  const status = isLoading ? "streaming" : "ready";
  const liveElapsedLabel =
    isLoading && runStartedAt != null ? formatElapsed(elapsedMs) : undefined;
  const canAttachContext =
    !activeCluster && !isLoading && !sessionLoading;

  const selectAssistantCluster = useCallback(
    (message: ChatMessage) => {
      const existing = clusterByMessageId[message.id];
      const question = questionBeforeAssistant(messagesRef.current, message.id);
      const cluster = clusterFromMessage(message, existing, question);
      setClusterByMessageId((prev) => ({ ...prev, [message.id]: cluster }));
      setActiveCluster(cluster);
    },
    [clusterByMessageId, setActiveCluster],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(RESUME_CHAT_API);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as ChatMessage[];
        if (cancelled) return;
        setMessages([...data]);

        const clusters: Record<string, EvidenceCluster> = {};
        for (const message of data) {
          if (message.role !== "assistant") continue;
          if (!textFromParts(message.parts) && !metaFromUnknown(message.metadata).sections)
            continue;
          clusters[message.id] = clusterFromMessage(
            message,
            undefined,
            questionBeforeAssistant(data, message.id),
          );
        }
        setClusterByMessageId(clusters);

        const lastAssistant = [...data]
          .reverse()
          .find(
            (message) =>
              message.role === "assistant" &&
              (Boolean(textFromParts(message.parts)) ||
                Boolean(metaFromUnknown(message.metadata).sections)),
          );
        if (lastAssistant) {
          setActiveCluster(
            clusters[lastAssistant.id] ??
              clusterFromMessage(
                lastAssistant,
                undefined,
                questionBeforeAssistant(data, lastAssistant.id),
              ),
          );
        }
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setActiveCluster]);

  useEffect(() => {
    if (!isLoading || runStartedAt == null) return;
    const tick = () => setElapsedMs(Date.now() - runStartedAt);
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [isLoading, runStartedAt]);

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      clearActiveCluster();
      clearAskContext();
      const startedAt = Date.now();
      const epoch = sessionEpochRef.current;
      setRunStartedAt(startedAt);
      setElapsedMs(0);
      setIsLoading(true);

      const userMessageId = crypto.randomUUID();
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        parts: [{ type: "text", text: trimmed }],
      };
      setMessages((prev) => [...prev, userMessage]);

      void (async () => {
        let assistantId: string | null = null;
        const stillCurrent = () => sessionEpochRef.current === epoch;
        try {
          const current = jobPostingRef.current;
          const res = await fetch(RESUME_CHAT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: trimmed,
              ...(current
                ? { jobPosting: toChatJobPostingPayload(current) }
                : {}),
            }),
          });
          if (!stillCurrent()) return;
          if (!res.ok) {
            throw new Error(`Themed chat failed (${res.status})`);
          }

          await readSseEvents(res, (event) => {
            if (!stillCurrent()) return;
            const type = event.type;
            if (type === "themes") {
              assistantId = String(event.id);
              const sections = (event.sections as AnswerSection[]) ?? [];
              const citations =
                (event.citations as CiteEvidencePayload) ??
                unionCitations(sections.map((section) => section.citations));
              const cluster: EvidenceCluster = {
                id: assistantId,
                citations,
                createdAt: Date.now(),
                durationMs: 0,
                answerMarkdown: sectionsToAnswerMarkdown(sections),
                question: trimmed,
                sections,
              };
              clusterByMessageIdRef.current = {
                ...clusterByMessageIdRef.current,
                [assistantId]: cluster,
              };
              setClusterByMessageId((prev) => ({
                ...prev,
                [assistantId!]: cluster,
              }));
              setActiveCluster(cluster);
              setMessages((prev) => {
                if (prev.some((message) => message.id === assistantId)) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    id: assistantId!,
                    role: "assistant",
                    parts: [{ type: "text", text: "" }],
                    metadata: {
                      sections,
                      citations,
                    },
                  },
                ];
              });
              return;
            }

            if (type === "section" && event.section) {
              const section = event.section as AnswerSection;
              const id = String(event.id);
              assistantId = id;
              setClusterByMessageId((prev) => {
                const existing = prev[id];
                if (!existing?.sections) return prev;
                const sections = existing.sections.map((item) =>
                  item.id === section.id ? section : item,
                );
                const citations = unionCitations(
                  sections.map((item) => item.citations),
                );
                const next: EvidenceCluster = {
                  ...existing,
                  sections,
                  citations,
                  answerMarkdown: sectionsToAnswerMarkdown(sections),
                };
                clusterByMessageIdRef.current = { ...prev, [id]: next };
                return clusterByMessageIdRef.current;
              });
              // Read latest from the ref so a late flush cannot wipe `done` metrics.
              queueMicrotask(() => {
                const cluster = clusterByMessageIdRef.current[id];
                if (cluster) setActiveCluster(cluster);
              });
              setMessages((prev) =>
                prev.map((message) => {
                  if (message.id !== id) return message;
                  const meta = metaFromUnknown(message.metadata);
                  const sections = (meta.sections ?? []).map((item) =>
                    item.id === section.id ? section : item,
                  );
                  return {
                    ...message,
                    parts: [
                      {
                        type: "text",
                        text: sectionsToAnswerMarkdown(sections),
                      },
                    ],
                    metadata: {
                      ...meta,
                      sections,
                      citations: unionCitations(
                        sections.map((item) => item.citations),
                      ),
                    },
                  };
                }),
              );
              return;
            }

            if (type === "done") {
              const id = String(event.id);
              assistantId = id;
              const sections = (event.sections as AnswerSection[]) ?? [];
              const citations =
                (event.citations as CiteEvidencePayload) ??
                unionCitations(sections.map((section) => section.citations));
              const answerMarkdown =
                typeof event.answerMarkdown === "string"
                  ? event.answerMarkdown
                  : sectionsToAnswerMarkdown(sections);
              const cluster: EvidenceCluster = {
                id,
                citations,
                createdAt: Date.now(),
                durationMs:
                  typeof event.durationMs === "number" ? event.durationMs : 0,
                inputTokens:
                  typeof event.inputTokens === "number"
                    ? event.inputTokens
                    : null,
                outputTokens:
                  typeof event.outputTokens === "number"
                    ? event.outputTokens
                    : null,
                totalTokens:
                  typeof event.totalTokens === "number"
                    ? event.totalTokens
                    : null,
                answerMarkdown,
                question: trimmed,
                sections,
              };
              clusterByMessageIdRef.current = {
                ...clusterByMessageIdRef.current,
                [id]: cluster,
              };
              setClusterByMessageId((prev) => ({ ...prev, [id]: cluster }));
              setActiveCluster(cluster);
              setMessages((prev) => {
                const withoutPlaceholder = prev.filter(
                  (message) => message.id !== id,
                );
                return [
                  ...withoutPlaceholder,
                  {
                    id,
                    role: "assistant",
                    parts: [{ type: "text", text: answerMarkdown }],
                    metadata: {
                      sections,
                      citations,
                      durationMs: cluster.durationMs,
                      inputTokens: cluster.inputTokens,
                      outputTokens: cluster.outputTokens,
                      totalTokens: cluster.totalTokens,
                    },
                  },
                ];
              });
              return;
            }

            if (type === "error") {
              throw new Error(
                typeof event.error === "string"
                  ? event.error
                  : "Themed answer failed",
              );
            }
          });
        } catch (error) {
          if (!stillCurrent()) return;
          console.error(error);
          if (assistantId) {
            clearActiveCluster();
          }
        } finally {
          if (stillCurrent()) {
            setIsLoading(false);
            setRunStartedAt(null);
          }
        }
      })();
    },
    [clearActiveCluster, clearAskContext, isLoading, setActiveCluster],
  );

  const clearSession = useCallback(async () => {
    if (clearing) return;
    sessionEpochRef.current += 1;
    // Kick the UI out immediately; server DELETE finishes in the background.
    setMessages([]);
    setClusterByMessageId({});
    clusterByMessageIdRef.current = {};
    setRunStartedAt(null);
    setElapsedMs(0);
    setIsLoading(false);
    clearActiveCluster();
    clearAskContext();
    setClearing(true);
    try {
      await fetch(RESUME_CHAT_API, { method: "DELETE" });
    } catch (error) {
      console.error(error);
    } finally {
      setClearing(false);
    }
  }, [clearActiveCluster, clearAskContext, clearing]);

  const value = useMemo<ResumeChatContextValue>(
    () => ({
      messages,
      isLoading,
      sessionLoading,
      status,
      clearing,
      runStartedAt,
      elapsedMs,
      liveElapsedLabel,
      clusterByMessageId,
      canAttachContext,
      ask,
      clearSession,
      selectAssistantCluster,
    }),
    [
      messages,
      isLoading,
      sessionLoading,
      status,
      clearing,
      runStartedAt,
      elapsedMs,
      liveElapsedLabel,
      clusterByMessageId,
      canAttachContext,
      ask,
      clearSession,
      selectAssistantCluster,
    ],
  );

  return (
    <ResumeChatContext.Provider value={value}>{children}</ResumeChatContext.Provider>
  );
}

export function useResumeChat(): ResumeChatContextValue {
  const ctx = useContext(ResumeChatContext);
  if (!ctx) {
    throw new Error("useResumeChat must be used within ResumeChatProvider");
  }
  return ctx;
}
