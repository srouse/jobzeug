import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  hasAuthEnv,
  isValidSessionCookie,
} from "@/lib/site-auth";

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    if (
      pathname === "/login" &&
      hasAuthEnv() &&
      (await isValidSessionCookie(req.cookies.get(SESSION_COOKIE)?.value))
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!hasAuthEnv()) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "SITE_PASSWORD and SESSION_SECRET must be configured" },
        { status: 503 },
      );
    }
    const login = req.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    login.searchParams.set("error", "config");
    return NextResponse.redirect(login);
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSessionCookie(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = req.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
