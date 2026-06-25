/** Deterministic, human-readable passport serial for a property id. */
export function passportSerial(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  const base = h.toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return `DP-${base.slice(0, 3)}-${base.slice(3, 6)}`;
}

/** Overall quality index (0-100) from a property's DNA + prestige. */
export function qualityIndex(dna: {
  architecture: number;
  materials: number;
  location: number;
  privacy: number;
  investment: number;
}, prestige: number): number {
  const dnaAvg =
    (dna.architecture + dna.materials + dna.location + dna.privacy + dna.investment) / 5;
  return Math.round((dnaAvg * 10 + prestige) / 2);
}
