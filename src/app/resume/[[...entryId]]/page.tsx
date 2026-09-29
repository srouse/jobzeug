import type { Metadata } from "next";

import { resumeRouteFromSegments } from "../resume-route";
import { ResumeWorkspace } from "../resume-workspace";

export const metadata: Metadata = {
  title: "Resume",
};

export default async function ResumePage({
  params,
}: {
  params: Promise<{ entryId?: string[] }>;
}) {
  const { entryId: segments } = await params;
  const route = resumeRouteFromSegments(segments);
  return (
    <ResumeWorkspace
      initialEntryId={route.entryId}
      initialFocus={route.focus}
    />
  );
}
