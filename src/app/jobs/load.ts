import { contentfulEditorUrl } from "@/lib/contentful/editor-url";
import { listJobPostings, type JobPostingListItem } from "@/lib/contentful/delivery";
import { loadPublishedJobPostings } from "@/lib/job-posting/published";
import { loadMatchingCatalog } from "@/lib/matching/catalog";
import { scorePostingAgainstCatalog } from "@/lib/matching/score";

export type JobListRow = JobPostingListItem & {
  /** Age-adjusted point total. Same number as the analytics Total. */
  total: number | null;
  contentfulUrl?: string;
};

export async function loadJobList(): Promise<JobListRow[]> {
  const [postings, catalog] = await Promise.all([
    listJobPostings(),
    loadMatchingCatalog(),
  ]);

  const views = await loadPublishedJobPostings(postings.map((posting) => posting.entryId));
  return Promise.all(
    postings.map(async (posting) => {
      const contentfulUrl = contentfulEditorUrl(posting.entryId);
      try {
        const view = views.get(posting.entryId);
        if (!view) return { ...posting, total: null, contentfulUrl };
        const scored = scorePostingAgainstCatalog({ posting: view, catalog });
        return { ...posting, total: scored.ageAdjustedTotal, contentfulUrl };
      } catch {
        return { ...posting, total: null, contentfulUrl };
      }
    }),
  );
}
