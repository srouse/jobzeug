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

test("a project focus keeps its four highest job lines blue", () => {
  assert.deepEqual(
    activeConnectionTarget({ kind: "project", id: "S001" }, edges, ["S009"], true),
    {
      hub: "selection",
      ids: [
        { id: "S001", strength: "primary" },
        { id: "jz-line-1", strength: "primary" },
        { id: "jz-line-2", strength: "primary" },
        { id: "jz-line-3", strength: "primary" },
        { id: "jz-line-4", strength: "primary" },
        { id: "jz-line-5", strength: "secondary" },
        { id: "jz-line-6", strength: "secondary" },
      ],
    },
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
        { id: "jz-line-1", strength: "primary" },
        { id: "S001", strength: "primary" },
        { id: "S002", strength: "primary" },
        { id: "S003", strength: "primary" },
        { id: "S004", strength: "primary" },
        { id: "S005", strength: "secondary" },
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
        { id: "S003", strength: "primary" },
        { id: "jz-line-2", strength: "primary" },
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

test("a posting with no saved edges still connects the clicked row", () => {
  assert.deepEqual(
    activeConnectionTarget(
      { kind: "jobLine", id: "jz-line-9" },
      [],
      [],
      true,
    ),
    { hub: "selection", ids: [{ id: "jz-line-9", strength: "primary" }] },
  );
});
