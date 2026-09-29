import type { Metadata } from "next";

import { JobsList } from "./jobs-list";
import { loadJobList } from "./load";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job postings",
};

export default async function JobsPage() {
  const postings = await loadJobList();
  return <JobsList postings={postings} />;
}
