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
import type { JobPostingPanelData } from "@/lib/job-posting/schema";

type BindInput = { url: string } | { entryId: string };

export type BindStageName = "scraping" | "structuring" | "matching" | "saving";

export type BindStage = {
  stage: BindStageName;
  status: "working" | "done";
  ms?: number;
};

type JobPostingContextValue = {
  data: JobPostingPanelData | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
  bindStages: BindStage[];
  refresh: () => Promise<void>;
  bind: (input: BindInput) => Promise<void>;
  unbind: () => Promise<void>;
};

const JobPostingContext = createContext<JobPostingContextValue | null>(null);

const BIND_STAGE_NAMES = new Set<BindStageName>([
  "scraping",
  "structuring",
  "matching",
  "saving",
]);

function isBindStageName(value: unknown): value is BindStageName {
  return typeof value === "string" && BIND_STAGE_NAMES.has(value as BindStageName);
}

/** Read the bind response line by line. Stage lines update the list; the last line is the posting. */
async function readBindStream(
  res: Response,
  onStage: (update: (current: BindStage[]) => BindStage[]) => void,
): Promise<unknown> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("Bind returned an empty response");
  const decoder = new TextDecoder();
  let buffer = "";
  let posting: unknown = null;

  const take = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line) as {
      stage?: unknown;
      status?: unknown;
      ms?: unknown;
      error?: unknown;
      posting?: unknown;
    };
    if (typeof event.error === "string" && event.error) {
      throw new Error(event.error);
    }
    if (event.status === "result") {
      posting = event.posting;
      return;
    }
    if (!isBindStageName(event.stage)) return;
    if (event.status !== "working" && event.status !== "done") return;
    const row: BindStage = {
      stage: event.stage,
      status: event.status,
      ...(typeof event.ms === "number" ? { ms: event.ms } : {}),
    };
    onStage((current) => {
      const index = current.findIndex((item) => item.stage === row.stage);
      if (index === -1) return [...current, row];
      const next = current.slice();
      next[index] = row;
      return next;
    });
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) take(line);
      if (done) break;
    }
    if (buffer.trim()) take(buffer);
  } finally {
    reader.releaseLock();
  }
  if (posting == null) throw new Error("Bind finished without a posting");
  return posting;
}

function parsePanelPayload(raw: unknown): JobPostingPanelData | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (data.bound === false) return null;
  if (
    typeof data.entryId !== "string" ||
    typeof data.postingId !== "string" ||
    typeof data.sourceUrl !== "string" ||
    typeof data.company !== "string" ||
    typeof data.title !== "string" ||
    !Array.isArray(data.lines) ||
    !Array.isArray(data.tools)
  ) {
    return null;
  }
  const { bound: _bound, ...rest } = data as JobPostingPanelData & {
    bound?: boolean;
  };
  if (typeof (rest as { fullText?: unknown }).fullText !== "string") {
    (rest as JobPostingPanelData).fullText = "";
  }
  return rest as JobPostingPanelData;
}

export function JobPostingProvider({
  children,
  entryId,
  navigateEntryId,
}: {
  children: ReactNode;
  entryId: string | null;
  /** SPA URL update — must not remount the resume shell. */
  navigateEntryId: (entryId: string | null) => void;
}) {
  const [data, setData] = useState<JobPostingPanelData | null>(null);
  const [loading, setLoading] = useState(Boolean(entryId));
  const [busy, setBusy] = useState(false);
  const [bindStages, setBindStages] = useState<BindStage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<JobPostingPanelData | null>(null);
  dataRef.current = data;
  const entryIdRef = useRef(entryId);
  entryIdRef.current = entryId;

  const refresh = useCallback(async () => {
    const id = entryIdRef.current;
    if (!id) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/job-posting?entryId=${encodeURIComponent(id)}`,
      );
      if (!res.ok) {
        if (res.status === 401) {
          setData(null);
          return;
        }
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `Load failed (${res.status})`);
      }
      const body = await res.json();
      setData(parsePanelPayload(body));
      setError(null);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load job posting");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!entryId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    // Already holding this posting (e.g. after URL ingest) — don't flash a reload.
    if (dataRef.current?.entryId === entryId) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [entryId, refresh]);

  const bind = useCallback(
    async (input: BindInput) => {
      const url = "url" in input ? input.url.trim() : "";
      const nextEntryId = "entryId" in input ? input.entryId.trim() : "";
      if (!url && !nextEntryId) return;

      if (nextEntryId) {
        setError(null);
        setLoading(true);
        navigateEntryId(nextEntryId);
        return;
      }

      const previous = dataRef.current;
      setBusy(true);
      setBindStages([]);
      setError(null);
      setData(null);
      try {
        const res = await fetch("/api/job-posting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? `Bind failed (${res.status})`);
        }
        const posting = await readBindStream(res, setBindStages);
        const panel = parsePanelPayload(posting);
        const publishedId =
          panel?.entryId ??
          (posting &&
          typeof posting === "object" &&
          typeof (posting as { entryId?: unknown }).entryId === "string"
            ? (posting as { entryId: string }).entryId
            : null);
        if (!publishedId) {
          throw new Error("Bind succeeded without an entry id");
        }
        if (panel) setData(panel);
        navigateEntryId(publishedId);
      } catch (err) {
        setData(previous);
        setError(err instanceof Error ? err.message : "Bind failed");
        throw err;
      } finally {
        setBusy(false);
        setBindStages([]);
      }
    },
    [navigateEntryId],
  );

  const unbind = useCallback(async () => {
    setError(null);
    setData(null);
    navigateEntryId(null);
  }, [navigateEntryId]);

  const value = useMemo(
    () => ({
      data,
      loading,
      busy,
      error,
      bindStages,
      refresh,
      bind,
      unbind,
    }),
    [data, loading, busy, error, bindStages, refresh, bind, unbind],
  );

  return (
    <JobPostingContext.Provider value={value}>
      {children}
    </JobPostingContext.Provider>
  );
}

export function useJobPosting(): JobPostingContextValue {
  const ctx = useContext(JobPostingContext);
  if (!ctx) {
    throw new Error("useJobPosting must be used within JobPostingProvider");
  }
  return ctx;
}
