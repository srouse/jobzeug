import type { AnswerSection } from "@/lib/themed-answer";
import type { ResumeProject, ResumeViewModel } from "@/lib/contentful/resume-model";

export type CitedProjectCard = {
  projectId: string;
  sectionId: string;
  /** Theme caption — maps to project-card supertitle. */
  supertitle: string;
  name: string;
  description: string;
};

/** Project citations for one answer section, first-seen order, capped at `limit`. */
export function citedProjectsFromSection(
  section: AnswerSection,
  resume: ResumeViewModel | null | undefined,
  limit = 2,
): CitedProjectCard[] {
  const byId = indexResumeProjects(resume);
  const out: CitedProjectCard[] = [];
  const seen = new Set<string>();

  for (const projectId of section.citations.projects) {
    if (seen.has(projectId)) continue;
    seen.add(projectId);
    const project = byId.get(projectId);
    const name = project?.name?.trim() || projectId;
    const description =
      project?.summary?.trim() ||
      (section.markdown.trim()
        ? section.markdown.trim()
        : section.highlight.trim());
    out.push({
      projectId,
      sectionId: section.id,
      supertitle: section.title.trim() || "Project",
      name,
      description,
    });
    if (out.length >= limit) break;
  }

  return out;
}

/** First-seen project citations across answer sections, capped at `limit`. */
export function topCitedProjectsFromSections(
  sections: AnswerSection[],
  resume: ResumeViewModel | null | undefined,
  limit = 2,
): CitedProjectCard[] {
  const out: CitedProjectCard[] = [];
  const seen = new Set<string>();

  for (const section of sections) {
    for (const card of citedProjectsFromSection(section, resume, limit)) {
      if (seen.has(card.projectId)) continue;
      seen.add(card.projectId);
      out.push(card);
      if (out.length >= limit) return out;
    }
  }

  return out;
}

function indexResumeProjects(
  resume: ResumeViewModel | null | undefined,
): Map<string, ResumeProject> {
  const map = new Map<string, ResumeProject>();
  if (!resume) return map;
  for (const employer of resume.employers) {
    for (const role of employer.roles) {
      for (const project of role.projects) {
        map.set(project.evidenceId, project);
      }
    }
  }
  return map;
}
