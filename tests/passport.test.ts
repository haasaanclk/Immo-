import { test } from "node:test";
import assert from "node:assert/strict";
import { passportSerial, qualityIndex } from "../lib/passport";

test("serial is deterministic and well-formed", () => {
  const a = passportSerial("villa-solitude");
  const b = passportSerial("villa-solitude");
  assert.equal(a, b);
  assert.match(a, /^DP-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
});

test("different ids yield different serials", () => {
  assert.notEqual(passportSerial("villa-solitude"), passportSerial("penthouse-noir"));
});

test("quality index is a 0-100 integer", () => {
  const q = qualityIndex(
    { architecture: 9.2, materials: 8.8, location: 9.5, privacy: 9.7, investment: 8.9 },
    94,
  );
  assert.ok(Number.isInteger(q));
  assert.ok(q >= 0 && q <= 100);
  assert.ok(q > 80, `expected a strong score, got ${q}`);
});
