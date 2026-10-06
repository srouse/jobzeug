import type { Metadata } from "next";
import { cookies } from "next/headers";

import { CONTENTFUL_OAUTH_COOKIE, contentfulEditorEnabled } from "@/lib/contentful/oauth";

import { resumeRouteFromSegments } from "../resume-route";
import { ResumeWorkspace } from "../workspace";

export const metadata: Metadata = {
  title: "Resume 2",
};

export default async function Resume2Page({
  params,
}: {
  params: Promise<{ entryId?: string[] }>;
}) {
  const { entryId: segments } = await params;
  const route = resumeRouteFromSegments(segments);
  const jar = await cookies();
  const canEdit = await contentfulEditorEnabled(jar.get(CONTENTFUL_OAUTH_COOKIE)?.value);
  return (
    <ResumeWorkspace
      initialEntryId={route.entryId}
      initialLineId={route.lineId}
      initialProjectId={route.projectId}
      canEdit={canEdit}
    />
  );
}
