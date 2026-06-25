"use client";

import { useMemo, useState } from "react";

const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const energyFactor: Record<string, number> = {
  "A+": 0.0008,
  A: 0.0012,
  "B+": 0.0017,
  B: 0.0022,
  C: 0.003,
};

export function FinanceModule({
  price,
  energy,
  investment,
}: {
  price: number;
  energy: string;
  investment: number;
}) {
  const [downPct, setDownPct] = useState(30);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(4);
  const [budget, setBudget] = useState<string>("");

  const calc = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = price - down;
    const r = rate / 100 / 12;
    const n = term * 12;
    const mortgage =
      r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const maintenance = (price * 0.012) / 12;
    const energyCost = (price * (energyFactor[energy] ?? 0.0015)) / 12;
    const fees = (price * 0.003) / 12;
    const totalMonthly = mortgage + maintenance + energyCost + fees;

    const growth = 0.018 + (investment - 8) * 0.006;
    const value10 = price * Math.pow(1 + growth, 10);
    const gain = value10 - price;

    return { down, loan, mortgage, maintenance, energyCost, fees, totalMonthly, growth, value10, gain };
  }, [price, downPct, term, rate, energy, investment]);

  const b = parseFloat(budget.replace(/[^\d]/g, ""));
  const verdict =
    !budget || isNaN(b) || b <= 0
      ? null
      : b >= calc.totalMonthly
        ? { label: "Bütçenize uygun", tone: "ok" as const }
        : b >= calc.totalMonthly * 0.88
          ? { label: "Dengeli — sınırda", tone: "mid" as const }
          : { label: "Bütçenizi zorlar", tone: "warn" as const };

  return (
    <section className="mt-16 border-t border-ink/10 pt-12">
      <div className="label-eyebrow">Akıllı Finans</div>
      <h2 className="mt-2 font-serif text-[clamp(26px,3.5vw,38px)] font-light text-forest-deep">
        Özel finansal zekâ
      </h2>
      <p className="mt-2 max-w-[560px] text-[16px] text-ink/60">
        Bu ev sizin için ne anlama geliyor — aylık yük, toplam sahip olma maliyeti ve
        on yıllık değer projeksiyonu. Rakamlar size göre değişir.
      </p>

      <div className="mt-9 grid grid-cols-1 gap-12 md:grid-cols-[0.9fr_1.1fr]">
        {/* Controls */}
        <div className="flex flex-col gap-7">
          <div>
            <div className="label-eyebrow text-ink/45">Liste değeri</div>
            <div className="mt-1 font-serif text-[34px] text-forest">{eur(price)}</div>
          </div>

          <Slider label="Peşinat" value={downPct} min={10} max={60} step={1} suffix="%"
            onChange={setDownPct} hint={eur(calc.down)} />
          <Slider label="Vade" value={term} min={10} max={30} step={1} suffix=" yıl"
            onChange={setTerm} />
          <Slider label="Faiz" value={rate} min={1} max={7} step={0.1} suffix="%"
            onChange={setRate} fixed={1} />

          <label className="block">
            <span className="label-eyebrow text-ink/45">Aylık konfor bütçeniz (opsiyonel)</span>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              inputMode="numeric"
              placeholder="örn. 35.000"
              className="mt-2 w-full border-b border-ink/15 bg-transparent pb-2 font-serif text-[20px] text-forest placeholder:text-sage focus:border-brass focus:outline-none"
            />
          </label>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-brass/25 bg-ivory-2/40 p-8">
          <div className="flex items-end justify-between border-b border-ink/10 pb-5">
            <div>
              <div className="label-eyebrow text-ink/50">Aylık kredi ödemesi</div>
              <div className="mt-1 font-serif text-[40px] leading-none text-forest-deep">
                {eur(calc.mortgage)}
              </div>
            </div>
            {verdict && (
              <span
                className={`rounded-full border px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.16em] ${
                  verdict.tone === "ok"
                    ? "border-forest text-forest"
                    : verdict.tone === "mid"
                      ? "border-brass text-brass"
                      : "border-burgundy text-burgundy"
                }`}
              >
                {verdict.label}
              </span>
            )}
          </div>

          <Row k="Peşinat" v={eur(calc.down)} />
          <Row k="Kredi tutarı" v={eur(calc.loan)} />
          <div className="my-4 h-px bg-ink/10" />
          <Row k="Bakım (aylık)" v={eur(calc.maintenance)} sub />
          <Row k="Enerji (aylık)" v={eur(calc.energyCost)} sub />
          <Row k="Vergi & aidat (aylık)" v={eur(calc.fees)} sub />
          <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
            <span className="font-serif text-[17px] text-forest-deep">Toplam aylık maliyet</span>
            <span className="font-serif text-[24px] text-brass">{eur(calc.totalMonthly)}</span>
          </div>

          {/* Projection */}
          <div className="mt-7 rounded-lg bg-forest-deep px-5 py-5 text-ivory">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow text-brass-soft">10 yıl sonra (≈%{(calc.growth * 100).toFixed(1)}/yıl)</span>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="font-serif text-[28px]">{eur(calc.value10)}</div>
              <div className="text-right">
                <div className="font-serif text-[18px] text-brass-soft">+{eur(calc.gain)}</div>
                <div className="font-label text-[10px] uppercase tracking-[0.14em] text-ivory/50">
                  tahmini değer artışı
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  hint,
  fixed = 0,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
  hint?: string;
  fixed?: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-label text-[11px] uppercase tracking-[0.14em] text-ink/60">{label}</span>
        <span className="font-serif text-[18px] text-forest">
          {value.toFixed(fixed)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 w-full accent-[#B08D57]"
      />
      {hint && <div className="mt-1 text-right font-label text-[10px] uppercase tracking-[0.12em] text-sage">{hint}</div>}
    </div>
  );
}

function Row({ k, v, sub = false }: { k: string; v: string; sub?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <span className={sub ? "font-label text-[11px] uppercase tracking-[0.12em] text-ink/50" : "font-label text-[11px] uppercase tracking-[0.12em] text-ink/70"}>
        {k}
      </span>
      <span className={sub ? "font-serif text-[16px] text-ink/70" : "font-serif text-[18px] text-forest"}>{v}</span>
    </div>
  );
}
