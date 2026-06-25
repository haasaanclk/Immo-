export type LifestyleMode = "family" | "executive" | "investor";

export interface PropertyDNA {
  architecture: number; // 0-10
  materials: number;
  location: number;
  privacy: number;
  energy: string; // letter grade
  investment: number;
}

export const CATEGORIES = ["Villa", "Penthouse", "Residence", "Estate", "Waterfront"] as const;
export type PropertyKind = (typeof CATEGORIES)[number];

export interface Property {
  id: string;
  name: string;
  district: string;
  city: string;
  kind: PropertyKind; // tipoloji / kategori
  year: number; // yapım / restorasyon yılı
  price: number; // EUR
  match: number; // lifestyle match %
  prestigeScore: number;
  offMarket: boolean;
  reasons: string[];
  dna: PropertyDNA;
  privacyLevel: number; // /10
  silence: { day: number; night: number }; // dB
  checkup: { electrical: string; roof: string; humidity: string; energy: string };
  hue: number; // base hue for generative estate art
}

export const properties: Property[] = [
  {
    id: "villa-solitude",
    name: "Villa Solitude",
    district: "Zürichberg",
    city: "Zürich",
    kind: "Villa",
    year: 2019,
    price: 12400000,
    match: 97,
    prestigeScore: 94,
    offMarket: true,
    reasons: ["Deniz manzarası", "Düşük gürültü", "Bölge gelişiyor", "Mimari uyum"],
    dna: {
      architecture: 9.2,
      materials: 8.8,
      location: 9.5,
      privacy: 9.7,
      energy: "A+",
      investment: 8.9,
    },
    privacyLevel: 9.4,
    silence: { day: 32, night: 24 },
    checkup: { electrical: "A", roof: "B+", humidity: "A", energy: "A+" },
    hue: 158,
  },
  {
    id: "penthouse-noir",
    name: "Penthouse Noir",
    district: "Lehel",
    city: "München",
    kind: "Penthouse",
    year: 2021,
    price: 6800000,
    match: 93,
    prestigeScore: 91,
    offMarket: false,
    reasons: ["Panoramik şehir", "Concierge kat", "Yatırım değeri", "Minimal mimari"],
    dna: {
      architecture: 9.0,
      materials: 9.1,
      location: 9.3,
      privacy: 8.6,
      energy: "A",
      investment: 9.2,
    },
    privacyLevel: 8.6,
    silence: { day: 41, night: 30 },
    checkup: { electrical: "A", roof: "A", humidity: "A", energy: "A" },
    hue: 200,
  },
  {
    id: "residence-eaux",
    name: "Residence Eaux",
    district: "Genève Rive",
    city: "Genève",
    kind: "Residence",
    year: 2016,
    price: 9200000,
    match: 90,
    prestigeScore: 89,
    offMarket: true,
    reasons: ["Göl cephesi", "Özel iskele", "Sessiz mahalle", "Klasik karakter"],
    dna: {
      architecture: 8.8,
      materials: 8.9,
      location: 9.4,
      privacy: 9.2,
      energy: "A",
      investment: 8.7,
    },
    privacyLevel: 9.1,
    silence: { day: 35, night: 26 },
    checkup: { electrical: "B+", roof: "A", humidity: "A", energy: "A" },
    hue: 178,
  },
  {
    id: "schloss-eichen",
    name: "Schloss Eichen",
    district: "Hietzing",
    city: "Wien",
    kind: "Estate",
    year: 1911,
    price: 15500000,
    match: 92,
    prestigeScore: 96,
    offMarket: true,
    reasons: ["Tarihi malikâne", "Özel park", "Restore edilmiş", "Mutlak mahremiyet"],
    dna: {
      architecture: 9.6,
      materials: 9.3,
      location: 9.1,
      privacy: 9.8,
      energy: "B+",
      investment: 8.6,
    },
    privacyLevel: 9.8,
    silence: { day: 28, night: 21 },
    checkup: { electrical: "B+", roof: "A", humidity: "B+", energy: "B+" },
    hue: 150,
  },
  {
    id: "marina-vista",
    name: "Marina Vista",
    district: "Palm Jumeirah",
    city: "Dubai",
    kind: "Waterfront",
    year: 2023,
    price: 5400000,
    match: 88,
    prestigeScore: 90,
    offMarket: false,
    reasons: ["Özel sahil", "Marina cephesi", "Akıllı ev", "Yüksek kira getirisi"],
    dna: {
      architecture: 8.7,
      materials: 9.0,
      location: 9.2,
      privacy: 8.4,
      energy: "A",
      investment: 9.5,
    },
    privacyLevel: 8.4,
    silence: { day: 44, night: 33 },
    checkup: { electrical: "A", roof: "A", humidity: "A", energy: "A" },
    hue: 196,
  },
  {
    id: "maison-lumiere",
    name: "Maison Lumière",
    district: "Bogenhausen",
    city: "München",
    kind: "Villa",
    year: 2020,
    price: 4900000,
    match: 91,
    prestigeScore: 92,
    offMarket: false,
    reasons: ["Güneşli bahçe", "Aile dostu", "Sessiz sokak", "Mimari ödüllü"],
    dna: {
      architecture: 9.3,
      materials: 9.0,
      location: 8.9,
      privacy: 9.0,
      energy: "A+",
      investment: 8.5,
    },
    privacyLevel: 9.0,
    silence: { day: 33, night: 25 },
    checkup: { electrical: "A", roof: "A", humidity: "A", energy: "A+" },
    hue: 168,
  },
  {
    id: "belgravia-set",
    name: "The Belgravia Set",
    district: "Belgravia",
    city: "London",
    kind: "Residence",
    year: 1855,
    price: 18500000,
    match: 89,
    prestigeScore: 95,
    offMarket: true,
    reasons: ["Stüko cephe", "Özel meydan", "Köklü adres", "Nadir bulunur"],
    dna: {
      architecture: 9.4,
      materials: 9.1,
      location: 9.7,
      privacy: 9.0,
      energy: "B",
      investment: 9.1,
    },
    privacyLevel: 9.0,
    silence: { day: 38, night: 28 },
    checkup: { electrical: "B", roof: "B+", humidity: "B+", energy: "B" },
    hue: 186,
  },
  {
    id: "lakeside-atelier",
    name: "Lakeside Atelier",
    district: "Küsnacht",
    city: "Zürich",
    kind: "Waterfront",
    year: 2022,
    price: 8700000,
    match: 90,
    prestigeScore: 91,
    offMarket: false,
    reasons: ["Göl kıyısı", "Cam mimari", "Özel iskele", "Sıfır komşu görüşü"],
    dna: {
      architecture: 9.1,
      materials: 9.2,
      location: 9.3,
      privacy: 9.3,
      energy: "A+",
      investment: 8.8,
    },
    privacyLevel: 9.3,
    silence: { day: 30, night: 22 },
    checkup: { electrical: "A", roof: "A", humidity: "A", energy: "A+" },
    hue: 174,
  },
];

