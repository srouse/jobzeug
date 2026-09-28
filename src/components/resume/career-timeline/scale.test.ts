import assert from "node:assert/strict";
import test from "node:test";
import { careerTimelineScale } from "./scale.ts";

const now = new Date(2026, 8, 28);

test("labels the latest and earliest years and the decades between them", () => {
  const scale = careerTimelineScale(
    [
      {
        roles: [
          {
            roleId: "R001",
            title: "Senior Product Architect",
            startDate: "2026-02-01",
          },
          {
            roleId: "R013",
            title: "Senior Interactive Systems Developer",
            startDate: "2006-04-01",
            endDate: "2011-09-30",
          },
          {
            roleId: "R018",
            title: "Flash/Flex Developer",
            startDate: "2008-01-01",
            endDate: "2009-12-31",
          },
          {
            roleId: "R022",
            title: "Web Developer/Designer",
            startDate: "2001-01-01",
            endDate: "2002-12-31",
          },
        ],
      },
    ],
    now,
  );

  assert.ok(scale);
  assert.deepEqual(
    scale.labels.map((label) => label.year),
    [2026, 2020, 2010, 2001],
  );
  assert.equal(scale.labels[0]?.edge, "top");
  assert.equal(scale.labels.at(-1)?.edge, "bottom");
  assert.ok(scale.labels.slice(1, -1).every((label) => label.edge === "middle"));

  const nested = scale.segments.find((segment) => segment.roleId === "R018");
  const outer = scale.segments.find((segment) => segment.roleId === "R013");
  assert.ok(nested && outer);
  assert.ok(nested.height < outer.height);
  assert.ok(nested.top > outer.top);
  assert.ok(nested.top + nested.height < outer.top + outer.height);

  const open = scale.segments.find((segment) => segment.roleId === "R001");
  assert.ok(open);
  assert.equal(open.tooltip, "Senior Product Architect, 2026");
  assert.ok(open.top < 0.05);
});

test("the top is the present even when every role has ended", () => {
  const scale = careerTimelineScale(
    [
      {
        roles: [
          {
            roleId: "done",
            title: "Done",
            startDate: "2010-01-01",
            endDate: "2018-06-01",
          },
        ],
      },
    ],
    now,
  );

  assert.ok(scale);
  assert.equal(scale.labels[0]?.year, 2026);
  assert.ok((scale.segments[0]?.top ?? 0) > 0.05);
});

test("drops a decade that would crowd an endpoint", () => {
  const scale = careerTimelineScale(
    [
      {
        roles: [
          {
            roleId: "early",
            title: "Early",
            startDate: "2001-01-01",
            endDate: "2002-06-01",
          },
          {
            roleId: "late",
            title: "Late",
            startDate: "2010-01-01",
            endDate: "2012-01-01",
          },
        ],
      },
    ],
    new Date(2012, 2, 1),
  );

  assert.ok(scale);
  assert.deepEqual(
    scale.labels.map((label) => label.year),
    [2012, 2001],
  );
});

test("marks every project inside the role that holds it", () => {
  const scale = careerTimelineScale(
    [
      {
        roles: [
          {
            roleId: "R001",
            title: "Senior Product Architect",
            startDate: "2024-01-01",
            endDate: "2026-01-01",
            projects: [
              { evidenceId: "S001", name: "Blueprints" },
              { evidenceId: "S009", name: "Quiet" },
              { evidenceId: "S002", name: "Widget" },
            ],
          },
        ],
      },
    ],
    now,
    [
      { id: "S001", strength: "primary" },
      { id: "line-1", strength: "secondary" },
      { id: "jz-S002", strength: "secondary" },
    ],
  );

  assert.ok(scale);
  assert.deepEqual(
    scale.marks.map((mark) => mark.name),
    ["Blueprints", "Quiet", "Widget"],
  );
  assert.deepEqual(
    scale.marks.map((mark) => mark.selected),
    ["primary", null, "secondary"],
  );
  assert.ok(scale.marks[0]!.offset < scale.marks[1]!.offset);
  const segment = scale.segments[0]!;
  for (const mark of scale.marks) {
    assert.ok(mark.offset > segment.top);
    assert.ok(mark.offset < segment.top + segment.height);
  }
});

test("returns nothing when no role has a usable range", () => {
  assert.equal(careerTimelineScale([]), null);
  assert.equal(
    careerTimelineScale([
      {
        roles: [
          {
            roleId: "bad",
            title: "Bad",
            startDate: "not-a-date",
            endDate: "2002-01-01",
          },
        ],
      },
    ]),
    null,
  );
});
