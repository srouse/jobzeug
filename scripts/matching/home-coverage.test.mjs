import test from "node:test";
import assert from "node:assert/strict";
import {
  coveragePercent,
  postingHitsResume,
  resumeHitsPosting,
  topHomeProjects,
} from "../../src/lib/matching/home-coverage.ts";

const lines = [
  { entryId: "line-1", matchingRequirement: { scope: "project" } },
  { entryId: "line-2", matchingRequirement: { scope: "project" } },
  { entryId: "line-3", matchingRequirement: { scope: "project" } },
  { entryId: "line-degree", matchingRequirement: { scope: "candidate" } },
  { entryId: "line-unmapped" },
];

const projects = [
  { id: "S001", name: "Blueprints" },
  { id: "S008", name: "Contentful for Figma widget" },
  { id: "S026", name: "Summit page builder" },
];

test("resume hits posting scores 1 for one project and 2 for more", () => {
  const coverage = resumeHitsPosting(lines, [
    { projectId: "S001", lineEntryId: "line-1", points: 10 },
    { projectId: "S008", lineEntryId: "line-1", points: 22 },
    { projectId: "S001", lineEntryId: "line-2", points: 10 },
  ]);
  assert.equal(coverage.score, 3);
  assert.equal(coverage.ceiling, 6);
  assert.equal(coveragePercent(coverage), 50);
});

test("candidate lines and lines without a requirement stay out of the posting ceiling", () => {
  const coverage = resumeHitsPosting(lines, [
    { projectId: "S001", lineEntryId: "line-degree", points: 10 },
  ]);
  assert.equal(coverage.score, 0);
  assert.equal(coverage.ceiling, 6);
});

test("posting hits resume scores each project by how many lines reach it", () => {
  const coverage = postingHitsResume(projects, [
    { projectId: "S001", lineEntryId: "line-1", points: 10 },
    { projectId: "S001", lineEntryId: "line-2", points: 12 },
    { projectId: "S008", lineEntryId: "line-1", points: 10 },
  ]);
  assert.equal(coverage.score, 3);
  assert.equal(coverage.ceiling, 6);
});

test("top projects rank a deeper match above an equal point total with more thin lines", () => {
  const wide = Array.from({ length: 9 }, (_, index) => ({
    projectId: "S002",
    lineEntryId: `wide-${index}`,
    points: 10,
  }));
  const deep = Array.from({ length: 6 }, (_, index) => ({
    projectId: "S006",
    lineEntryId: `deep-${index}`,
    points: 15,
  }));
  const top = topHomeProjects(
    [
      { id: "S002", name: "Bulk Editor" },
      { id: "S006", name: "State Farm Figma" },
    ],
    [...wide, ...deep],
  );
  assert.deepEqual(
    top.map((project) => project.projectId),
    ["S006", "S002"],
  );
});

test("top projects sum stored points and keep the highest three", () => {
  const top = topHomeProjects(projects, [
    { projectId: "S001", lineEntryId: "line-1", points: 10 },
    { projectId: "S001", lineEntryId: "line-2", points: 12 },
    { projectId: "S008", lineEntryId: "line-1", points: 30 },
    { projectId: "S026", lineEntryId: "line-3", points: 8 },
    { projectId: "S099", lineEntryId: "line-3", points: 4 },
  ]);
  assert.deepEqual(
    top.map((project) => project.projectId),
    ["S008", "S001", "S026"],
  );
  assert.equal(top[1]?.points, 22);
  assert.equal(top[0]?.name, "Contentful for Figma widget");
  assert.equal(top.find((project) => project.projectId === "S099")?.name, undefined);
});
