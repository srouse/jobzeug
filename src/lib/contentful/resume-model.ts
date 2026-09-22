import policy from "../../../contentful/evidence-policy.json";
import type { CoreCatalog } from "./delivery";
import { fetchCoreCatalog } from "./delivery";

export type ResumeProject = {
  evidenceId: string;
  name: string;
};

export type ResumeRole = {
  roleId: string;
  title: string;
  dateLabel: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights: string[];
  projects: ResumeProject[];
};

export type ResumeEmployerGroup = {
  evidenceId: string;
  name: string;
  descriptor?: string;
  roles: ResumeRole[];
};

export type ResumeViewModel = {
  name: string;
  employers: ResumeEmployerGroup[];
};

function excludedComponentRoles(selectedRoleIds: Set<string>) {
  const excluded = new Set<string>();
  for (const [aggregate, components] of Object.entries(policy.roleAggregates)) {
    if (selectedRoleIds.has(aggregate)) {
      for (const component of components) excluded.add(component);
    }
  }
  return excluded;
}

export function assembleResume(catalog: CoreCatalog): ResumeViewModel {
  const selectedRoleIds = new Set(
    [...catalog.roles.values()]
      .filter((role) => role.showOnResume)
      .map((role) => role.evidenceId),
  );
  const excluded = excludedComponentRoles(selectedRoleIds);
  const roles = [...catalog.roles.values()]
    .filter((role) => role.showOnResume && !excluded.has(role.evidenceId))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  const byEmployer = new Map<string, ResumeEmployerGroup>();
  for (const role of roles) {
    const employer = catalog.employers.get(role.employerId);
    if (!employer) {
      throw new Error(`Missing employer ${role.employerId} for role ${role.evidenceId}`);
    }
    const projects = [...catalog.projects.values()]
      .filter(
        (project) =>
          project.showOnResume && project.roleIds.includes(role.evidenceId),
      )
      .map((project) => ({ evidenceId: project.evidenceId, name: project.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    let group = byEmployer.get(employer.evidenceId);
    if (!group) {
      group = {
        evidenceId: employer.evidenceId,
        name: employer.name,
        descriptor: employer.descriptor,
        roles: [],
      };
      byEmployer.set(employer.evidenceId, group);
    }
    group.roles.push({
      roleId: role.evidenceId,
      title: role.title,
      dateLabel: role.dateLabel,
      startDate: role.startDate,
      endDate: role.endDate,
      summary: role.summary,
      highlights: role.highlights ?? [],
      projects,
    });
  }

  const employers = [...byEmployer.values()].sort((a, b) => {
    const aStart = a.roles[0]?.startDate ?? "";
    const bStart = b.roles[0]?.startDate ?? "";
    return bStart.localeCompare(aStart);
  });

  return { name: "Scott Rouse", employers };
}

export async function loadResumeViewModel(): Promise<ResumeViewModel> {
  return assembleResume(await fetchCoreCatalog());
}
