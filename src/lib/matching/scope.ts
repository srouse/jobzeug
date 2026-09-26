/** Candidate-only heuristic shared by ingest gate and score-time prepare. */
export const CANDIDATE_ONLY_PATTERN =
  /\b(years?\s+of\s+experience|\d+\+?\s+years|bachelor|master'?s|ph\.?d|degree required|must be (located|based)|work authorization|security clearance|equal opportunity|visa|salary range|compensation)\b/i;

export function looksLikeCandidateOnlyText(text: string): boolean {
  return CANDIDATE_ONLY_PATTERN.test(text);
}

export const PROJECTISH_SECTIONS = new Set([
  "responsibility",
  "required",
  "preferred",
  "description",
]);
