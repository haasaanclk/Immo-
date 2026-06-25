/** Cinematic, self-contained night-estate hero — no external assets. */
export function Hero() {
  // Deterministic star field.
  const stars = Array.from({ length: 46 }, (_, i) => ({
    x: (i * 53) % 100,
    y: (i * 29) % 46,
    r: (i % 3) * 0.4 + 0.5,
    d: (i % 7) * 0.4,
  }));
  const windows: { x: number; y: number; w: number; h: number }[] = [];
  // Mansion window grid.
  [560, 600, 700, 740, 840, 880].forEach((x) => {
    [430, 470, 520].forEach((y) => windows.push({ x, y, w: 18, h: 26 }));
  });

  return (
    <header className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-forest-deep">
      {/* Scene */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A130E" />
            <stop offset="0.45" stopColor="#11201A" />
            <stop offset="0.8" stopColor="#16271F" />
            <stop offset="1" stopColor="#1E3A2F" />
          </linearGradient>
          <radialGradient id="horizon" cx="50%" cy="78%" r="55%">
            <stop offset="0" stopColor="#3a2f1c" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#23311f" stopOpacity="0.4" />
            <stop offset="1" stopColor="#16271F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moon" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#F4EEDD" />
            <stop offset="0.7" stopColor="#E7DCC1" />
            <stop offset="1" stopColor="#E7DCC1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vig" cx="50%" cy="42%" r="75%">
            <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.6" />
          </radialGradient>
          <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <filter id="soft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="grainf"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        </defs>

        <rect width="1440" height="900" fill="url(#sky)" />
        <rect width="1440" height="900" fill="url(#horizon)" />

        {/* Stars */}
        <g>
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={(s.x / 100) * 1440}
              cy={(s.y / 100) * 900}
              r={s.r}
              fill="#EAE2CE"
              style={{ animation: `twinkle ${2.4 + s.d}s ease-in-out ${s.d}s infinite` }}
            />
          ))}
        </g>

        {/* Moon */}
        <circle cx="1140" cy="200" r="120" fill="url(#moon)" filter="url(#soft)" opacity="0.7" />
        <circle cx="1140" cy="200" r="46" fill="#F4EEDD" opacity="0.92" />

        {/* Distant mountain layers */}
        <path d="M0 560 Q260 470 520 540 T1040 520 T1440 560 V900 H0 Z" fill="#0E1B14" opacity="0.7"
          style={{ animation: "drift 60s ease-in-out infinite alternate" }} />
        <path d="M0 610 Q360 540 720 600 T1440 600 V900 H0 Z" fill="#0B150F" opacity="0.85" />

        {/* Warm horizon halo behind estate */}
        <ellipse cx="720" cy="600" rx="360" ry="120" fill="#B08D57" opacity="0.16" filter="url(#soft)" />

        {/* Estate silhouette */}
        <g>
          {/* main block */}
          <rect x="540" y="400" width="360" height="240" fill="#0C160F" />
          {/* roof */}
          <path d="M520 400 L720 320 L920 400 Z" fill="#0A130D" />
          {/* wings */}
          <rect x="470" y="470" width="80" height="170" fill="#0A130D" />
          <rect x="890" y="470" width="80" height="170" fill="#0A130D" />
          {/* chimneys */}
          <rect x="650" y="345" width="16" height="40" fill="#0A130D" />
          <rect x="780" y="345" width="16" height="40" fill="#0A130D" />
          {/* portico */}
          <rect x="690" y="560" width="60" height="80" fill="#06100A" />
          {/* warm windows with bloom */}
          <g filter="url(#bloom)">
            {windows.map((w, i) => (
              <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} rx="1.5" fill="#E7B765"
                style={{ animation: `windowFlicker ${5 + (i % 5)}s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
            <rect x="705" y="585" width="30" height="55" rx="2" fill="#F0C877" />
          </g>
        </g>

        {/* Foreground hedges */}
        <path d="M0 700 Q120 660 240 700 Q360 660 480 700 Q600 660 720 700 Q840 660 960 700 Q1080 660 1200 700 Q1320 660 1440 700 V900 H0 Z" fill="#08110B" />

        {/* Reflection pool */}
        <rect x="0" y="760" width="1440" height="140" fill="#060D09" />
        <g opacity="0.18" filter="url(#bloom)">
          {windows.slice(0, 9).map((w, i) => (
            <rect key={i} x={w.x} y={900 - (w.y - 400)} width={w.w} height={w.h * 0.7} fill="#E7B765" />
          ))}
        </g>

        <rect width="1440" height="900" fill="url(#vig)" />
      </svg>

      {/* Film grain */}
      <svg className="grain h-full w-full" aria-hidden>
        <rect width="100%" height="100%" filter="url(#grainf)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-wrap flex-col items-center justify-center px-7 text-center">
        <div className="hero-up label-eyebrow text-brass-soft" style={{ animationDelay: "0.1s" }}>
          Private AI Real Estate Concierge
        </div>
        <h1
          className="hero-up mt-6 font-serif text-[clamp(44px,8.5vw,108px)] font-light leading-[0.98] text-ivory"
          style={{ animationDelay: "0.25s" }}
        >
          Ev aramazsınız.
          <br />
          <em className="italic text-brass-soft">Size ait olanı</em> keşfedersiniz.
        </h1>
        <p
          className="hero-up mt-8 max-w-[560px] text-[19px] leading-relaxed text-ivory/70"
          style={{ animationDelay: "0.4s" }}
        >
          Bir ilan sitesi değil. Zamanınızı koruyan, mahremiyetinizi gözeten ve
          yalnızca size ait olanı gösteren kişisel bir gayrimenkul zekâsı.
        </p>
        <div className="hero-up mt-11 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.55s" }}>
          <a
            href="#concierge"
            className="rounded-sm bg-brass px-8 py-4 font-label text-[11px] uppercase tracking-[0.22em] text-forest-deep transition-colors hover:bg-brass-soft"
          >
            Concierge ile başla
          </a>
          <a
            href="/collection"
            className="rounded-sm border border-ivory/35 px-8 py-4 font-label text-[11px] uppercase tracking-[0.22em] text-ivory/85 transition-colors hover:border-brass-soft hover:text-brass-soft"
          >
            Portföyü keşfet
          </a>
        </div>
        <div
          className="hero-up mt-14 font-label text-[10.5px] uppercase tracking-[0.3em] text-ivory/40"
          style={{ animationDelay: "0.7s" }}
        >
          München · Zürich · Wien · Dubai · London
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" style={{ animation: "scrollCue 2s ease-in-out infinite" }}>
        <div className="h-10 w-px bg-gradient-to-b from-brass-soft to-transparent" />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-deep py-20 text-center text-ivory/75">
      <div className="mx-auto max-w-wrap px-7">
        <div className="pl-[0.42em] font-serif text-[30px] tracking-brand text-ivory">
          DOMAINE
        </div>
        <div className="my-[22px] font-serif text-[22px] italic text-brass-soft">
          Your Time. Your Privacy. Your Property.
        </div>
        <div className="font-label text-[10.5px] uppercase tracking-[0.3em] text-sage">
          Est. 2026 · München · Zürich · Wien · Dubai · London
        </div>
        <div className="mt-[30px] text-[14px] text-ivory/40">
          Bir ilan sitesi değil — kişiye özel gayrimenkul karar sistemi.
        </div>
      </div>
    </footer>
  );
}
