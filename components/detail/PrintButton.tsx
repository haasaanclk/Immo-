"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-sm border border-ink/20 px-5 py-2.5 font-label text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-forest hover:text-forest"
    >
      Yazdır / PDF
    </button>
  );
}
