import type { Property } from "@/data/properties";
import type { PropertyRow } from "@/db/schema";

/** Map a DB row back to the rich Property shape the view components use. */
export function rowToProperty(row: PropertyRow): Property {
  const dna = row.dna as Record<string, number | string>;
  const checkup = row.checkup as Record<string, string>;
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    city: row.city,
    kind: row.kind as Property["kind"],
    year: row.year,
    price: row.price,
    match: row.match,
    prestigeScore: row.prestigeScore,
    offMarket: row.offMarket,
    reasons: row.reasons as string[],
    dna: {
      architecture: Number(dna.architecture),
      materials: Number(dna.materials),
      location: Number(dna.location),
      privacy: Number(dna.privacy),
      energy: String(dna.energy),
      investment: Number(dna.investment),
    },
    privacyLevel: row.privacyLevel,
    silence: { day: row.silenceDay, night: row.silenceNight },
    checkup: {
      electrical: checkup.electrical,
      roof: checkup.roof,
      humidity: checkup.humidity,
      energy: checkup.energy,
    },
    hue: row.hue,
  };
}
