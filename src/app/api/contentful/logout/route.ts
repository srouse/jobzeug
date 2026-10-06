import { NextRequest, NextResponse } from "next/server";

import {
  CONTENTFUL_OAUTH_COOKIE,
  contentfulSessionCookieOptions,
} from "@/lib/contentful/oauth";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/contentful", req.url), 303);
  res.cookies.set(CONTENTFUL_OAUTH_COOKIE, "", {
    ...contentfulSessionCookieOptions(),
    maxAge: 0,
  });
  return res;
}
