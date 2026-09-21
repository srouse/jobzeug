import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  createSessionValue,
  getSessionCookieOptions,
  hasAuthEnv,
  passwordsMatch,
  safeNextPath,
} from "@/lib/site-auth";

export async function POST(req: NextRequest) {
  if (!hasAuthEnv()) {
    return NextResponse.json(
      { error: "SITE_PASSWORD and SESSION_SECRET must be configured" },
      { status: 503 },
    );
  }

  const contentType = req.headers.get("content-type") || "";
  let password = "";
  let nextPath = "/";

  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { password?: string; next?: string };
    password = body.password ?? "";
    nextPath = safeNextPath(body.next);
  } else {
    const form = await req.formData();
    password = String(form.get("password") ?? "");
    nextPath = safeNextPath(String(form.get("next") ?? "/"));
  }

  const expected = process.env.SITE_PASSWORD!;
  if (!passwordsMatch(password, expected)) {
    const login = new URL("/login", req.url);
    login.searchParams.set("error", "1");
    if (nextPath !== "/") {
      login.searchParams.set("next", nextPath);
    }
    return NextResponse.redirect(login, 303);
  }

  const res = NextResponse.redirect(new URL(nextPath, req.url), 303);
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(
    SESSION_COOKIE,
    await createSessionValue(),
    getSessionCookieOptions(secure),
  );
  return res;
}
