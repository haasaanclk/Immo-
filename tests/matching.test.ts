import { test } from "node:test";
import assert from "node:assert/strict";
import { rankForProfile } from "../lib/matching";
import { properties } from "../data/properties";

test("privacy-priority profile ranks the most private home first", () => {
  const profile = {
    tier: "Executive",
    traits: [{ label: "Mahremiyet ihtiyacı", value: 95 }],
    priorities: ["Mahremiyet", "Yatırım", "Mimari kalite"],
  };
  const ranked = rankForProfile(profile, properties);
  const top = ranked[0].property;
  const maxPrivacy = Math.max(...properties.map((p) => p.privacyLevel));
  assert.equal(top.privacyLevel, maxPrivacy, `top privacy ${top.privacyLevel} vs max ${maxPrivacy}`);
});

test("scores stay within the 60-99 display band and descend", () => {
  const profile = {
    tier: "Executive",
    traits: [{ label: "Yatırım odaklı", value: 90 }],
    priorities: ["Yatırım", "Mimari kalite"],
  };
  const ranked = rankForProfile(profile, properties);
  for (const m of ranked) {
    assert.ok(m.score >= 60 && m.score <= 99, `score ${m.score}`);
  }
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(ranked[i - 1].score >= ranked[i].score, "not descending");
  }
});

test("no profile falls back to prestige order", () => {
  const ranked = rankForProfile(null, properties);
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(
      ranked[i - 1].property.prestigeScore >= ranked[i].property.prestigeScore,
      "prestige order broken",
    );
  }
});

test("every match carries at least one reason", () => {
  const ranked = rankForProfile(
    { tier: "X", traits: [], priorities: ["Mahremiyet"] },
    properties,
  );
  for (const m of ranked) assert.ok(m.reasons.length >= 1);
});
