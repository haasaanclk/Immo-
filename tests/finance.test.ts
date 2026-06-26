import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFinance } from "../lib/finance";

test("mortgage matches the amortization formula", () => {
  const r = computeFinance({ price: 1_000_000, downPct: 20, term: 20, rate: 4, energy: "A", investment: 8 });
  assert.equal(r.down, 200_000);
  assert.equal(r.loan, 800_000);
  // 800k @ 4%/20y ≈ 4847.9/mo
  assert.ok(Math.abs(r.mortgage - 4847.9) < 1, `mortgage ${r.mortgage}`);
});

test("zero interest splits the loan evenly", () => {
  const r = computeFinance({ price: 1_200_000, downPct: 0, term: 10, rate: 0, energy: "A", investment: 8 });
  assert.equal(Math.round(r.mortgage), Math.round(1_200_000 / 120));
});

test("total monthly is the sum of its parts", () => {
  const r = computeFinance({ price: 6_800_000, downPct: 30, term: 20, rate: 4, energy: "A", investment: 9.2 });
  const sum = r.mortgage + r.maintenance + r.energyCost + r.fees;
  assert.ok(Math.abs(r.totalMonthly - sum) < 1e-6);
});

test("growth scales with investment DNA; projection compounds", () => {
  const low = computeFinance({ price: 1_000_000, downPct: 30, term: 20, rate: 4, energy: "A", investment: 8 });
  const high = computeFinance({ price: 1_000_000, downPct: 30, term: 20, rate: 4, energy: "A", investment: 9.5 });
  assert.ok(high.growth > low.growth);
  assert.ok(low.growth >= 0.015 && high.growth <= 0.035);
  assert.ok(Math.abs(low.value10 - 1_000_000 * Math.pow(1 + low.growth, 10)) < 1e-6);
  assert.ok(low.gain > 0);
});

test("better energy grade lowers running cost", () => {
  const aPlus = computeFinance({ price: 5_000_000, downPct: 30, term: 20, rate: 4, energy: "A+", investment: 8 });
  const c = computeFinance({ price: 5_000_000, downPct: 30, term: 20, rate: 4, energy: "C", investment: 8 });
  assert.ok(aPlus.energyCost < c.energyCost);
});
