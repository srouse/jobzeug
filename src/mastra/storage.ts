import { PostgresStore } from "@mastra/pg";

declare global {
  // eslint-disable-next-line no-var
  var __jobzeugPgStore: PostgresStore | undefined;
}

function isNextBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

/**
 * `pg` currently treats sslmode prefer/require/verify-ca as verify-full and warns.
 * Pin verify-full so behavior stays the same without the deprecation noise.
 */
function normalizePgConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const mode = url.searchParams.get("sslmode")?.toLowerCase();
    if (mode === "prefer" || mode === "require" || mode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
    }
    return url.toString();
  } catch {
    return connectionString.replace(
      /([?&]sslmode=)(prefer|require|verify-ca)\b/i,
      "$1verify-full",
    );
  }
}

function createPgStore(): PostgresStore {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    if (isNextBuild()) {
      // Avoid failing `next build` before env is available; runtime still requires a real URL.
      return new PostgresStore({
        id: "jobzeug-storage",
        connectionString: "postgresql://127.0.0.1:5432/jobzeug_build_placeholder",
      });
    }
    throw new Error(
      "DATABASE_URL is not defined. Add Vercel Postgres (Marketplace) and set DATABASE_URL in .env.",
    );
  }

  return new PostgresStore({
    id: "jobzeug-storage",
    connectionString: normalizePgConnectionString(connectionString),
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

/** Singleton so Next.js HMR does not create duplicate pools. */
export function getStorage(): PostgresStore {
  if (!globalThis.__jobzeugPgStore) {
    globalThis.__jobzeugPgStore = createPgStore();
  }
  return globalThis.__jobzeugPgStore;
}

export const storage = getStorage();
