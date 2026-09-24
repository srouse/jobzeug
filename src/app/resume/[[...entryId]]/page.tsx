import { ResumeWorkspace } from "../resume-workspace";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ entryId?: string[] }>;
}) {
  const { entryId: segments } = await params;
  // Extra path segments are ignored; only the first is the Contentful id.
  // Normalization happens inside the client workspace (this file is a Server Component).
  return <ResumeWorkspace initialEntryId={segments?.[0] ?? null} />;
}
