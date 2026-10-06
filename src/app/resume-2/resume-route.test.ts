import assert from "node:assert/strict";
import test from "node:test";
import {
  resumePath,
  resumeRouteFromPathname,
  resumeRouteFromSegments,
} from "./resume-route.ts";

const empty = { entryId: null, lineId: null, projectId: null };

test("home and a posting id", () => {
  assert.deepEqual(resumeRouteFromPathname("/resume-2"), empty);
  assert.equal(resumePath(null), "/resume-2");
  assert.deepEqual(resumeRouteFromSegments(["posting-1"]), {
    entryId: "posting-1",
    lineId: null,
    projectId: null,
  });
  assert.equal(resumePath("posting-1"), "/resume-2/posting-1");
  assert.deepEqual(resumeRouteFromPathname("/resume-2/posting-1"), {
    entryId: "posting-1",
    lineId: null,
    projectId: null,
  });
});

test("a job line and a project can share the posting path", () => {
  assert.deepEqual(
    resumeRouteFromPathname("/resume-2/posting-1/job-line/line-2"),
    { entryId: "posting-1", lineId: "line-2", projectId: null },
  );
  assert.equal(
    resumePath("posting-1", "line-2"),
    "/resume-2/posting-1/job-line/line-2",
  );
  assert.deepEqual(
    resumeRouteFromPathname("/resume-2/posting-1/project/S009"),
    { entryId: "posting-1", lineId: null, projectId: "S009" },
  );
  assert.equal(
    resumePath("posting-1", null, "S009"),
    "/resume-2/posting-1/project/S009",
  );
  assert.deepEqual(
    resumeRouteFromPathname(
      "/resume-2/posting-1/job-line/line-2/project/S009",
    ),
    { entryId: "posting-1", lineId: "line-2", projectId: "S009" },
  );
  assert.equal(
    resumePath("posting-1", "line-2", "S009"),
    "/resume-2/posting-1/job-line/line-2/project/S009",
  );
});

test("other routes and bad ids stay empty", () => {
  assert.deepEqual(resumeRouteFromPathname("/resume"), empty);
  assert.equal(resumePath("not an id"), "/resume-2");
  assert.equal(resumePath("posting-1", "not an id", "also bad"), "/resume-2/posting-1");
});