export const lifestyleProfile = {
  name: "Hasan",
  tier: "Executive",
  matchToTop: 94,
  traits: [
    { label: "Modern şehir yaşamı", value: 87 },
    { label: "Sessiz yaşam", value: 74 },
    { label: "Yatırım odaklı", value: 91 },
    { label: "Mahremiyet ihtiyacı", value: 95 },
  ],
  priorities: ["Mahremiyet", "Mimari kalite", "Yatırım", "Ulaşım"],
};

/** Compact catalog string the AI concierge reasons over. */
export function propertyCatalogForPrompt(): string {
  return properties
    .map(
      (p) =>
        `- id: ${p.id} | ${p.name}, ${p.district} (${p.city}) | ` +
        `mimari ${p.dna.architecture}, malzeme ${p.dna.materials}, lokasyon ${p.dna.location}, ` +
        `mahremiyet ${p.dna.privacy}, enerji ${p.dna.energy}, yatırım ${p.dna.investment} | ` +
        `prestij ${p.prestigeScore}, sessizlik gündüz ${p.silence.day}dB / gece ${p.silence.night}dB | ` +
        `${p.offMarket ? "off-market" : "halka açık"} | öne çıkanlar: ${p.reasons.join(", ")}`,
    )
    .join("\n");
}

export interface ConciergeQuestion {
  q: string;
  options: { value: string; chip: string }[];
}

export const conciergeFlow: ConciergeQuestion[] = [
  {
    q: "Sabah kahvenizi nerede içmeyi seversiniz?",
    options: [
      { value: "Sessiz bir bahçede", chip: "Sessiz bahçe" },
      { value: "Şehrin merkezinde", chip: "Şehir merkezi" },
      { value: "Manzaraya karşı", chip: "Manzaraya karşı" },
    ],
  },
  {
    q: "Evde misafir ağırlıyor musunuz?",
    options: [
      { value: "Sık sık", chip: "Sık misafir" },
      { value: "Nadiren", chip: "Mahrem yaşam" },
      { value: "Sadece yakın çevre", chip: "Seçili çevre" },
    ],
  },
  {
    q: "Şehrin sesi sizi rahatsız eder mi?",
    options: [
      { value: "Çok, sessizlik şart", chip: "Sessizlik" },
      { value: "Biraz", chip: "Dengeli" },
      { value: "Hayır, canlılık severim", chip: "Merkez" },
    ],
  },
  {
    q: "Tasarım tarzınız?",
    options: [
      { value: "Minimal", chip: "Minimal" },
      { value: "Klasik", chip: "Klasik" },
      { value: "Japandi / sıcak", chip: "Japandi" },
    ],
  },
  {
    q: "Bu ev sizin için yaşam mı, yatırım mı?",
    options: [
      { value: "Çoğunlukla yaşam", chip: "Yaşam" },
      { value: "İkisi de", chip: "Denge" },
      { value: "Yatırım önceliğim", chip: "Yatırım" },
    ],
  },
];

export interface InteriorStyle {
  id: string;
  name: string;
  description: string;
  palette: { wall: string; floor: string; accent: string; textile: string };
  cost: string;
  valueImpact: string;
}

export const interiorStyles: InteriorStyle[] = [
  {
    id: "japandi",
    name: "Japandi",
    description: "Sıcak minimalizm — doğal ahşap, kil tonları, sakin ışık.",
    palette: { wall: "#E7E0D2", floor: "#C9A86A", accent: "#6F5B43", textile: "#A8A293" },
    cost: "~80.000 €",
    valueImpact: "+%3",
  },
  {
    id: "old-money",
    name: "Old Money",
    description: "Şişe yeşili, pirinç detay, koyu meşe — köklü ve sessiz prestij.",
    palette: { wall: "#23362B", floor: "#3A2A1E", accent: "#B08D57", textile: "#1E3A2F" },
    cost: "~140.000 €",
    valueImpact: "+%5",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Saf beyaz, gizli depolama, tek bir mimari jest.",
    palette: { wall: "#F4F1EA", floor: "#D8D2C5", accent: "#1C1B19", textile: "#EBE5D8" },
    cost: "~55.000 €",
    valueImpact: "+%2",
  },
];
