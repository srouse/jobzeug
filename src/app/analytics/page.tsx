import type { Metadata } from "next";

import { AnalyticsNotice, AnalyticsView } from "./analytics-view";
import {
  jobPostingEntryIdSchema,
  loadAnalytics,
  type AnalyticsPageData,
} from "./load";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    jobPostingEntryId?: string;
    projectId?: string;
    lineEntryId?: string;
  }>;
}) {
  const params = await searchParams;
  const parsed = jobPostingEntryIdSchema.safeParse(params.jobPostingEntryId ?? "");
  if (!parsed.success) {
    return (
      <AnalyticsNotice
        title="Missing jobPostingEntryId"
        detail="Pass ?jobPostingEntryId=."
      />
    );
  }

  let data: AnalyticsPageData | null = null;
  let errorMessage: string | null = null;
  try {
    data = await loadAnalytics({
      jobPostingEntryId: parsed.data,
      projectId: params.projectId,
      lineEntryId: params.lineEntryId,
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Failed to render analytics";
  }

  if (errorMessage) {
    return <AnalyticsNotice title="Error" detail={errorMessage} />;
  }
  if (!data) {
    return <AnalyticsNotice title="Not found" detail="Job posting not found." />;
  }
  return <AnalyticsView data={data} />;
}
