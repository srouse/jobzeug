import assert from "node:assert/strict";
import test from "node:test";
import {
  resumePath,
  resumeRouteFromPathname,
  resumeRouteFromSegments,
} from "./resume-route.ts";

test("home and a posting id are the only paths", () => {
  assert.deepEqual(resumeRouteFromPathname("/resume-2"), { entryId: null });
  assert.equal(resumePath(null), "/resume-2");
  assert.deepEqual(resumeRouteFromSegments(["posting-1"]), {
    entryId: "posting-1",
  });
  assert.equal(resumePath("posting-1"), "/resume-2/posting-1");
  assert.deepEqual(resumeRouteFromPathname("/resume-2/posting-1"), {
    entryId: "posting-1",
  });
});

test("extra segments and other routes do not become a posting id", () => {
  assert.deepEqual(resumeRouteFromPathname("/resume"), { entryId: null });
  assert.deepEqual(resumeRouteFromPathname("/resume-2/posting-1/project/S009"), {
    entryId: "posting-1",
  });
  assert.equal(resumePath("not an id"), "/resume-2");
});
