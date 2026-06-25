"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const QUALIFICATIONS = [
  "€2M – €5M doğrulandı",
  "€5M – €10M doğrulandı",
  "€10M+ doğrulandı",
  "Tam nakit alıcı",
];
const TIMES = ["10:00", "12:00", "15:00", "17:00"];

export function RequestViewing({
  propertyId,
  propertyName,
  signedIn,
}: {
  propertyId: string;
  propertyName: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState<"viewing" | "interest">("viewing");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [qualification, setQualification] = useState(QUALIFICATIONS[1]);
  const [anonymous, setAnonymous] = useState(true);
  const [note, setNote] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  function start() {
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/viewing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          type,
          preferredDate: type === "viewing" && date ? `${date} ${time}` : undefined,
          qualification,
          anonymous,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Talep gönderilemedi.");
      else {
        setDone(true);
        router.refresh();
      }
    } catch {
      setError("Bağlantı kurulamadı.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="w-full rounded-xl border border-forest bg-forest/[0.04] px-7 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-forest text-forest">✓</span>
          <div>
            <div className="font-serif text-[20px] text-forest-deep">Talebiniz alındı.</div>
            <div className="text-[15px] text-ink/60">
              {anonymous ? "Görünmez, doğrulanmış alıcı" : "Doğrulanmış alıcı"} olarak iletildi —
              {type === "viewing" ? " özel gösterim" : " gizli ilgi"} ekibimiz sizinle iletişime geçecek.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={start}
        className="rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep"
      >
        Özel gösterim talep et
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="w-full rounded-xl border border-brass/30 bg-ivory-2/40 p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="label-eyebrow text-brass">Private Market</div>
          <h3 className="mt-1 font-serif text-[24px] text-forest-deep">
            {propertyName} · Özel Gösterim
          </h3>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/40 hover:text-ink">
          Kapat
        </button>
      </div>

      {/* Privacy assurance */}
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-forest/20 bg-forest/[0.03] px-4 py-3">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mt-1 accent-[#1E3A2F]" />
        <span className="text-[14px] text-ink/70">
          <b className="text-forest">Görünmez Alıcı</b> — kimliğiniz gizli kalır. Satıcıya
          yalnızca finansal yeterliliğiniz iletilir, adınız değil.
        </span>
      </label>

      {/* Type */}
      <div className="mt-5 flex gap-2">
        {([["viewing", "Özel gösterim"], ["interest", "Gizli ilgi bildir"]] as const).map(([v, l]) => (
          <button
            type="button"
            key={v}
            onClick={() => setType(v)}
            className={`rounded-full border px-4 py-2 font-label text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
              type === v ? "border-forest bg-forest text-ivory" : "border-brass text-forest hover:bg-ivory-2"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Date + time (viewing only) */}
      {type === "viewing" && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-eyebrow text-ink/45">Tercih edilen gün</span>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full border-b border-ink/15 bg-transparent pb-2 font-body text-[16px] text-ink focus:border-brass focus:outline-none"
            />
          </label>
          <div>
            <span className="label-eyebrow text-ink/45">Saat</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIMES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-full border px-3 py-1.5 font-label text-[11px] tracking-[0.1em] transition-colors ${
                    time === t ? "border-forest bg-forest text-ivory" : "border-ink/20 text-ink/60 hover:border-forest"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Qualification */}
      <label className="mt-5 block">
        <span className="label-eyebrow text-ink/45">Finansal yeterlilik (satıcıya iletilen)</span>
        <select
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          className="mt-2 w-full border-b border-ink/15 bg-transparent pb-2 font-body text-[16px] text-forest focus:border-brass focus:outline-none"
        >
          {QUALIFICATIONS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </label>

      {/* Note */}
      <label className="mt-5 block">
        <span className="label-eyebrow text-ink/45">Not (opsiyonel)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Concierge ekibimize iletmek istedikleriniz…"
          className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent pb-2 font-body text-[16px] text-ink placeholder:text-sage focus:border-brass focus:outline-none"
        />
      </label>

      {error && <div className="mt-4 text-[14px] text-burgundy">{error}</div>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-sm bg-forest py-3.5 font-label text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-forest-deep disabled:opacity-50"
      >
        {busy ? "…" : type === "viewing" ? "Özel gösterim talep et" : "Gizli ilgimi bildir"}
      </button>
    </form>
  );
}
