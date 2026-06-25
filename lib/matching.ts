import type { Property } from "@/data/properties";
import type { LifestyleProfile } from "@/db/schema";

/**
 * Deterministic, instant personalization: score every property against the
 * user's lifestyle profile (priorities + trait weights). No API call — this is
 * the live ranking that powers the dashboard "Sizin için seçildi" section.
 */

type AttrKey = "privacy" | "investment" | "architecture" | "location" | "quiet" | "prestige";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function attributes(p: Property): Record<AttrKey, number> {
  return {
    privacy: p.privacyLevel / 10,
    investment: p.dna.investment / 10,
    architecture: p.dna.architecture / 10,
    location: p.dna.location / 10,
    quiet: clamp01(1 - (p.silence.night - 20) / 30),
    prestige: p.prestigeScore / 100,
  };
}

const ATTR_LABEL: Record<AttrKey, string> = {
  privacy: "Mahremiyet",
  investment: "Yatırım potansiyeli",
  architecture: "Mimari kalite",
  location: "Lokasyon",
  quiet: "Sessizlik",
  prestige: "Prestij",
};

// Map a profile keyword to the attributes it values.
function keywordToAttrs(text: string): AttrKey[] {
  const t = text.toLowerCase();
  const out: AttrKey[] = [];
  if (t.includes("mahrem")) out.push("privacy", "quiet");
  if (t.includes("yatırım") || t.includes("yatirim")) out.push("investment", "prestige");
  if (t.includes("mimari")) out.push("architecture");
  if (t.includes("sessiz")) out.push("quiet");
  if (t.includes("ulaşım") || t.includes("merkez") || t.includes("şehir")) out.push("location");
  if (t.includes("prestij") || t.includes("kalite")) out.push("prestige", "architecture");
  return out;
}

function weights(profile: LifestyleProfile): Record<AttrKey, number> {
  const w: Record<AttrKey, number> = {
    privacy: 0.5,
    investment: 0.5,
    architecture: 0.5,
    location: 0.5,
    quiet: 0.5,
    prestige: 0.5,
  };
  // Ranked priorities: first carries the most weight.
  (profile.priorities ?? []).forEach((pr, i) => {
    const boost = Math.max(1, 4 - i);
    for (const a of keywordToAttrs(pr)) w[a] += boost;
  });
  // Trait percentages add finer weight.
  (profile.traits ?? []).forEach((tr) => {
    for (const a of keywordToAttrs(tr.label)) w[a] += tr.value / 50;
  });
  return w;
}

export interface RankedMatch {
  property: Property;
  score: number; // 0-100
  reasons: string[];
}

export function rankForProfile(
  profile: LifestyleProfile | null,
  props: Property[],
): RankedMatch[] {
  if (!profile) {
    // No profile yet — fall back to prestige order with the property's own reasons.
    return props
      .slice()
      .sort((a, b) => b.prestigeScore - a.prestigeScore)
      .map((p) => ({ property: p, score: p.match, reasons: p.reasons.slice(0, 3) }));
  }

  const w = weights(profile);
  const totalW = Object.values(w).reduce((s, x) => s + x, 0);

  return props
    .map((p) => {
      const attrs = attributes(p);
      let acc = 0;
      (Object.keys(attrs) as AttrKey[]).forEach((k) => {
        acc += attrs[k] * w[k];
      });
      const norm = acc / totalW; // 0-1
      const score = Math.round(60 + norm * 39); // 60-99

      // Reasons: the property's strongest attributes that the user actually values.
      const valued = (Object.keys(attrs) as AttrKey[])
        .filter((k) => w[k] > 0.8)
        .sort((a, b) => attrs[b] - attrs[a]);
      const reasons: string[] = [];
      for (const k of valued.slice(0, 2)) {
        if (k === "quiet") reasons.push(`Gece ${p.silence.night} dB — sessizlik önceliğinizle örtüşüyor`);
        else if (k === "privacy") reasons.push(`Mahremiyet ${p.privacyLevel}/10`);
        else if (k === "prestige") reasons.push(`Prestij ${p.prestigeScore}`);
        else reasons.push(`${ATTR_LABEL[k]} ${attrs[k] >= 0.9 ? "üst seviye" : "güçlü"}`);
      }
      // Round out with one of the property's editorial reasons.
      if (p.reasons[0]) reasons.push(p.reasons[0]);

      return { property: p, score, reasons: reasons.slice(0, 3) };
    })
    .sort((a, b) => b.score - a.score);
}
