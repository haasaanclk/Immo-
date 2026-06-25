export function TopBar() {
  const links = [
    ["Concierge", "#concierge"],
    ["Intelligence", "#intelligence"],
    ["Private Market", "#private"],
    ["Atelier", "#atelier"],
    ["Membership", "#membership"],
  ];
  return (
    <div className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-wrap items-center justify-between px-7">
        <div className="pl-[0.42em] font-serif text-[26px] tracking-brand">DOMAINE</div>
        <nav className="hidden gap-[34px] md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-forest"
            >
              {label}
            </a>
          ))}
          <a
            href="#membership"
            className="border-b border-brass pb-0.5 font-label text-[11px] uppercase tracking-[0.18em] text-forest"
          >
            Request Invitation
          </a>
        </nav>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <header className="relative overflow-hidden py-[120px] text-center">
      <div className="mx-auto max-w-wrap px-7">
        <div className="mx-auto mb-[34px] flex h-[74px] w-[74px] items-center justify-center rounded-full border border-brass font-serif text-[34px] text-forest">
          D
        </div>
        <div className="label-eyebrow">Private AI Real Estate Concierge</div>
        <h1 className="mt-[18px] font-serif text-[clamp(46px,8vw,104px)] font-light leading-[1.02] text-forest-deep">
          Ev aramazsınız.
          <br />
          <em className="italic text-brass">Size ait olanı</em> keşfedersiniz.
        </h1>
        <p className="mx-auto mt-[30px] max-w-[640px] text-[21px] text-ink/70">
          Bir ilan sitesi değil. Zamanınızı koruyan, mahremiyetinizi gözeten ve
          yalnızca size ait olanı gösteren kişisel bir gayrimenkul zekâ asistanı.
        </p>
        <div className="mt-10 font-label text-[10.5px] uppercase tracking-[0.3em] text-sage">
          Est. 2026 · München · Zürich · Wien · Dubai · London
        </div>
        <div
          className="mx-auto mt-[46px] h-[60px] w-px"
          style={{ background: "linear-gradient(#B08D57,transparent)" }}
        />
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
          Bir ilan sitesi değil — kişiye özel gayrimenkul karar sistemi. · Konsept.
        </div>
      </div>
    </footer>
  );
}
