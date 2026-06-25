"use client";

import { useState } from "react";
import { interiorStyles } from "@/data/properties";
import { RoomScene } from "@/components/art/EstateArt";
import { Pill } from "@/components/ui/primitives";

interface Design {
  name: string;
  description: string;
  palette: { wall: string; floor: string; accent: string; textile: string };
  cost: string;
  valueImpact: string;
  materials?: string[];
  rationale?: string;
}

const PRESETS: Design[] = interiorStyles.map((s) => ({
  name: s.name,
  description: s.description,
  palette: s.palette,
  cost: s.cost,
  valueImpact: s.valueImpact,
}));

export function InteriorDesigner({ propertyName = "Villa Solitude" }: { propertyName?: string }) {
  const [design, setDesign] = useState<Design>(PRESETS[0]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"preset" | "ai" | "demo">("preset");

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/atelier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, propertyName }),
      });
      const data = await res.json();
      if (data.design) {
        setDesign(data.design as Design);
        setMode(data.mode === "ai" ? "ai" : "demo");
      }
    } catch {
      /* keep current design */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-col items-stretch gap-8 md:flex-row">
      {/* Visualization */}
      <div className="w-full md:w-1/2">
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-forest-deep p-2 shadow-[0_30px_60px_-30px_rgba(20,36,28,0.5)]">
          <div className="overflow-hidden rounded-xl">
            <RoomScene
              wall={design.palette.wall}
              floor={design.palette.floor}
              accent={design.palette.accent}
              textile={design.palette.textile}
              className="h-[300px] w-full transition-all duration-700"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-3">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ivory/50">
              {propertyName} · Salon
            </span>
            <span className="font-serif text-[15px] italic text-brass-soft">{design.name}</span>
          </div>
        </div>
        {mode !== "preset" && (
          <div className="mt-2 text-center font-label text-[9px] uppercase tracking-[0.18em] text-sage">
            {mode === "ai" ? "✦ Claude tarafından tasarlandı" : "Demo · ANTHROPIC_API_KEY ile canlı AI"}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex w-full flex-col justify-center md:w-1/2">
        <div className="label-eyebrow">AI Interior Designer</div>
        <p className="mt-3 font-serif text-[26px] leading-snug text-forest-deep">
          “Bu evi <em className="italic text-brass">{design.name}</em> yap.”
        </p>
        <p className="mt-3 text-[16.5px] text-ink/65">{design.description}</p>

        {/* Free-text AI prompt */}
        <form onSubmit={apply} className="mt-5 flex items-center gap-2 border-b border-ink/15 pb-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={busy}
            placeholder="örn. İskandinav yap, çalışma köşesi ekle…"
            className="min-w-0 flex-1 bg-transparent font-body text-[16px] text-ink placeholder:text-sage focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !prompt.trim()}
            className="font-label text-[11px] uppercase tracking-[0.18em] text-brass disabled:opacity-30"
          >
            {busy ? "…" : "Uygula"}
          </button>
        </form>

        {/* Quick presets */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setDesign(p);
                setMode("preset");
              }}
              className={`rounded-full border px-3.5 py-1.5 font-label text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                design.name === p.name
                  ? "border-forest bg-forest text-ivory"
                  : "border-brass text-forest hover:bg-ivory-2"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {design.materials && design.materials.length > 0 && (
          <div className="mt-5 text-[14px] text-ink/60">
            {design.materials.join(" · ")}
          </div>
        )}

        <div className="mt-6 flex items-center gap-8 border-t border-ink/10 pt-6">
          <div>
            <div className="label-eyebrow text-ink/50">Tahmini maliyet</div>
            <div className="mt-1 font-serif text-[28px] text-forest">{design.cost}</div>
          </div>
          <div>
            <div className="label-eyebrow text-ink/50">Değer etkisi</div>
            <div className="mt-1 font-serif text-[28px] text-brass">{design.valueImpact}</div>
          </div>
        </div>

        {design.rationale ? (
          <p className="mt-5 font-serif text-[15px] italic text-ink/60">“{design.rationale}”</p>
        ) : (
          <div className="mt-5">
            <Pill tone="forest">Mobilya · Renk · Işık · Dekor — anında</Pill>
          </div>
        )}
      </div>
    </div>
  );
}
