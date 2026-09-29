import { NextRequest, NextResponse } from "next/server";

/** Old match-concepts URL. Bookmarks keep their query on /analytics. */
export function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/analytics";
  return NextResponse.redirect(url);
}
