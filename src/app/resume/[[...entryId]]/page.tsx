import { resumeRouteFromSegments } from "../resume-route";
import { ResumeWorkspace } from "../resume-workspace";

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
      initialProjectId={route.projectId}
    />
  );
}
