const PRINCIPLES = [
  ["I", "Zamanınızı koruyun", "AI yerinize çalışır."],
  ["II", "Mahremiyetinizi koruyun", "Görünmez alıcı, gizli portföy."],
  ["III", "Size özel olanı görün", "Binlerce ilan değil, doğru ev."],
  ["IV", "Prestiji kanıtlayın", "DNA, finans, doğrulanmış pasaport."],
] as const;

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-forest-deep py-28">
      {/* atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(176,141,87,0.18), transparent 60%), radial-gradient(80% 60% at 50% 120%, rgba(176,141,87,0.10), transparent)",
        }}
      />
      <svg className="grain h-full w-full" aria-hidden>
        <defs>
          <filter id="grainM"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grainM)" />
      </svg>

      <div className="relative mx-auto max-w-wrap px-7 text-center">
        <div className="font-label text-[11px] uppercase tracking-[0.3em] text-brass-soft">
          Marka Felsefesi
        </div>
        <h2 className="mx-auto mt-7 max-w-[920px] font-serif text-[clamp(28px,4.5vw,54px)] font-light leading-[1.12] text-ivory">
          Zamanınızı koruyun. Mahremiyetinizi koruyun.
          <br />
          <em className="italic text-brass-soft">Size özel olanı</em> görün. Prestiji kanıtlayın.
        </h2>

        <div className="mx-auto mt-16 grid max-w-[1000px] grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(([n, t, d]) => (
            <div key={n} className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-brass-soft/60 font-serif text-[16px] text-brass-soft">
                {n}
              </div>
              <h3 className="mt-5 font-serif text-[21px] text-ivory">{t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ivory/55">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
