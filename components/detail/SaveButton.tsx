"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SaveButton({
  propertyId,
  initialSaved,
  signedIn,
  variant = "full",
}: {
  propertyId: string;
  initialSaved: boolean;
  signedIn: boolean;
  variant?: "full" | "chip";
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next); // optimistic
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, action: next ? "save" : "unsave" }),
      });
      if (!res.ok) setSaved(!next);
      else router.refresh();
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  if (variant === "chip") {
    return (
      <button
        onClick={toggle}
        aria-label={saved ? "Kayıttan çıkar" : "Kaydet"}
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-[14px] backdrop-blur transition-colors ${
          saved
            ? "border-brass bg-brass text-forest-deep"
            : "border-ivory/60 bg-forest-deep/40 text-ivory hover:border-brass hover:text-brass"
        }`}
      >
        {saved ? "✦" : "✧"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-sm px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] transition-colors ${
        saved
          ? "border border-brass bg-brass/10 text-brass"
          : "border border-ink/20 text-ink/70 hover:border-forest hover:text-forest"
      }`}
    >
      {saved ? "✦ Kaydedildi" : "✧ Koleksiyonuma kaydet"}
    </button>
  );
}
