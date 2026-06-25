import type { Property } from "@/data/properties";
import { qualityIndex } from "@/lib/passport";

const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

function Metric({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink/10 py-2.5">
      <span className="font-label text-[10.5px] uppercase tracking-[0.12em] text-ink/55">{k}</span>
      <span className="font-serif text-[18px] font-medium text-forest">{v}</span>
    </div>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 140 140" className="h-[112px] w-[112px]" aria-hidden>
      <defs>
        <path id="sealText" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
      </defs>
      <circle cx="70" cy="70" r="64" fill="none" stroke="#B08D57" strokeWidth="1" />
      <circle cx="70" cy="70" r="58" fill="none" stroke="#B08D57" strokeWidth="0.5" />
      <text className="font-label" fill="#B08D57" fontSize="9" letterSpacing="3">
        <textPath href="#sealText" startOffset="0">
          · DOMAINE · DOĞRULANMIŞ · PRIVATE PROPERTY INTELLIGENCE
        </textPath>
      </text>
      <circle cx="70" cy="70" r="34" fill="none" stroke="#B08D57" strokeWidth="0.5" />
      <text x="70" y="78" textAnchor="middle" className="font-serif" fill="#1E3A2F" fontSize="34">D</text>
    </svg>
  );
}

export function PropertyPassport({
  property,
  serial,
  issued,
}: {
  property: Property;
  serial: string;
  issued: string;
}) {
  const p = property;
  const quality = qualityIndex(p.dna, p.prestigeScore);
  const growth = 0.018 + (p.dna.investment - 8) * 0.006;
  const value10 = p.price * Math.pow(1 + growth, 10);

  return (
    <article className="passport mx-auto my-10 max-w-[900px] bg-ivory px-10 py-12 shadow-[0_40px_90px_-50px_rgba(20,36,28,0.45)] ring-1 ring-brass/30 print:my-0 print:shadow-none print:ring-0">
      {/* Header */}
      <header className="flex items-start justify-between border-b border-ink/15 pb-7">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass font-serif text-[22px] text-forest">D</div>
          <div className="mt-4 font-serif text-[26px] tracking-brand text-forest-deep">DOMAINE</div>
          <div className="label-eyebrow mt-2">Dijital Ev Pasaportu</div>
        </div>
        <div className="text-right">
          <div className="font-label text-[10px] uppercase tracking-[0.2em] text-ink/45">Seri No</div>
          <div className="font-serif text-[20px] text-forest">{serial}</div>
          <div className="mt-3 font-label text-[10px] uppercase tracking-[0.2em] text-ink/45">Düzenlenme</div>
          <div className="font-body text-[15px] text-ink/70">{issued}</div>
        </div>
      </header>

      {/* Identity + quality */}
      <section className="flex flex-wrap items-end justify-between gap-6 py-8">
        <div>
          <h1 className="font-serif text-[clamp(30px,5vw,46px)] font-light leading-none text-forest-deep">
            {p.name}
          </h1>
          <div className="mt-3 label-eyebrow text-sage">
            {p.kind} · {p.district} · {p.city} · {p.year}
          </div>
          <div className="mt-4 font-serif text-[24px] text-forest">{eur(p.price)}</div>
        </div>
        <div className="text-center">
          <div className="font-label text-[10px] uppercase tracking-[0.2em] text-ink/45">Kalite Endeksi</div>
          <div className="font-serif text-[64px] leading-none text-brass">{quality}</div>
          <div className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">/ 100</div>
        </div>
      </section>

      {/* Data grid */}
      <section className="grid grid-cols-1 gap-x-14 gap-y-8 border-t border-ink/15 pt-8 md:grid-cols-2">
        <div>
          <div className="label-eyebrow mb-3">Property DNA</div>
          <Metric k="Mimari kalite" v={p.dna.architecture} />
          <Metric k="Malzeme" v={p.dna.materials} />
          <Metric k="Lokasyon" v={p.dna.location} />
          <Metric k="Mahremiyet" v={p.dna.privacy} />
          <Metric k="Enerji sınıfı" v={p.dna.energy} />
          <Metric k="Yatırım potansiyeli" v={p.dna.investment} />
          <Metric k="Prestij skoru" v={p.prestigeScore} />
        </div>
        <div>
          <div className="label-eyebrow mb-3">Mahremiyet & Sessizlik</div>
          <Metric k="Mahremiyet düzeyi" v={`${p.privacyLevel} / 10`} />
          <Metric k="Sessizlik · gündüz" v={`${p.silence.day} dB`} />
          <Metric k="Sessizlik · gece" v={`${p.silence.night} dB`} />

          <div className="label-eyebrow mb-3 mt-8">Ev Sağlık Raporu</div>
          <Metric k="Elektrik" v={p.checkup.electrical} />
          <Metric k="Çatı" v={p.checkup.roof} />
          <Metric k="Nem" v={p.checkup.humidity} />
          <Metric k="Enerji" v={p.checkup.energy} />
        </div>
      </section>

      {/* Financial summary */}
      <section className="mt-8 grid grid-cols-1 gap-6 rounded-lg bg-forest-deep px-7 py-6 text-ivory md:grid-cols-3">
        <div>
          <div className="font-label text-[10px] uppercase tracking-[0.18em] text-brass-soft">Liste değeri</div>
          <div className="mt-1 font-serif text-[24px]">{eur(p.price)}</div>
        </div>
        <div>
          <div className="font-label text-[10px] uppercase tracking-[0.18em] text-brass-soft">Tahmini değer artışı</div>
          <div className="mt-1 font-serif text-[24px]">≈ %{(growth * 100).toFixed(1)} / yıl</div>
        </div>
        <div>
          <div className="font-label text-[10px] uppercase tracking-[0.18em] text-brass-soft">10 yıl sonra (tahmini)</div>
          <div className="mt-1 font-serif text-[24px]">{eur(value10)}</div>
        </div>
      </section>

      {/* Verification */}
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ink/15 pt-8">
        <div className="max-w-[460px]">
          <div className="label-eyebrow">Doğrulama</div>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/60">
            Bu pasaport, {p.name} için DOMAINE Private Property Intelligence tarafından
            düzenlenmiştir. Veriler mülkün DNA, mahremiyet, sağlık ve finansal göstergelerinden
            derlenmiştir. Geçerlilik: 12 ay · Seri No {serial}.
          </p>
        </div>
        <Seal />
      </footer>
    </article>
  );
}
