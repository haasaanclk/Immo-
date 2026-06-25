"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EstateFacade } from "@/components/art/EstateArt";
import { SaveButton } from "@/components/detail/SaveButton";

export interface IndexItem {
  id: string;
  name: string;
  district: string;
  city: string;
  kind: string;
  year: number;
  hue: number;
  match: number;
  prestigeScore: number;
  privacyLevel: number;
  offMarket: boolean;
  saved: boolean;
}

export function CollectionIndex({
  items,
  categories,
  member,
  signedIn,
}: {
  items: IndexItem[];
  categories: string[];
  member: boolean;
  signedIn: boolean;
}) {
  const [active, setActive] = useState<string>("Tümü");
  const [hoverId, setHoverId] = useState<string>(items[0]?.id ?? "");

  const filters = useMemo(() => ["Tümü", ...categories], [categories]);

  const filtered = useMemo(
    () => (active === "Tümü" ? items : items.filter((i) => i.kind === active)),
    [items, active],
  );

  // Keep the preview pointed at a visible item.
  const preview =
    filtered.find((i) => i.id === hoverId) ?? filtered[0] ?? items[0];
  const previewLocked = preview?.offMarket && !member;

  function selectCategory(cat: string) {
    setActive(cat);
    const next = cat === "Tümü" ? items : items.filter((i) => i.kind === cat);
    if (next[0]) setHoverId(next[0].id);
  }

  return (
    <div>
      {/* Category filters */}
      <div className="mb-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-ink/10 pb-5">
        {filters.map((cat) => {
          const isActive = cat === active;
          const count =
            cat === "Tümü" ? items.length : items.filter((i) => i.kind === cat).length;
          return (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`cl-ease font-label text-[12px] uppercase tracking-[0.18em] ${
                isActive ? "text-forest" : "text-ink/45 hover:text-forest"
              }`}
            >
              {cat}
              <sup className="ml-1 text-[9px] text-brass">{count}</sup>
              {isActive && <span className="mt-1 block h-px w-full bg-brass" />}
            </button>
          );
        })}
      </div>

      <div className="md:grid md:grid-cols-[1.05fr_0.95fr] md:gap-14">
        {/* Index list */}
        <div key={active} onMouseLeave={() => filtered[0] && setHoverId(filtered[0].id)}>
          {filtered.map((item, i) => {
            const dimmed = preview && preview.id !== item.id;
            const locked = item.offMarket && !member;
            return (
              <Link
                key={item.id}
                href={`/property/${item.id}`}
                onMouseEnter={() => setHoverId(item.id)}
                className="cl-rise group block border-b border-ink/10"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                {/* Mobile thumbnail */}
                <div className="relative mt-4 h-[150px] overflow-hidden rounded-lg md:hidden">
                  <div className={locked ? "h-full blur-[5px]" : "h-full"}>
                    <EstateFacade hue={item.hue} className="h-full w-full" />
                  </div>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-forest-deep/45 font-label text-[10px] uppercase tracking-[0.2em] text-brass-soft">
                      ⌧ Privé
                    </div>
                  )}
                </div>

                <div
                  className="cl-ease flex items-baseline justify-between py-5 md:py-6"
                  style={{ opacity: dimmed ? 0.4 : 1 }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="cl-ease font-serif text-[clamp(24px,3.2vw,40px)] font-light leading-none text-forest-deep group-hover:translate-x-1">
                      {item.name}
                    </span>
                    {item.offMarket && (
                      <span className="font-label text-[9px] uppercase tracking-[0.2em] text-brass">
                        Privé
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-5">
                    <span className="hidden font-label text-[11px] uppercase tracking-[0.14em] text-ink/45 sm:inline">
                      {item.kind} · {item.city} · {item.year}
                    </span>
                    <span className="font-serif text-[15px] text-brass">{item.match}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sticky preview */}
        <div className="hidden md:block">
          <div className="sticky top-[88px]">
            {preview && (
              <div key={preview.id} className="cl-reveal">
                <div className="relative overflow-hidden rounded-xl border border-brass/25">
                  <div className={previewLocked ? "blur-[6px]" : ""}>
                    <EstateFacade hue={preview.hue} className="h-[360px] w-full" />
                  </div>
                  {previewLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-deep/55 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-brass-soft text-[20px] text-brass-soft">
                        ⌧
                      </div>
                      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-brass-soft">
                        Private Collection · Privé
                      </span>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full border border-ivory/50 bg-forest-deep/40 px-3 py-1 font-label text-[9.5px] uppercase tracking-[0.18em] text-ivory backdrop-blur">
                      {preview.kind}
                    </span>
                  </div>
                  <div className="absolute right-4 top-4">
                    <SaveButton
                      key={preview.id}
                      propertyId={preview.id}
                      initialSaved={preview.saved}
                      signedIn={signedIn}
                      variant="chip"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-[26px] font-light text-forest-deep">
                      {preview.name}
                    </h3>
                    <div className="mt-1 label-eyebrow text-sage">
                      {preview.district} · {preview.city} · {preview.year}
                    </div>
                  </div>
                  <Link
                    href={`/property/${preview.id}`}
                    className="cl-ease font-label text-[11px] uppercase tracking-[0.18em] text-forest hover:text-brass"
                  >
                    Detayı gör →
                  </Link>
                </div>
                <div className="mt-3 flex gap-6 text-[13px] text-ink/55">
                  <span>Uyum {preview.match}%</span>
                  <span>·</span>
                  <span>Prestij {preview.prestigeScore}</span>
                  <span>·</span>
                  <span>Mahremiyet {preview.privacyLevel.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
