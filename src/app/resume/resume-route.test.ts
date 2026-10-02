import assert from "node:assert/strict";
import test from "node:test";
import {
  resumePath,
  resumeRouteFromPathname,
  resumeRouteFromSegments,
} from "./resume-route.ts";

test("home stops at the posting", () => {
  assert.deepEqual(resumeRouteFromPathname("/resume"), {
    entryId: null,
    focus: null,
    details: false,
  });
  assert.equal(resumePath(null, null), "/resume");
  assert.deepEqual(resumeRouteFromSegments(["posting-1"]), {
    entryId: "posting-1",
    focus: null,
    details: false,
  });
  assert.equal(resumePath("posting-1", null), "/resume/posting-1");
});

test("a project and a job line are separate paths and never both", () => {
  assert.deepEqual(
    resumeRouteFromPathname("/resume/posting-1/project/S009"),
    {
      entryId: "posting-1",
      focus: { kind: "project", id: "S009" },
      details: false,
    },
  );
  assert.equal(
    resumePath("posting-1", { kind: "project", id: "S009" }),
    "/resume/posting-1/project/S009",
  );
  assert.deepEqual(
    resumeRouteFromPathname("/resume/posting-1/job-line/line-2"),
    {
      entryId: "posting-1",
      focus: { kind: "jobLine", id: "line-2" },
      details: false,
    },
  );
  assert.equal(
    resumePath("posting-1", { kind: "jobLine", id: "line-2" }),
    "/resume/posting-1/job-line/line-2",
  );
});

test("a project can be focused with no posting", () => {
  assert.deepEqual(resumeRouteFromSegments(["project", "S009"]), {
    entryId: null,
    focus: { kind: "project", id: "S009" },
    details: false,
  });
  assert.equal(
    resumePath(null, { kind: "project", id: "S009" }),
    "/resume/project/S009",
  );
});

test("details is the last segment of a project path", () => {
  assert.deepEqual(
    resumeRouteFromPathname("/resume/posting-1/project/S009/details"),
    {
      entryId: "posting-1",
      focus: { kind: "project", id: "S009" },
      details: true,
    },
  );
  assert.equal(
    resumePath("posting-1", { kind: "project", id: "S009" }, true),
    "/resume/posting-1/project/S009/details",
  );
  assert.deepEqual(resumeRouteFromSegments(["project", "S009", "details"]), {
    entryId: null,
    focus: { kind: "project", id: "S009" },
    details: true,
  });
  assert.equal(
    resumePath(null, { kind: "project", id: "S009" }, true),
    "/resume/project/S009/details",
  );
  assert.equal(
    resumePath("posting-1", { kind: "jobLine", id: "line-2" }, true),
    "/resume/posting-1/job-line/line-2",
  );
  assert.deepEqual(
    resumeRouteFromPathname("/resume/posting-1/job-line/line-2/details"),
    {
      entryId: "posting-1",
      focus: { kind: "jobLine", id: "line-2" },
      details: false,
    },
  );
});

test("a job line is not written without a posting", () => {
  assert.equal(
    resumePath(null, { kind: "jobLine", id: "line-2" }),
    "/resume",
  );
});
