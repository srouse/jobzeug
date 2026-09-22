export const SESSION_COOKIE = "jobzeug_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = { v: 1; sid: string };

export function hasAuthEnv(): boolean {
  return Boolean(process.env.SITE_PASSWORD && process.env.SESSION_SECRET);
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function canonicalPayload(payload: SessionPayload): string {
  return JSON.stringify({ v: payload.v, sid: payload.sid });
}

function parseSessionPayload(raw: string): SessionPayload | null {
  try {
    const data = JSON.parse(raw) as SessionPayload;
    if (data?.v !== 1 || typeof data.sid !== "string") return null;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.sid)) {
      return null;
    }
    return { v: 1, sid: data.sid };
  } catch {
    return null;
  }
}

async function signPayload(payload: SessionPayload): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not defined");
  const body = canonicalPayload(payload);
  const sig = await hmacHex(secret, body);
  return `${toBase64Url(body)}.${sig}`;
}

async function verifyAndParse(value: string): Promise<SessionPayload | null> {
  const [encoded, sig] = value.split(".");
  if (!encoded || !sig) return null;
  const body = fromBase64Url(encoded);
  const payload = parseSessionPayload(body);
  if (!payload) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const expected = await hmacHex(secret, canonicalPayload(payload));
  if (!timingSafeEqualHex(sig, expected)) return null;
  return payload;
}

export async function isValidSessionCookie(
  value: string | undefined,
): Promise<boolean> {
  if (!value || !process.env.SESSION_SECRET) return false;
  try {
    return (await verifyAndParse(value)) !== null;
  } catch {
    return false;
  }
}

/** Returns the session UUID from a valid cookie, or null. */
export async function getSessionId(
  value: string | undefined,
): Promise<string | null> {
  if (!value || !process.env.SESSION_SECRET) return null;
  try {
    const payload = await verifyAndParse(value);
    return payload?.sid ?? null;
  } catch {
    return null;
  }
}

export function passwordsMatch(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function getSessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** Create a new signed session cookie value with a fresh UUID. */
export async function createSessionValue(): Promise<string> {
  return signPayload({ v: 1, sid: crypto.randomUUID() });
}

export type ChatSurface = "chat" | "resume";

export function parseChatSurface(value: unknown): ChatSurface {
  return value === "resume" ? "resume" : "chat";
}

export function chatMemoryIds(sid: string, surface: ChatSurface) {
  return {
    resource: `session:${sid}`,
    thread: `${surface}:${sid}`,
  };
}

/** Safe internal redirect path only (no open redirects). */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}
