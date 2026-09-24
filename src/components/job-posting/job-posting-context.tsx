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

type JobPostingContextValue = {
  data: JobPostingPanelData | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  bind: (input: BindInput) => Promise<void>;
  unbind: () => Promise<void>;
};

const JobPostingContext = createContext<JobPostingContextValue | null>(null);

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
        navigateEntryId(nextEntryId);
        return;
      }

      const previous = dataRef.current;
      setBusy(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch("/api/job-posting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const body = await res.json();
        if (!res.ok) {
          throw new Error(
            (body as { error?: string }).error ?? `Bind failed (${res.status})`,
          );
        }
        const panel = parsePanelPayload(body);
        const publishedId =
          panel?.entryId ??
          (typeof (body as { entryId?: unknown }).entryId === "string"
            ? (body as { entryId: string }).entryId
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
      refresh,
      bind,
      unbind,
    }),
    [data, loading, busy, error, refresh, bind, unbind],
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
