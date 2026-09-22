import { z } from "zod";

const employerId = z.string().regex(/^C\d{3,}$/);
const roleId = z.string().regex(/^R\d{3,}$/);
const projectId = z.string().regex(/^S\d{3,}$/);

export const citeEvidenceSchema = z.object({
  employers: z.array(employerId).default([]),
  roles: z.array(roleId).default([]),
  projects: z.array(projectId).default([]),
});

export type CiteEvidencePayload = z.infer<typeof citeEvidenceSchema>;

export const emptyCitations: CiteEvidencePayload = {
  employers: [],
  roles: [],
  projects: [],
};
