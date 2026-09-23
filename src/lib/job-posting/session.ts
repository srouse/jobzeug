import {
  SESSION_MAX_AGE_SECONDS,
  getSessionCookieOptions,
} from "@/lib/site-auth";

export const JOB_POSTING_COOKIE = "jobzeug_job_posting";

type JobPostingCookiePayload = { v: 1; entryId: string };

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
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
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

function canonical(payload: JobPostingCookiePayload): string {
  return JSON.stringify({ v: payload.v, entryId: payload.entryId });
}

function parsePayload(raw: string): JobPostingCookiePayload | null {
  try {
    const data = JSON.parse(raw) as JobPostingCookiePayload;
    if (data?.v !== 1 || typeof data.entryId !== "string") return null;
    if (!/^[\w-]+$/.test(data.entryId)) return null;
    return { v: 1, entryId: data.entryId };
  } catch {
    return null;
  }
}

export async function createJobPostingCookieValue(
  entryId: string,
): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not defined");
  const payload: JobPostingCookiePayload = { v: 1, entryId };
  const body = canonical(payload);
  const sig = await hmacHex(secret, body);
  return `${toBase64Url(body)}.${sig}`;
}

export async function getBoundJobPostingEntryId(
  cookieValue: string | undefined,
): Promise<string | null> {
  if (!cookieValue || !process.env.SESSION_SECRET) return null;
  const [encoded, sig] = cookieValue.split(".");
  if (!encoded || !sig) return null;
  const body = fromBase64Url(encoded);
  const payload = parsePayload(body);
  if (!payload) return null;
  const expected = await hmacHex(
    process.env.SESSION_SECRET,
    canonical(payload),
  );
  if (!timingSafeEqualHex(sig, expected)) return null;
  return payload.entryId;
}

export function getJobPostingCookieOptions(secure: boolean) {
  return {
    ...getSessionCookieOptions(secure),
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
