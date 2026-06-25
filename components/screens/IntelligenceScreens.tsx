import { ScreenTitle, ScreenDivider } from "@/components/ui/PhoneFrame";
import { Bar, Pill } from "@/components/ui/primitives";
import { EstateFacade } from "@/components/art/EstateArt";
import { lifestyleProfile, properties, Property } from "@/data/properties";

export function LifestyleScreen() {
  const p = lifestyleProfile;
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>PROFILE</ScreenTitle>
      <ScreenDivider />
      <div className="text-center">
        <div className="font-serif text-[24px] text-forest-deep">{p.name}</div>
        <div className="mt-2">
          <Pill>Lifestyle · {p.tier}</Pill>
        </div>
      </div>
      <div className="mt-2">
        {p.traits.map((t) => (
          <Bar key={t.label} label={t.label} value={t.value} />
        ))}
      </div>
      <ScreenDivider className="mt-4" />
      <div className="label-eyebrow text-center text-ink/70">Öncelik sırası</div>
      <div className="mt-2 text-center font-serif text-[16px] leading-[1.7] text-forest">
        {p.priorities.slice(0, 2).join(" · ")}
        <br />
        {p.priorities.slice(2).join(" · ")}
      </div>
    </div>
  );
}

export function CuratedScreen() {
  const top = properties[0];
  const rest = properties.slice(1);
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>FOR YOU</ScreenTitle>
      <ScreenDivider />
      <div className="label-eyebrow mb-2.5">Size özel · {properties.length} mülk</div>
      <div className="overflow-hidden rounded-2xl border border-brass/30 bg-white">
        <div className="relative h-[120px]">
          <EstateFacade hue={top.hue} className="h-full w-full" />
          {top.offMarket && (
            <span className="absolute left-2.5 top-2.5">
              <Pill tone="soft">Off-market</Pill>
            </span>
          )}
        </div>
        <div className="px-3.5 py-3">
          <h4 className="font-serif text-[19px] font-medium text-forest-deep">{top.name}</h4>
          <div className="mt-1.5 text-[13.5px] leading-snug text-ink/65">
            {top.reasons.map((r) => `+ ${r}`).join("  ")}
          </div>
          <div className="mt-2 font-serif text-[15px] text-brass">
            Yaşam uyumu — {top.match}%
          </div>
        </div>
      </div>
      <div className="mt-3.5 flex items-center gap-2.5">
        <div className="h-px flex-1 bg-ivory-2" />
        <span className="label-eyebrow text-sage">Sıradaki</span>
        <div className="h-px flex-1 bg-ivory-2" />
      </div>
      {rest.map((r) => (
        <div
          key={r.id}
          className="mt-3 flex items-center justify-between font-serif text-[15px] text-forest"
        >
          <span>{r.name}</span>
          <span className="text-brass">{r.match}%</span>
        </div>
      ))}
    </div>
  );
}

export function DNAScreen({ property = properties[0] }: { property?: Property }) {
  const rows: [string, string | number][] = [
    ["Mimari kalite", property.dna.architecture],
    ["Malzeme", property.dna.materials],
    ["Lokasyon", property.dna.location],
    ["Mahremiyet", property.dna.privacy],
    ["Enerji", property.dna.energy],
    ["Yatırım potansiyeli", property.dna.investment],
  ];
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>PROPERTY DNA</ScreenTitle>
      <ScreenDivider />
      <div className="text-center">
        <div className="font-serif text-[21px] text-forest-deep">{property.name}</div>
        <div className="label-eyebrow mt-1 text-sage">{property.district}</div>
      </div>
      <ScreenDivider className="mt-3.5" />
      <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <div className="self-center font-label text-[11px] uppercase tracking-[0.12em] text-ink/70">
              {k}
            </div>
            <div className="text-right font-serif text-[19px] font-medium text-forest">{v}</div>
          </div>
        ))}
      </div>
      <ScreenDivider className="mt-4" />
      <div className="text-center">
        <Pill>Prestige Score · {property.prestigeScore}</Pill>
      </div>
    </div>
  );
}

export function PrivacyScreen({ property = properties[0] }: { property?: Property }) {
  const pct = property.privacyLevel * 10;
  const circumference = 2 * Math.PI * 66;
  const offset = circumference * (1 - pct / 100);
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>PRIVACY</ScreenTitle>
      <ScreenDivider />
      <div className="label-eyebrow text-center text-ink/70">Mahremiyet analizi</div>
      <div className="relative mx-auto my-2 h-[150px] w-[150px]">
        <svg width="150" height="150" className="-rotate-90">
          <circle cx="75" cy="75" r="66" fill="none" stroke="#EBE5D8" strokeWidth="6" />
          <circle
            cx="75"
            cy="75"
            r="66"
            fill="none"
            stroke="#B08D57"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <b className="font-serif text-[38px] font-medium leading-none text-forest">
            {property.privacyLevel.toFixed(1)}
          </b>
          <span className="mt-1 font-label text-[9.5px] uppercase tracking-[0.2em] text-sage">
            / 10
          </span>
        </div>
      </div>
      <div className="text-center">
        <Pill tone="forest">Görünmez yaşam</Pill>
      </div>
      <ScreenDivider className="mt-4" />
      <Bar label="Komşu mesafesi" value={96} />
      <Bar label="Görünürlük (drone)" value={92} />
      <Bar label="Giriş güvenliği" value={98} />
    </div>
  );
}

export function SilenceHealthScreen({ property = properties[0] }: { property?: Property }) {
  const c = property.checkup;
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>SILENCE MAP</ScreenTitle>
      <ScreenDivider />
      <div className="text-center">
        <Pill tone="forest">Ultra sessiz bölge</Pill>
      </div>
      <div className="mt-3.5 flex justify-around text-center">
        <div>
          <b className="font-serif text-[30px] text-forest">
            {property.silence.day}
            <small className="text-[14px]"> dB</small>
          </b>
          <span className="mt-0.5 block font-label text-[9.5px] uppercase tracking-[0.15em] text-sage">
            Gündüz
          </span>
        </div>
        <div>
          <b className="font-serif text-[30px] text-forest">
            {property.silence.night}
            <small className="text-[14px]"> dB</small>
          </b>
          <span className="mt-0.5 block font-label text-[9.5px] uppercase tracking-[0.15em] text-sage">
            Gece
          </span>
        </div>
      </div>
      <ScreenDivider className="mt-5" />
      <div className="label-eyebrow mb-3 text-ink/70">Home Checkup</div>
      <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-2.5">
        {(
          [
            ["Elektrik", c.electrical],
            ["Çatı", c.roof],
            ["Nem", c.humidity],
            ["Enerji", c.energy],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="contents">
            <div className="self-center font-label text-[11px] uppercase tracking-[0.12em] text-ink/70">
              {k}
            </div>
            <div className="text-right font-serif text-[19px] font-medium text-forest">{v}</div>
          </div>
        ))}
      </div>
      <ScreenDivider className="mt-4" />
      <div className="text-center font-serif text-[13.5px] italic text-ink/65">
        “İnsan check-up olur. Ev de olmalı.”
      </div>
    </div>
  );
}
