"use client";

import { useState } from "react";
import { interiorStyles } from "@/data/properties";
import { RoomScene } from "@/components/art/EstateArt";
import { Pill } from "@/components/ui/primitives";

export function InteriorDesigner() {
  const [active, setActive] = useState(0);
  const style = interiorStyles[active];

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-8 md:flex-row md:items-stretch">
      {/* Visualization */}
      <div className="w-full overflow-hidden rounded-2xl border border-ink/10 bg-forest-deep p-2 shadow-[0_30px_60px_-30px_rgba(20,36,28,0.5)] md:w-1/2">
        <div className="overflow-hidden rounded-xl">
          <RoomScene
            wall={style.palette.wall}
            floor={style.palette.floor}
            accent={style.palette.accent}
            textile={style.palette.textile}
            className="h-[300px] w-full transition-all duration-700"
          />
        </div>
        <div className="flex items-center justify-between px-3 py-3">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ivory/50">
            Villa Solitude · Salon
          </span>
          <span className="font-serif text-[15px] italic text-brass-soft">{style.name}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full flex-col justify-center md:w-1/2">
        <div className="label-eyebrow">AI Interior Designer</div>
        <p className="mt-3 font-serif text-[26px] leading-snug text-forest-deep">
          “Bu evi <em className="italic text-brass">{style.name}</em> tarzına çevir.”
        </p>
        <p className="mt-3 text-[16.5px] text-ink/65">{style.description}</p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {interiorStyles.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-2 font-label text-[11px] uppercase tracking-[0.14em] transition-colors ${
                i === active
                  ? "border-forest bg-forest text-ivory"
                  : "border-brass text-forest hover:bg-ivory-2"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center gap-8 border-t border-ink/10 pt-6">
          <div>
            <div className="label-eyebrow text-ink/50">Tahmini maliyet</div>
            <div className="mt-1 font-serif text-[28px] text-forest">{style.cost}</div>
          </div>
          <div>
            <div className="label-eyebrow text-ink/50">Değer etkisi</div>
            <div className="mt-1 font-serif text-[28px] text-brass">{style.valueImpact}</div>
          </div>
        </div>
        <div className="mt-5">
          <Pill tone="forest">Mobilya · Renk · Işık · Dekor — anında</Pill>
        </div>
      </div>
    </div>
  );
}
