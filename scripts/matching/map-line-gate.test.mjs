import test from "node:test";
import assert from "node:assert/strict";
import {
  forceProjectScopeIfCraft,
  planSoftRematch,
  shouldSoftRematch,
} from "../../src/lib/job-posting/map-line-gate.ts";

function req(partial = {}) {
  return {
    id: "line-1",
    source_text: "Build dashboards and interaction design systems",
    source_location: "required / design",
    normalized_statement: "Build dashboards and interaction design systems",
    scope: "candidate",
    priority: "core",
    priority_basis: { kind: "inferred", rationale: "test" },
    weight: 3,
    concept_ids: [],
    constraints: {
      ownership: [],
      scope: [],
      delivery_stage: [],
      tool_concept_ids: [],
      note: null,
    },
    mapping_status: "unmapped",
    ...partial,
  };
}

test("forceProjectScopeIfCraft flips craft candidate lines in projectish sections", () => {
  const out = forceProjectScopeIfCraft(req(), {
    section: "required",
    text: "Build dashboards and interaction design systems",
  });
  assert.equal(out.scope, "project");
});

test("forceProjectScopeIfCraft leaves true candidate lines alone", () => {
  const out = forceProjectScopeIfCraft(
    req({
      source_text: "5+ years of experience required",
      normalized_statement: "5+ years of experience required",
      scope: "candidate",
    }),
    {
      section: "required",
      text: "5+ years of experience required",
    },
  );
  assert.equal(out.scope, "candidate");
});

test("planSoftRematch queues rematch for empty project craft lines and never throws", () => {
  const planned = planSoftRematch(req(), {
    section: "required",
    text: "Build dashboards and interaction design systems",
  });
  assert.equal(planned.requirement.scope, "project");
  assert.equal(planned.rematch, true);
  assert.equal(shouldSoftRematch(planned.requirement), true);
});

test("planSoftRematch does not rematch tagged project lines", () => {
  const planned = planSoftRematch(
    req({
      scope: "project",
      concept_ids: ["local:prototyping"],
      mapping_status: "proposed",
    }),
    { section: "required", text: "Prototype UX flows" },
  );
  assert.equal(planned.rematch, false);
});

test("planSoftRematch does not rematch empty candidate lines", () => {
  const planned = planSoftRematch(
    req({
      source_text: "Bachelor's degree required",
      normalized_statement: "Bachelor's degree required",
      scope: "candidate",
      concept_ids: [],
    }),
    { section: "required", text: "Bachelor's degree required" },
  );
  assert.equal(planned.requirement.scope, "candidate");
  assert.equal(planned.rematch, false);
});
