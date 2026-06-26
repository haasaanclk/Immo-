import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-7 text-center">
      <Link href="/" className="font-serif text-[22px] tracking-brand text-forest-deep">
        DOMAINE
      </Link>
      <div className="mt-10 font-serif text-[clamp(60px,12vw,120px)] font-light leading-none text-brass">
        404
      </div>
      <h1 className="mt-4 font-serif text-[28px] font-light text-forest-deep">
        Bu kapı size ait değil.
      </h1>
      <p className="mt-3 max-w-[420px] text-[16px] text-ink/60">
        Aradığınız sayfa bulunamadı — belki gizli portföye ait, belki hiç var olmadı.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep"
        >
          Ana sayfa
        </Link>
        <Link
          href="/collection"
          className="rounded-sm border border-ink/20 px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-forest hover:text-forest"
        >
          Portföy
        </Link>
      </div>
    </main>
  );
}
