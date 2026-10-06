export const CONTENTFUL_OAUTH_COOKIE = "jobzeug_contentful";
export const CONTENTFUL_OAUTH_STATE_COOKIE = "jobzeug_contentful_state";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const STATE_MAX_AGE_SECONDS = 60 * 10;

export type ContentfulOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  spaceId: string;
  environmentId: string;
  locale: string;
};

type StoredSession = {
  v: 1;
  token: string;
  editor: boolean;
  name: string;
  spaceId: string;
  environmentId: string;
};

export type ContentfulAccess =
  | { status: "anonymous" }
  | { status: "no-access"; name: string }
  | { status: "editor"; name: string; token: string };

export function contentfulOAuthConfig(): ContentfulOAuthConfig | null {
  const clientId = process.env.CONTENTFUL_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.CONTENTFUL_OAUTH_CLIENT_SECRET?.trim();
  const redirectUri = process.env.CONTENTFUL_OAUTH_REDIRECT_URI?.trim();
  const spaceId = process.env.CONTENTFUL_SPACE_ID?.trim();
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT?.trim();
  if (
    !clientId ||
    !clientSecret ||
    !redirectUri ||
    !spaceId ||
    !environmentId ||
    !process.env.SESSION_SECRET
  ) {
    return null;
  }
  return {
    clientId,
    clientSecret,
    redirectUri,
    spaceId,
    environmentId,
    locale: process.env.CONTENTFUL_LOCALE?.trim() || "en-US",
  };
}

export function contentfulCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function contentfulSessionCookieOptions() {
  return contentfulCookieOptions(SESSION_MAX_AGE_SECONDS);
}

export function contentfulStateCookieOptions() {
  return contentfulCookieOptions(STATE_MAX_AGE_SECONDS);
}

export function authorizeUrl(clientId: string, redirectUri: string, state: string): string {
  const url = new URL("https://be.contentful.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "content_management_manage");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeAuthorizationCode(
  code: string,
  config: ContentfulOAuthConfig,
): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  });
  const response = await fetch("https://be.contentful.com/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`Contentful token exchange failed (${response.status})`);
  }
  const payload = (await response.json()) as { access_token?: unknown };
  if (typeof payload.access_token !== "string" || !payload.access_token) {
    throw new Error("Contentful token exchange returned no access token");
  }
  return payload.access_token;
}

export async function contentfulUserName(token: string): Promise<string> {
  const response = await fetch("https://api.contentful.com/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Contentful user lookup failed (${response.status})`);
  }
  const user = (await response.json()) as {
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
  };
  const name = [user.firstName, user.lastName]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ");
  if (name) return name;
  if (typeof user.email === "string" && user.email.trim()) return user.email.trim();
  return "Contentful user";
}

/** True only when this token can open the configured space and environment. */
export async function canAccessConfiguredSpace(
  token: string,
  config: ContentfulOAuthConfig,
): Promise<boolean> {
  const headers = { Authorization: `Bearer ${token}` };
  const space = await fetch(`https://api.contentful.com/spaces/${config.spaceId}`, { headers });
  if (space.status === 404 || space.status === 403) return false;
  if (!space.ok) {
    throw new Error(`Contentful space lookup failed (${space.status})`);
  }
  const environment = await fetch(
    `https://api.contentful.com/spaces/${config.spaceId}/environments/${config.environmentId}`,
    { headers },
  );
  if (environment.status === 404 || environment.status === 403) return false;
  if (!environment.ok) {
    throw new Error(`Contentful environment lookup failed (${environment.status})`);
  }
  return true;
}

export async function sealContentfulSession(session: Omit<StoredSession, "v">): Promise<string> {
  return encryptPayload({ v: 1, ...session });
}

export async function readContentfulAccess(
  value: string | undefined,
): Promise<ContentfulAccess> {
  if (!value) return { status: "anonymous" };
  const stored = await decryptPayload(value);
  if (!stored?.token || !stored.name) return { status: "anonymous" };
  const config = contentfulOAuthConfig();
  const sameTarget =
    config != null &&
    stored.spaceId === config.spaceId &&
    stored.environmentId === config.environmentId;
  if (stored.editor && sameTarget) {
    return { status: "editor", name: stored.name, token: stored.token };
  }
  return { status: "no-access", name: stored.name };
}

export async function contentfulEditorEnabled(value: string | undefined): Promise<boolean> {
  const access = await readContentfulAccess(value);
  return access.status === "editor";
}

async function encryptPayload(payload: StoredSession): Promise<string> {
  const key = await aesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(cipher))}`;
}

async function decryptPayload(value: string): Promise<StoredSession | null> {
  const [ivPart, cipherPart] = value.split(".");
  if (!ivPart || !cipherPart) return null;
  try {
    const key = await aesKey();
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64Url(ivPart) },
      key,
      fromBase64Url(cipherPart),
    );
    const data = JSON.parse(new TextDecoder().decode(plain)) as StoredSession;
    if (data?.v !== 1 || typeof data.token !== "string" || typeof data.name !== "string") {
      return null;
    }
    if (typeof data.editor !== "boolean") return null;
    if (typeof data.spaceId !== "string" || typeof data.environmentId !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

async function aesKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not defined");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
