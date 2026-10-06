"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { sameProjectId } from "./project-presentation/project-presentation";

const STORAGE_KEY = "jobzeug:resume-2:watched-projects";

/** Drop a `jz-` prefix so the same project is stored once. */
function canonicalProjectId(id: string): string {
  return id.startsWith("jz-") ? id.slice(3) : id;
}

function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids: string[] = [];
    for (const item of parsed) {
      if (typeof item !== "string" || item.length === 0) continue;
      const id = canonicalProjectId(item);
      if (ids.some((existing) => sameProjectId(existing, id))) continue;
      ids.push(id);
    }
    return ids;
  } catch {
    return [];
  }
}

function writeStored(ids: readonly string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* Private mode and quota errors leave the in-memory set in place. */
  }
}

type WatchedProjectsValue = {
  isWatched: (projectId: string) => boolean;
  markWatched: (projectId: string) => void;
  clearWatched: () => void;
};

const WatchedProjectsContext = createContext<WatchedProjectsValue | null>(null);

export function WatchedProjectsProvider({ children }: { children: ReactNode }) {
  const [watchedIds, setWatchedIds] = useState<readonly string[]>([]);

  useEffect(() => {
    setWatchedIds(readStored());
  }, []);

  const markWatched = useCallback((projectId: string) => {
    const id = canonicalProjectId(projectId);
    setWatchedIds((current) => {
      if (current.some((existing) => sameProjectId(existing, id))) return current;
      const next = [...current, id];
      writeStored(next);
      return next;
    });
  }, []);

  const clearWatched = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* The in-memory set still clears. */
    }
    setWatchedIds([]);
  }, []);

  const isWatched = useCallback(
    (projectId: string) =>
      watchedIds.some((id) => sameProjectId(id, projectId)),
    [watchedIds],
  );

  const value = useMemo(
    () => ({ isWatched, markWatched, clearWatched }),
    [isWatched, markWatched, clearWatched],
  );

  return (
    <WatchedProjectsContext.Provider value={value}>
      {children}
    </WatchedProjectsContext.Provider>
  );
}

export function useWatchedProjects(): WatchedProjectsValue {
  const value = useContext(WatchedProjectsContext);
  if (!value) {
    throw new Error("useWatchedProjects must be used within WatchedProjectsProvider");
  }
  return value;
}
