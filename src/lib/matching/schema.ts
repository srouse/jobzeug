import { z } from "zod";
import {
  matchingRequirementConstraintsSchema,
  matchingRequirementSchema,
  matchingSnapshotSchema,
} from "../../../scripts/contentful/matching/requirement-schema.mjs";

export {
  matchingRequirementConstraintsSchema,
  matchingRequirementSchema,
  matchingSnapshotSchema,
};

export type MatchingRequirement = z.infer<typeof matchingRequirementSchema>;
export type MatchingSnapshot = z.infer<typeof matchingSnapshotSchema>;
