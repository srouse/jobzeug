import { NextRequest, NextResponse } from "next/server";

import {
  CONTENTFUL_OAUTH_COOKIE,
  CONTENTFUL_OAUTH_STATE_COOKIE,
  canAccessConfiguredSpace,
  contentfulOAuthConfig,
  contentfulSessionCookieOptions,
  contentfulStateCookieOptions,
  contentfulUserName,
  exchangeAuthorizationCode,
  sealContentfulSession,
} from "@/lib/contentful/oauth";

function fail(req: NextRequest, code: string) {
  const url = new URL("/contentful", req.url);
  url.searchParams.set("error", code);
  const res = NextResponse.redirect(url);
  res.cookies.set(CONTENTFUL_OAUTH_STATE_COOKIE, "", {
    ...contentfulStateCookieOptions(),
    maxAge: 0,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const config = contentfulOAuthConfig();
  if (!config) return fail(req, "config");

  const error = req.nextUrl.searchParams.get("error");
  if (error) return fail(req, "denied");

  const state = req.nextUrl.searchParams.get("state") ?? "";
  const expected = req.cookies.get(CONTENTFUL_OAUTH_STATE_COOKIE)?.value ?? "";
  if (!state || !expected || !safeEqual(state, expected)) return fail(req, "state");

  const code = req.nextUrl.searchParams.get("code") ?? "";
  if (!code) return fail(req, "token");

  try {
    const token = await exchangeAuthorizationCode(code, config);
    const [name, editor] = await Promise.all([
      contentfulUserName(token),
      canAccessConfiguredSpace(token, config),
    ]);
    const sealed = await sealContentfulSession({
      token,
      editor,
      name,
      spaceId: config.spaceId,
      environmentId: config.environmentId,
    });
    const res = NextResponse.redirect(new URL("/contentful", req.url));
    res.cookies.set(CONTENTFUL_OAUTH_COOKIE, sealed, contentfulSessionCookieOptions());
    res.cookies.set(CONTENTFUL_OAUTH_STATE_COOKIE, "", {
      ...contentfulStateCookieOptions(),
      maxAge: 0,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("user lookup") || message.includes("token exchange")) {
      return fail(req, "token");
    }
    return fail(req, "probe");
  }
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
