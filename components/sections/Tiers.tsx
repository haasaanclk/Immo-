import { SectionHead } from "@/components/ui/primitives";

const tiers = [
  {
    name: "Résident",
    audience: "Orta kesim · İlk alıcı",
    features: ["AI Concierge (temel)", "Lifestyle eşleşme", "Akıllı Finans modülü", "Ev Sağlık Raporu"],
    price: "Ücretsiz / düşük abonelik",
    feature: false,
  },
  {
    name: "Privé",
    audience: "Yoğun profesyonel · Üst-orta",
    features: ["Private Market erişimi", "Property DNA raporları", "Mahremiyet & Sessizlik analizi", "First Access — 48 saat önce"],
    price: "Aylık premium abonelik",
    feature: true,
  },
  {
    name: "Cercle Noir",
    audience: "UHNW · Yatırımcı · Yönetici",
    features: ["Gizli portföy · özel gösterim", "Invisible Buyer modu", "AI Negotiation Shield", "İnsan + AI kişisel concierge"],
    price: "Davetiye + yıllık üyelik",
    feature: false,
  },
];

export function Tiers() {
  return (
    <section id="membership" className="bg-forest-deep py-24">
      <div className="mx-auto max-w-wrap px-7">
        <SectionHead eyebrow="Membership" title="Tek uygulama, üç kapı" light>
          Orta kesim güven ve doğru karar satın alır. Zengin segment zaman,
          mahremiyet ve özel erişim satın alır. Aynı motor — iki ayrı vaat.
        </SectionHead>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-lg border p-[34px] ${
                t.feature
                  ? "border-brass bg-gradient-to-b from-brass/10 to-brass/[0.02]"
                  : "border-brass/30 bg-white/[0.02]"
              }`}
            >
              <div className="font-serif text-[30px] tracking-[0.06em] text-ivory">{t.name}</div>
              <div className="mb-[22px] mt-1.5 font-label text-[10.5px] uppercase tracking-[0.2em] text-brass">
                {t.audience}
              </div>
              <ul>
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 border-t border-white/[0.07] py-2.5 text-[16px] text-ivory/80"
                  >
                    <span className="text-brass">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-[22px] font-label text-[11px] uppercase tracking-[0.18em] text-ivory/50">
                {t.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const swatches: [string, string, string][] = [
  ["#F4F1EA", "#54534c", "Ivory"],
  ["#EBE5D8", "#54534c", "Parchment"],
  ["#1E3A2F", "#EDE7DA", "Forest"],
  ["#14241C", "#EDE7DA", "Forest Deep"],
  ["#B08D57", "#1C1B19", "Brass"],
  ["#5E2B2B", "#EDE7DA", "Burgundy"],
];

export function Palette() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-wrap px-7">
        <SectionHead eyebrow="Design Language" title="Old money fısıldar">
          New money parlar. Lüks, altının azlığındadır — boşlukta, sessiz
          renklerde ve serif tipografinin köklü duruşunda.
        </SectionHead>
        <div className="flex flex-wrap overflow-hidden rounded-lg border border-ink/10">
          {swatches.map(([bg, fg, name]) => (
            <div
              key={name}
              className="flex h-[130px] flex-1 basis-1/3 items-end p-3 font-label text-[9.5px] uppercase tracking-[0.12em] md:basis-0"
              style={{ background: bg, color: fg }}
            >
              {name}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center font-serif text-[23px] text-forest">
          <em className="italic">Cormorant Garamond</em> · EB Garamond ·{" "}
          <span className="font-label text-[13px] uppercase tracking-[0.2em] text-ink">
            Jost
          </span>
        </div>
      </div>
    </section>
  );
}

const featureStrip = [
  {
    n: "i.",
    title: "AI Interior Designer",
    body: "3D ev içinde tarz değiştir. Mobilya, ışık, renk — ve maliyeti: ~80.000 €, ev değerine +%3.",
  },
  {
    n: "ii.",
    title: "Akıllı Finans",
    body: "“Bu ev bütçenize uygun mu?” Kredi, aylık yük, bakım ve enerji gideri — tek bakışta.",
  },
  {
    n: "iii.",
    title: "Dijital Ev Pasaportu",
    body: "Her mülkün doğrulanmış, taşınabilir kimliği: DNA, geçmiş, mahremiyet ve sağlık tek belgede.",
  },
];

export function FeatureStrip() {
  return (
    <section className="pb-10">
      <div className="mx-auto max-w-wrap px-7">
        <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
          {featureStrip.map((f) => (
            <div key={f.title} className="bg-ivory p-[42px]">
              <div className="font-serif text-[15px] text-brass">{f.n}</div>
              <h3 className="my-3 font-serif text-[27px] leading-tight text-forest-deep">
                {f.title}
              </h3>
              <p className="text-[16.5px] text-ink/65">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
