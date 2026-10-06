import type { Metadata } from "next";

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
  return (
    <ResumeWorkspace
      initialEntryId={route.entryId}
      initialLineId={route.lineId}
      initialProjectId={route.projectId}
    />
  );
}
