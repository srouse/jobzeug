import { z } from "zod";
import {
  matchGraphSchema,
  matchingRequirementConstraintsSchema,
  matchingRequirementSchema,
  matchingSnapshotSchema,
} from "../../../scripts/contentful/matching/requirement-schema.mjs";

export {
  matchGraphSchema,
  matchingRequirementConstraintsSchema,
  matchingRequirementSchema,
  matchingSnapshotSchema,
};

export type MatchGraph = z.infer<typeof matchGraphSchema>;
export type MatchingRequirement = z.infer<typeof matchingRequirementSchema>;
export type MatchingSnapshot = z.infer<typeof matchingSnapshotSchema>;
