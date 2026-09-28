import test from "node:test";
import assert from "node:assert/strict";
import {
  coveragePercent,
  lineFitBars,
  postingHitsResume,
  projectFitBars,
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

test("resume hits posting treats every project at 70% as perfect", () => {
  const coverage = resumeHitsPosting(lines, projects, [
    { projectId: "S001", lineEntryId: "line-1", points: 10 },
    { projectId: "S008", lineEntryId: "line-1", points: 22 },
    { projectId: "S001", lineEntryId: "line-2", points: 10 },
  ]);
  assert.ok(Math.abs(coverage.score - 7.2) < 1e-10);
  assert.ok(Math.abs(coverage.ceiling - 12.6) < 1e-10);
  assert.equal(coveragePercent(coverage), 57);
});

test("candidate lines and lines without a requirement stay out of the posting ceiling", () => {
  const coverage = resumeHitsPosting(lines, projects, [
    { projectId: "S001", lineEntryId: "line-degree", points: 10 },
  ]);
  assert.equal(coverage.score, 0);
  assert.ok(Math.abs(coverage.ceiling - 12.6) < 1e-10);
});

test("posting hits resume treats every line at 70% as perfect", () => {
  const coverage = postingHitsResume(projects, lines, [
    { projectId: "S001", lineEntryId: "line-1", points: 10 },
    { projectId: "S001", lineEntryId: "line-2", points: 12 },
    { projectId: "S008", lineEntryId: "line-1", points: 10 },
  ]);
  assert.ok(Math.abs(coverage.score - 6.2) < 1e-10);
  assert.ok(Math.abs(coverage.ceiling - 12.6) < 1e-10);
  assert.equal(coveragePercent(coverage), 49);
});

test("top projects rank a wider equal-tag match above a shorter deeper one", () => {
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
    ["S002", "S006"],
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
    ["S001", "S008", "S026"],
  );
  assert.equal(top[0]?.points, 22);
  assert.equal(top[1]?.name, "Contentful for Figma widget");
  assert.equal(top.find((project) => project.projectId === "S099")?.name, undefined);
});

test("fit bars render the absolute share and color by third", () => {
  const lineCount = 5;
  const ceiling = lineCount * 2;
  const bars = projectFitBars(
    ["A", "B", "D", "C"],
    [
      { projectId: "A", lineEntryId: "l1", points: 100 },
      { projectId: "B", lineEntryId: "l1", points: 10 },
      { projectId: "B", lineEntryId: "l2", points: 10 },
      { projectId: "B", lineEntryId: "l3", points: 10 },
      { projectId: "B", lineEntryId: "l4", points: 10 },
      { projectId: "D", lineEntryId: "l1", points: 10 },
    ],
    lineCount,
  );
  assert.equal(bars.get("A")?.rows, 1);
  assert.equal(bars.get("A")?.tags, 10);
  assert.equal(bars.get("A")?.width, 1);
  assert.equal(bars.get("A")?.percent, 110);
  assert.equal(bars.get("A")?.tone, "great");
  assert.equal(bars.get("B")?.rows, 4);
  assert.equal(bars.get("B")?.tags, 4);
  assert.equal(bars.get("B")?.width, 0.8);
  assert.equal(bars.get("B")?.percent, 80);
  assert.equal(bars.get("B")?.tone, "great");
  assert.equal(bars.get("D")?.width, 2 / ceiling);
  assert.equal(bars.get("D")?.tone, "ok");
  assert.equal(bars.get("C")?.width, 0);
  assert.equal(bars.get("C")?.percent, 0);
  assert.equal(bars.get("C")?.tone, null);
});

test("fit bars keep a project's own share when a stronger project is off the resume", () => {
  const bars = projectFitBars(
    ["S001"],
    [
      { projectId: "S006", lineEntryId: "l1", points: 15 },
      { projectId: "S006", lineEntryId: "l2", points: 15 },
      { projectId: "S006", lineEntryId: "l3", points: 15 },
      { projectId: "S006", lineEntryId: "l4", points: 15 },
      { projectId: "S006", lineEntryId: "l5", points: 15 },
      { projectId: "S006", lineEntryId: "l6", points: 15 },
      { projectId: "S001", lineEntryId: "l1", points: 16 },
      { projectId: "S001", lineEntryId: "l2", points: 16 },
      { projectId: "S001", lineEntryId: "l3", points: 16 },
      { projectId: "S001", lineEntryId: "l4", points: 16 },
      { projectId: "S001", lineEntryId: "l5", points: 16 },
    ],
    6,
  );
  assert.equal(bars.get("S001")?.width, 1);
  assert.equal(bars.get("S001")?.tone, "great");
});

test("job line fit bars use the resume project ceiling and ignore outside projects", () => {
  const projectIds = ["A", "B", "C", "D", "E"];
  const bars = lineFitBars(
    ["l1", "l2"],
    [
      { projectId: "A", lineEntryId: "l1", points: 100 },
      { projectId: "B", lineEntryId: "l2", points: 10 },
      { projectId: "C", lineEntryId: "l2", points: 10 },
      { projectId: "D", lineEntryId: "l2", points: 10 },
      { projectId: "E", lineEntryId: "l2", points: 10 },
      { projectId: "Z", lineEntryId: "l2", points: 100 },
    ],
    projectIds,
  );
  assert.equal(bars.get("l1")?.width, 1);
  assert.equal(bars.get("l1")?.tone, "great");
  assert.equal(bars.get("l2")?.rows, 4);
  assert.equal(bars.get("l2")?.tags, 4);
  assert.equal(bars.get("l2")?.width, 0.8);
  assert.equal(bars.get("l2")?.tone, "great");
});
