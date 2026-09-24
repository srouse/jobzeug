import { z } from "zod";

import {
  citeEvidenceSchema,
  emptyCitations,
  type CiteEvidencePayload,
  type EvidenceCluster,
} from "@/lib/evidence-citations";

/** One accordion section in a themed answer. */
export type AnswerSection = {
  id: string;
  title: string;
  markdown: string;
  citations: CiteEvidencePayload;
};

export const answerSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  markdown: z.string().default(""),
  citations: citeEvidenceSchema,
});

/** Outline agent structured output. */
export const themeOutlineSchema = z.object({
  themes: z
    .array(
      z.object({
        id: z
          .string()
          .min(1)
          .describe("Stable kebab slug for the section, unique within the answer"),
        title: z
          .string()
          .min(1)
          .describe("Short accordion header / bold lead-in"),
        citations: citeEvidenceSchema,
        facts: z
          .array(z.string().min(1))
          .min(1)
          .max(6)
          .describe("Short evidence-backed bullets the writer may use"),
      }),
    )
    .min(1)
    .max(3),
});

export type ThemeOutline = z.infer<typeof themeOutlineSchema>;

/** Writer agent structured output. */
export const themeWriterSchema = z.object({
  themeId: z.string().min(1),
  markdown: z
    .string()
    .min(1)
    .describe("2–3 sentences in third person; no raw evidence IDs"),
});

export type ThemeWriterResult = z.infer<typeof themeWriterSchema>;

/** Dedupe and merge citation bags into one turn-level payload. */
export function unionCitations(
  parts: CiteEvidencePayload[],
): CiteEvidencePayload {
  if (!parts.length) return { ...emptyCitations };
  const employers = new Set<string>();
  const roles = new Set<string>();
  const projects = new Set<string>();
  const jobLines = new Set<string>();
  for (const part of parts) {
    for (const id of part.employers) employers.add(id);
    for (const id of part.roles) roles.add(id);
    for (const id of part.projects) projects.add(id);
    for (const id of part.jobLines) jobLines.add(id);
  }
  return {
    employers: [...employers],
    roles: [...roles],
    projects: [...projects],
    jobLines: [...jobLines],
  };
}

export function sectionsToAnswerMarkdown(sections: AnswerSection[]): string {
  return sections
    .map((section) => {
      const body = section.markdown.trim();
      if (!body) return `**${section.title}.**`;
      if (body.startsWith("**")) return body;
      return `**${section.title}.** ${body}`;
    })
    .join("\n\n")
    .trim();
}

export function clusterWithSections(
  cluster: Omit<EvidenceCluster, "citations" | "answerMarkdown"> & {
    sections: AnswerSection[];
    citations?: CiteEvidencePayload;
    answerMarkdown?: string;
  },
): EvidenceCluster {
  const citations =
    cluster.citations ??
    unionCitations(cluster.sections.map((section) => section.citations));
  const answerMarkdown =
    cluster.answerMarkdown?.trim() ||
    sectionsToAnswerMarkdown(cluster.sections);
  return {
    ...cluster,
    citations,
    answerMarkdown,
    sections: cluster.sections,
  };
}
