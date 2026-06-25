import Link from "next/link";
import type { Property } from "@/data/properties";
import { EstateFacade } from "@/components/art/EstateArt";
import { Pill } from "@/components/ui/primitives";
import { IntelligenceReport } from "./IntelligenceReport";

function Gauge({ value, label }: { value: number; label: string }) {
  const pct = value * 10;
  const c = 2 * Math.PI * 52;
  const offset = c * (1 - pct / 100);
  return (
    <div className="relative h-[130px] w-[130px]">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r="52" fill="none" stroke="#EBE5D8" strokeWidth="5" />
        <circle
          cx="65"
          cy="65"
          r="52"
          fill="none"
          stroke="#B08D57"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <b className="font-serif text-[30px] font-medium leading-none text-forest">
          {value.toFixed(1)}
        </b>
        <span className="mt-1 font-label text-[8.5px] uppercase tracking-[0.2em] text-sage">
          {label}
        </span>
      </div>
    </div>
  );
}

function DnaRow({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex items-center justify-between border-t border-ink/10 py-3">
      <span className="font-label text-[11px] uppercase tracking-[0.14em] text-ink/60">{k}</span>
      <span className="font-serif text-[22px] font-medium text-forest">{v}</span>
    </div>
  );
}

export function PropertyDetail({
  property,
  personalized = false,
  userName,
  signedIn = false,
}: {
  property: Property;
  personalized?: boolean;
  userName?: string;
  signedIn?: boolean;
}) {
  const p = property;
  return (
    <article className="mx-auto max-w-wrap px-7 py-12">
      <Link href="/collection" className="label-eyebrow hover:text-forest">
        ← Collection
      </Link>

      <div className="mt-6 overflow-hidden rounded-xl border border-brass/25">
        <div className="relative h-[320px]">
          <EstateFacade hue={p.hue} className="h-full w-full" />
          <div className="absolute left-5 top-5 flex gap-2">
            {p.offMarket && <Pill tone="soft">Off-market</Pill>}
            <Pill tone="soft">Prestige {p.prestigeScore}</Pill>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[clamp(34px,5vw,56px)] font-light leading-none text-forest-deep">
            {p.name}
          </h1>
          <div className="mt-3 label-eyebrow text-sage">
            {p.district} · {p.city}
          </div>
        </div>
        <div className="text-right">
          <div className="label-eyebrow text-ink/50">Yaşam uyumu</div>
          <div className="font-serif text-[40px] text-brass">{p.match}%</div>
        </div>
      </div>

      <p className="mt-6 max-w-[640px] font-serif text-[20px] italic leading-relaxed text-ink/70">
        {p.reasons.map((r) => `+ ${r}`).join("   ")}
      </p>

      {/* DNA + gauges */}
      <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div className="mb-4 label-eyebrow">Property DNA</div>
          <DnaRow k="Mimari kalite" v={p.dna.architecture} />
          <DnaRow k="Malzeme" v={p.dna.materials} />
          <DnaRow k="Lokasyon" v={p.dna.location} />
          <DnaRow k="Mahremiyet" v={p.dna.privacy} />
          <DnaRow k="Enerji" v={p.dna.energy} />
          <DnaRow k="Yatırım potansiyeli" v={p.dna.investment} />
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <div className="mb-4 label-eyebrow">Mahremiyet & Sessizlik</div>
            <div className="flex items-center gap-8">
              <Gauge value={p.privacyLevel} label="Privacy" />
              <div>
                <div className="flex gap-8">
                  <div>
                    <div className="font-serif text-[28px] text-forest">
                      {p.silence.day}
                      <small className="text-[14px]"> dB</small>
                    </div>
                    <div className="font-label text-[9.5px] uppercase tracking-[0.15em] text-sage">
                      Gündüz
                    </div>
                  </div>
                  <div>
                    <div className="font-serif text-[28px] text-forest">
                      {p.silence.night}
                      <small className="text-[14px]"> dB</small>
                    </div>
                    <div className="font-label text-[9.5px] uppercase tracking-[0.15em] text-sage">
                      Gece
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Pill tone="forest">Ultra sessiz bölge</Pill>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 label-eyebrow">Home Checkup</div>
            <div className="grid grid-cols-2 gap-x-8">
              <DnaRow k="Elektrik" v={p.checkup.electrical} />
              <DnaRow k="Çatı" v={p.checkup.roof} />
              <DnaRow k="Nem" v={p.checkup.humidity} />
              <DnaRow k="Enerji" v={p.checkup.energy} />
            </div>
          </div>
        </div>
      </div>

      {/* AI-generated, personalized intelligence report */}
      <IntelligenceReport
        propertyId={p.id}
        personalized={personalized}
        userName={userName}
        signedIn={signedIn}
      />

      <div className="mt-14 flex flex-wrap gap-4 border-t border-ink/10 pt-8">
        <Link
          href="/account"
          className="rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep"
        >
          Özel gösterim talep et
        </Link>
        <Link
          href="/collection"
          className="rounded-sm border border-ink/20 px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-forest hover:text-forest"
        >
          Portföye dön
        </Link>
      </div>
    </article>
  );
}
