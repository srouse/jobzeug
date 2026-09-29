import { listJobPostings, type JobPostingListItem } from "@/lib/contentful/delivery";
import { loadJobPostingByEntryId } from "@/lib/job-posting/contentful";
import { loadMatchingCatalog } from "@/lib/matching/catalog";
import { bestDirectionalFits } from "@/lib/matching/home-coverage";
import { scorePostingAgainstCatalog } from "@/lib/matching/score";

export type JobListRow = JobPostingListItem & {
  projectFit: number | null;
  lineFit: number | null;
};

export async function loadJobList(): Promise<JobListRow[]> {
  const [postings, catalog] = await Promise.all([
    listJobPostings(),
    loadMatchingCatalog(),
  ]);
  const catalogProjectCount = catalog.projects.size;

  return Promise.all(
    postings.map(async (posting) => {
      try {
        const view = await loadJobPostingByEntryId(posting.entryId);
        if (!view) return { ...posting, projectFit: null, lineFit: null };
        const scored = scorePostingAgainstCatalog({ posting: view, catalog });
        const fits = bestDirectionalFits({
          projectScopedLineCount: view.lines.filter(
            (line) => line.matchingRequirement?.scope === "project",
          ).length,
          catalogProjectCount,
          lineCount: view.lines.length,
          projects: scored.projects,
        });
        return { ...posting, projectFit: fits.project, lineFit: fits.line };
      } catch {
        return { ...posting, projectFit: null, lineFit: null };
      }
    }),
  );
}
