import { test } from "node:test";
import assert from "node:assert/strict";
import { canViewPrivate, isTier, tierInfo, TIERS } from "../lib/membership";

test("private access requires Privé or above", () => {
  assert.equal(canViewPrivate("resident"), false);
  assert.equal(canViewPrivate("prive"), true);
  assert.equal(canViewPrivate("cercle_noir"), true);
  assert.equal(canViewPrivate(null), false);
  assert.equal(canViewPrivate(undefined), false);
  assert.equal(canViewPrivate("bogus"), false);
});

test("tier ranks are strictly increasing", () => {
  assert.ok(TIERS.resident.rank < TIERS.prive.rank);
  assert.ok(TIERS.prive.rank < TIERS.cercle_noir.rank);
});

test("isTier guards unknown values; tierInfo falls back to resident", () => {
  assert.equal(isTier("prive"), true);
  assert.equal(isTier("nope"), false);
  assert.equal(tierInfo("nope").id, "resident");
  assert.equal(tierInfo("cercle_noir").id, "cercle_noir");
});
