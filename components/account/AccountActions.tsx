"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIER_LIST, type Tier } from "@/lib/membership";

export function UpgradeButtons({ currentTier }: { currentTier: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentRank = TIER_LIST.find((t) => t.id === currentTier)?.rank ?? 0;

  async function upgrade(tier: Tier) {
    setBusy(tier);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Stripe Checkout
      } else if (data.redirect) {
        router.push(data.redirect); // demo upgrade
        router.refresh();
      } else {
        setError(data.error ?? "Yükseltme başarısız.");
      }
    } catch {
      setError("Bağlantı kurulamadı.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TIER_LIST.map((t) => {
          const isCurrent = t.id === currentTier;
          const isUpgrade = t.rank > currentRank;
          return (
            <div
              key={t.id}
              className={`rounded-lg border p-7 ${
                isCurrent ? "border-brass bg-brass/[0.06]" : "border-ink/12"
              }`}
            >
              <div className="font-serif text-[26px] text-forest-deep">{t.name}</div>
              <div className="mb-1 mt-1 font-label text-[10px] uppercase tracking-[0.2em] text-brass">
                {t.audience}
              </div>
              <div className="mb-4 font-serif text-[18px] text-forest">{t.priceLabel}</div>
              <ul className="mb-6">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 border-t border-ink/8 py-2 text-[14.5px] text-ink/70">
                    <span className="text-brass">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="rounded-sm border border-forest py-2.5 text-center font-label text-[11px] uppercase tracking-[0.2em] text-forest">
                  Mevcut üyeliğiniz
                </div>
              ) : isUpgrade ? (
                <button
                  onClick={() => upgrade(t.id)}
                  disabled={busy !== null}
                  className="w-full rounded-sm bg-forest py-2.5 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep disabled:opacity-50"
                >
                  {busy === t.id ? "…" : `${t.name}'e yükselt`}
                </button>
              ) : (
                <div className="py-2.5 text-center font-label text-[11px] uppercase tracking-[0.2em] text-sage">
                  —
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && <div className="mt-4 text-[14px] text-burgundy">{error}</div>}
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-burgundy"
    >
      Çıkış yap
    </button>
  );
}
