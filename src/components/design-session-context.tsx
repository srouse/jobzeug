"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  DEFAULT_SESSION_TOKEN_KNOBS,
  buildSessionTokensCss,
  injectSessionTokens,
  isSessionTokensInjected,
  parseSessionTokenKnobs,
  removeSessionTokens,
  type SessionTokenKnobs,
} from "@/design/session-tokens";

type DesignSessionValue = {
  knobs: SessionTokenKnobs;
  applied: boolean;
  busy: boolean;
  summary: string | null;
  brandUrl: string | null;
  error: string | null;
  input: string;
  setInput: (value: string) => void;
  ask: (message?: string) => Promise<void>;
  /** Merge + coerce + inject override immediately (manual UI). */
  patchKnobs: (patch: Partial<SessionTokenKnobs>) => void;
  reapply: () => void;
  remove: () => void;
  /** Drop override, restore default knobs, clear summary — back to start. */
  reset: () => void;
};

const DesignSessionContext = createContext<DesignSessionValue | null>(null);

/** Scoped to Design tab UI (panel + footer composer). No auto-inject on mount. */
export function DesignSessionProvider({ children }: { children: ReactNode }) {
  const [knobs, setKnobs] = useState<SessionTokenKnobs>(
    DEFAULT_SESSION_TOKEN_KNOBS,
  );
  const [applied, setApplied] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [brandUrl, setBrandUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setApplied(isSessionTokensInjected());
  }, []);

  const applyKnobs = useCallback((next: SessionTokenKnobs) => {
    setKnobs(next);
    injectSessionTokens(buildSessionTokensCss(next), next.fontFamily);
    setApplied(true);
  }, []);

  const patchKnobs = useCallback(
    (patch: Partial<SessionTokenKnobs>) => {
      const next = parseSessionTokenKnobs({ ...knobs, ...patch });
      applyKnobs(next);
      setError(null);
      setSummary("Manual knobs applied.");
    },
    [applyKnobs, knobs],
  );

  const ask = useCallback(
    async (message?: string) => {
      const text = (message ?? input).trim();
      if (!text || busy) return;

      setBusy(true);
      setError(null);
      setSummary(null);
      setBrandUrl(null);
      try {
        const res = await fetch("/api/design/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, knobs }),
        });
        const data = (await res.json()) as {
          knobs?: SessionTokenKnobs;
          summary?: string;
          brandUrl?: string | null;
          error?: string;
        };
        if (!res.ok || !data.knobs) {
          throw new Error(data.error || `Request failed (${res.status})`);
        }
        applyKnobs(data.knobs);
        setSummary(data.summary?.trim() || "Updated session tokens.");
        setBrandUrl(
          typeof data.brandUrl === "string" && data.brandUrl.trim()
            ? data.brandUrl.trim()
            : null,
        );
        setInput("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Design request failed");
      } finally {
        setBusy(false);
      }
    },
    [applyKnobs, busy, input, knobs],
  );

  const reapply = useCallback(() => {
    applyKnobs(knobs);
    setSummary("Re-applied current knobs.");
    setError(null);
  }, [applyKnobs, knobs]);

  const remove = useCallback(() => {
    removeSessionTokens();
    setApplied(false);
    setSummary(null);
    setBrandUrl(null);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    removeSessionTokens();
    setKnobs(DEFAULT_SESSION_TOKEN_KNOBS);
    setApplied(false);
    setInput("");
    setSummary(null);
    setBrandUrl(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      knobs,
      applied,
      busy,
      summary,
      brandUrl,
      error,
      input,
      setInput,
      ask,
      patchKnobs,
      reapply,
      remove,
      reset,
    }),
    [
      knobs,
      applied,
      busy,
      summary,
      brandUrl,
      error,
      input,
      ask,
      patchKnobs,
      reapply,
      remove,
      reset,
    ],
  );

  return (
    <DesignSessionContext.Provider value={value}>
      {children}
    </DesignSessionContext.Provider>
  );
}

export function useDesignSession() {
  const ctx = useContext(DesignSessionContext);
  if (!ctx) {
    throw new Error("useDesignSession must be used within DesignSessionProvider");
  }
  return ctx;
}

export function useDesignComposerSubmit() {
  const { ask, input, busy } = useDesignSession();
  return (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    void ask();
  };
}
