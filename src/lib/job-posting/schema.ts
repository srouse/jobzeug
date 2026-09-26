import { z } from "zod";
import {
  matchingRequirementSchema,
  matchingSnapshotSchema,
} from "../../../contentful/matching-schema.mjs";

const text = z.string().trim().min(1);
const short = text.max(256);

export const jobLineSectionSchema = z.enum([
  "description",
  "responsibility",
  "required",
  "preferred",
]);
export const jobLineKindSchema = z.enum([
  "duty",
  "years",
  "skill",
  "domain",
  "soft",
  "other",
]);
export const jobToolContextSchema = z.enum([
  "required",
  "preferred",
  "responsibility",
]);

export {
  matchingRequirementSchema,
  matchingSnapshotSchema,
};

export type MatchingRequirement = z.infer<typeof matchingRequirementSchema>;
export type MatchingSnapshot = z.infer<typeof matchingSnapshotSchema>;

/** Structured output from job-posting-structurer (no Contentful entry ids). */
export const structuredJobPostingSchema = z.object({
  company: short,
  title: short,
  location: short.optional(),
  employmentType: short.optional(),
  seniority: short.optional(),
  summary: text.optional(),
  yearsExperienceMin: z.number().int().nonnegative().optional(),
  yearsExperienceNote: short.optional(),
  travelNote: text.optional(),
  compensationNote: text.optional(),
  lines: z
    .array(
      z.object({
        text: text,
        section: jobLineSectionSchema,
        kind: jobLineKindSchema,
        theme: short,
      }),
    )
    .min(1)
    .max(40),
  tools: z
    .array(
      z.object({
        name: short,
        context: jobToolContextSchema,
      }),
    )
    .max(40)
    .default([]),
});

export type StructuredJobPosting = z.infer<typeof structuredJobPostingSchema>;

export type JobPostingView = {
  entryId: string;
  postingId: string;
  sourceUrl: string;
  company: string;
  title: string;
  location?: string;
  employmentType?: string;
  seniority?: string;
  summary?: string;
  yearsExperienceMin?: number;
  yearsExperienceNote?: string;
  travelNote?: string;
  compensationNote?: string;
  fullText: string;
  lines: Array<{
    entryId: string;
    text: string;
    section: z.infer<typeof jobLineSectionSchema>;
    kind: z.infer<typeof jobLineKindSchema>;
    theme: string;
    matchingRequirement?: MatchingRequirement;
  }>;
  tools: Array<{
    entryId: string;
    name: string;
    context: z.infer<typeof jobToolContextSchema>;
  }>;
  matchingSnapshot?: MatchingSnapshot;
};

/** Browser/API payload for the Job Posting panel (includes fullText for the Full tab). */
export type JobPostingPanelData = JobPostingView;

export function toJobPostingPanelData(view: JobPostingView): JobPostingPanelData {
  return view;
}

/** Slim posting for chat system context (no fullText). */
export const chatJobPostingPayloadSchema = z.object({
  entryId: z.string().min(1),
  postingId: z.string().min(1),
  sourceUrl: z.string().min(1),
  company: short,
  title: short,
  location: short.optional(),
  employmentType: short.optional(),
  seniority: short.optional(),
  summary: text.optional(),
  yearsExperienceMin: z.number().int().nonnegative().optional(),
  yearsExperienceNote: short.optional(),
  travelNote: text.optional(),
  compensationNote: text.optional(),
  lines: z
    .array(
      z.object({
        entryId: z.string().min(1),
        text: text,
        section: jobLineSectionSchema,
        kind: jobLineKindSchema,
        theme: short,
        matchingRequirement: matchingRequirementSchema.optional(),
      }),
    )
    .min(1)
    .max(40),
  tools: z
    .array(
      z.object({
        entryId: z.string().min(1),
        name: short,
        context: jobToolContextSchema,
      }),
    )
    .max(40)
    .default([]),
  matchingSnapshot: matchingSnapshotSchema.optional(),
});

export type ChatJobPostingPayload = z.infer<typeof chatJobPostingPayloadSchema>;

/** Strip fullText for chat hand-off; keep citeable line/tool fields. */
export function toChatJobPostingPayload(
  view: JobPostingView,
): ChatJobPostingPayload {
  const { fullText: _fullText, ...rest } = view;
  return chatJobPostingPayloadSchema.parse(rest);
}
