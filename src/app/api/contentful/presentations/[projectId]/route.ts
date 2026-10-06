import { NextRequest, NextResponse } from "next/server";

import {
  CONTENTFUL_OAUTH_COOKIE,
  readContentfulAccess,
} from "@/lib/contentful/oauth";
import {
  PresentationWriteError,
  assertProjectId,
  parsePresentationText,
  parsePresentationVideo,
  savePresentation,
} from "@/lib/contentful/presentation-write";

export const maxDuration = 120;

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const access = await readContentfulAccess(req.cookies.get(CONTENTFUL_OAUTH_COOKIE)?.value);
  if (access.status !== "editor") {
    const status = access.status === "no-access" ? 403 : 401;
    const error =
      access.status === "no-access"
        ? "This space and environment are not available to that account."
        : "Contentful login expired. Open /contentful and sign in again.";
    return NextResponse.json({ error }, { status });
  }

  try {
    const { projectId: rawProjectId } = await context.params;
    const projectId = assertProjectId(rawProjectId);
    const contentType = req.headers.get("content-type") ?? "";
    let text = null;
    let video = null;
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      text = parsePresentationText({
        blurb: form.has("blurb") ? form.get("blurb") : undefined,
        metricOneValue: form.has("metricOneValue") ? form.get("metricOneValue") : undefined,
        metricOneLabel: form.has("metricOneLabel") ? form.get("metricOneLabel") : undefined,
        metricTwoValue: form.has("metricTwoValue") ? form.get("metricTwoValue") : undefined,
        metricTwoLabel: form.has("metricTwoLabel") ? form.get("metricTwoLabel") : undefined,
      });
      const file = form.get("video");
      video = await parsePresentationVideo(file instanceof File ? file : null);
    } else {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        throw new PresentationWriteError("Send the blurb and both metrics together.", 400);
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new PresentationWriteError("Send the blurb and both metrics together.", 400);
      }
      text = parsePresentationText(body);
    }
    await savePresentation({ token: access.token, projectId, text, video });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof PresentationWriteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not save the presentation." }, { status: 500 });
  }
}
