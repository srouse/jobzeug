import test from "node:test";
import assert from "node:assert/strict";
import { recencyWeight } from "../../src/lib/matching/recency.ts";

const asOfYear = 2026;

test("the last five years keep full weight", () => {
  assert.equal(recencyWeight(2026, asOfYear), 1);
  assert.equal(recencyWeight(2021, asOfYear), 1);
  assert.equal(recencyWeight(2030, asOfYear), 1);
});

test("weight is about 0.76 at ten years and half at thirteen", () => {
  const atTen = recencyWeight(2016, asOfYear);
  assert.ok(Math.abs(atTen - 0.763) < 0.01, String(atTen));
  assert.equal(recencyWeight(2013, asOfYear), 0.5);
});

test("a twenty-year-old project is down near a tenth", () => {
  const atTwenty = recencyWeight(2006, asOfYear);
  assert.ok(atTwenty < 0.1, String(atTwenty));
  assert.ok(atTwenty < recencyWeight(2016, asOfYear));
});

test("a missing year is not treated as ancient", () => {
  assert.equal(recencyWeight(null, asOfYear), 1);
  assert.equal(recencyWeight(undefined, asOfYear), 1);
});
