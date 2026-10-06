import { NextRequest, NextResponse } from "next/server";

import {
  CONTENTFUL_OAUTH_STATE_COOKIE,
  authorizeUrl,
  contentfulOAuthConfig,
  contentfulStateCookieOptions,
} from "@/lib/contentful/oauth";

export async function GET(req: NextRequest) {
  const config = contentfulOAuthConfig();
  if (!config) {
    return NextResponse.redirect(new URL("/contentful?error=config", req.url));
  }
  const state = crypto.randomUUID();
  const res = NextResponse.redirect(authorizeUrl(config.clientId, config.redirectUri, state));
  res.cookies.set(CONTENTFUL_OAUTH_STATE_COOKIE, state, contentfulStateCookieOptions());
  return res;
}
