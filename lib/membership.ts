export type Tier = "resident" | "prive" | "cercle_noir";

export interface TierInfo {
  id: Tier;
  name: string;
  audience: string;
  rank: number;
  priceLabel: string;
  features: string[];
}

export const TIERS: Record<Tier, TierInfo> = {
  resident: {
    id: "resident",
    name: "Résident",
    audience: "Orta kesim · İlk alıcı",
    rank: 0,
    priceLabel: "Ücretsiz",
    features: ["AI Concierge (temel)", "Lifestyle eşleşme", "Akıllı Finans modülü", "Ev Sağlık Raporu"],
  },
  prive: {
    id: "prive",
    name: "Privé",
    audience: "Yoğun profesyonel · Üst-orta",
    rank: 1,
    priceLabel: "€49 / ay",
    features: ["Private Market erişimi", "Property DNA raporları", "Mahremiyet & Sessizlik analizi", "First Access — 48 saat önce"],
  },
  cercle_noir: {
    id: "cercle_noir",
    name: "Cercle Noir",
    audience: "UHNW · Yatırımcı · Yönetici",
    rank: 2,
    priceLabel: "€500 / yıl · Davetiye",
    features: ["Gizli portföy · özel gösterim", "Invisible Buyer modu", "AI Negotiation Shield", "İnsan + AI kişisel concierge"],
  },
};

export const TIER_LIST: TierInfo[] = [TIERS.resident, TIERS.prive, TIERS.cercle_noir];

export function isTier(value: string): value is Tier {
  return value === "resident" || value === "prive" || value === "cercle_noir";
}

export function tierInfo(tier: string): TierInfo {
  return isTier(tier) ? TIERS[tier] : TIERS.resident;
}

/** Off-market / Private Collection requires Privé or above. */
export function canViewPrivate(tier: string | null | undefined): boolean {
  return !!tier && isTier(tier) && TIERS[tier].rank >= TIERS.prive.rank;
}
