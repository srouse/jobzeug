import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";

import { NextRequest, NextResponse } from "next/server";

import { isKleioEnabled } from "@/lib/kleio/enabled";
import { kleioContentType, resolveKleioFile } from "@/lib/kleio/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isKleioEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  const relativePath = req.nextUrl.searchParams.get("path") ?? "";
  const archive = req.nextUrl.searchParams.get("root") === "work" ? "work" : "kleio";
  const abs = resolveKleioFile(relativePath, archive);
  if (!abs) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let size: number;
  try {
    const file = await stat(abs);
    if (!file.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    size = file.size;
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stream = createReadStream(abs);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": kleioContentType(abs),
      "Content-Length": String(size),
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
