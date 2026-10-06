import assert from "node:assert/strict";
import test from "node:test";
import { activeConnectionTarget } from "../../src/lib/connection-targets.ts";

const edges = [
  { projectId: "S001", lineEntryId: "jz-line-1", points: 40 },
  { projectId: "S002", lineEntryId: "jz-line-1", points: 30 },
  { projectId: "S003", lineEntryId: "jz-line-1", points: 20 },
  { projectId: "S004", lineEntryId: "jz-line-1", points: 18 },
  { projectId: "S005", lineEntryId: "jz-line-1", points: 12 },
  { projectId: "S001", lineEntryId: "jz-line-2", points: 50 },
  { projectId: "S001", lineEntryId: "jz-line-3", points: 44 },
  { projectId: "S001", lineEntryId: "jz-line-4", points: 28 },
  { projectId: "S001", lineEntryId: "jz-line-5", points: 22 },
  { projectId: "S001", lineEntryId: "jz-line-6", points: 10 },
];

test("a project open in the stage draws no lines", () => {
  assert.equal(
    activeConnectionTarget({ kind: "project", id: "S001" }, edges, ["S009"], true),
    null,
  );
});

test("a job-line focus keeps its four highest projects blue", () => {
  assert.deepEqual(
    activeConnectionTarget(
      { kind: "jobLine", id: "jz-line-1" },
      edges,
      ["S009"],
      true,
    ),
    {
      hub: "selection",
      ids: [
        { id: "jz-line-1", role: "subject", strength: "primary" },
        { id: "S001", role: "reference", strength: "primary" },
        { id: "S002", role: "reference", strength: "primary" },
        { id: "S003", role: "reference", strength: "primary" },
        { id: "S004", role: "reference", strength: "primary" },
        { id: "S005", role: "reference", strength: "secondary" },
      ],
    },
  );
});

test("a job-line focus ranks projects by age-adjusted points", () => {
  assert.deepEqual(
    activeConnectionTarget(
      { kind: "jobLine", id: "jz-line-1" },
      edges,
      [],
      true,
      { S001: 1990, S002: 2026, S003: 2025, S004: 2024, S005: 2023 },
    ),
    {
      hub: "selection",
      ids: [
        { id: "jz-line-1", role: "subject", strength: "primary" },
        { id: "S001", role: "reference", strength: "secondary" },
        { id: "S002", role: "reference", strength: "primary" },
        { id: "S003", role: "reference", strength: "primary" },
        { id: "S004", role: "reference", strength: "primary" },
        { id: "S005", role: "reference", strength: "primary" },
      ],
    },
  );
});

test("an AI result is the only driver, and it meets the answer card", () => {
  assert.deepEqual(
    activeConnectionTarget({ kind: "answer" }, edges, ["S003", "jz-line-2"], true),
    {
      hub: "answer",
      ids: [
        { id: "S003", role: "reference", strength: "primary" },
        { id: "jz-line-2", role: "reference", strength: "primary" },
      ],
    },
  );
});

test("hiding answer bindings draws nothing while an AI result is focused", () => {
  assert.equal(
    activeConnectionTarget({ kind: "answer" }, edges, ["S001"], false),
    null,
  );
});

test("a focus draws at most ten lines and drops the lowest scores", () => {
  const many = [
    { projectId: "S-low", lineEntryId: "jz-line-1", points: 1 },
    ...Array.from({ length: 10 }, (_, index) => ({
      projectId: `S-mid-${index + 1}`,
      lineEntryId: "jz-line-1",
      points: 20 + index,
    })),
    { projectId: "S-high", lineEntryId: "jz-line-1", points: 90 },
  ];
  const target = activeConnectionTarget(
    { kind: "jobLine", id: "jz-line-1" },
    many,
    [],
    true,
  );
  assert.equal(target.ids.length, 10);
  assert.equal(target.ids[0].role, "subject");
  assert.equal(
    target.ids.some((endpoint) => endpoint.id === "S-high"),
    true,
  );
  assert.equal(
    target.ids.some((endpoint) => endpoint.id === "S-low"),
    false,
  );
  assert.equal(
    target.ids.some((endpoint) => endpoint.id === "S-mid-1"),
    false,
  );
});

test("an AI result stops after ten citations", () => {
  const citations = Array.from({ length: 12 }, (_, index) => `S${index + 1}`);
  const target = activeConnectionTarget(
    { kind: "answer" },
    [],
    citations,
    true,
  );
  assert.equal(target.ids.length, 10);
  assert.equal(target.ids.at(-1).id, "S10");
});

test("a posting with no saved edges still connects the clicked row", () => {
  assert.deepEqual(
    activeConnectionTarget(
      { kind: "jobLine", id: "jz-line-9" },
      [],
      [],
      true,
    ),
    {
      hub: "selection",
      ids: [{ id: "jz-line-9", role: "subject", strength: "primary" }],
    },
  );
});
