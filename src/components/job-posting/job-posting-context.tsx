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

const BIND_PHASES = [
  "Scraping listing…",
  "Extracting structure…",
  "Publishing to Contentful…",
] as const;

type JobPostingContextValue = {
  data: JobPostingPanelData | null;
  loading: boolean;
  busy: boolean;
  /** Human-readable phase while bind/unbind runs */
  status: string | null;
  /** URL currently being ingested */
  pendingUrl: string | null;
  error: string | null;
  refresh: () => Promise<void>;
  bind: (url: string) => Promise<void>;
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

export function JobPostingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<JobPostingPanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dataRef = useRef<JobPostingPanelData | null>(null);
  dataRef.current = data;

  const clearPhaseTimer = useCallback(() => {
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const startBindPhases = useCallback(() => {
    clearPhaseTimer();
    let index = 0;
    setStatus(BIND_PHASES[0]);
    phaseTimerRef.current = setInterval(() => {
      index = Math.min(index + 1, BIND_PHASES.length - 1);
      setStatus(BIND_PHASES[index]);
      if (index >= BIND_PHASES.length - 1) clearPhaseTimer();
    }, 2800);
  }, [clearPhaseTimer]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/job-posting");
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
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => () => clearPhaseTimer(), [clearPhaseTimer]);

  const bind = useCallback(
    async (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      const previous = dataRef.current;
      setBusy(true);
      setError(null);
      setPendingUrl(trimmed);
      // Hide stale posting while the new one processes.
      setData(null);
      startBindPhases();
      try {
        const res = await fetch("/api/job-posting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });
        const body = await res.json();
        if (!res.ok) {
          throw new Error(
            (body as { error?: string }).error ?? `Bind failed (${res.status})`,
          );
        }
        setStatus("Loading posting…");
        const panel = parsePanelPayload(body);
        if (panel) {
          setData(panel);
        } else {
          await refresh();
        }
      } catch (err) {
        setData(previous);
        setError(err instanceof Error ? err.message : "Bind failed");
        throw err;
      } finally {
        clearPhaseTimer();
        setBusy(false);
        setStatus(null);
        setPendingUrl(null);
      }
    },
    [clearPhaseTimer, refresh, startBindPhases],
  );

  const unbind = useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatus("Clearing posting…");
    try {
      const res = await fetch("/api/job-posting", { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `Clear failed (${res.status})`);
      }
      setData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Clear failed");
      throw err;
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      data,
      loading,
      busy,
      status,
      pendingUrl,
      error,
      refresh,
      bind,
      unbind,
    }),
    [data, loading, busy, status, pendingUrl, error, refresh, bind, unbind],
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
