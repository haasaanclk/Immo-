import Link from "next/link";
import { getAllProperties, getSavedPropertyIds } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { canViewPrivate } from "@/lib/membership";
import { SiteHeader } from "@/components/site/SiteHeader";
import { EstateFacade } from "@/components/art/EstateArt";
import { Pill } from "@/components/ui/primitives";
import { SectionHead } from "@/components/ui/primitives";
import { SaveButton } from "@/components/detail/SaveButton";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const rows = await getAllProperties();
  const user = await getCurrentUser();
  const member = canViewPrivate(user?.tier);
  const savedIds = new Set(user ? await getSavedPropertyIds(user.id) : []);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-wrap px-7 py-16">
        <SectionHead eyebrow="The Collection" title="Portföy">
          Yalnızca özenle seçilmiş mülkler. Off-market olanlar Private Collection
          üyeliğiyle açılır.
        </SectionHead>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const locked = r.offMarket && !member;
            return (
              <Link
                key={r.id}
                href={`/property/${r.id}`}
                className="group overflow-hidden rounded-xl border border-brass/25 bg-white transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(20,36,28,0.35)]"
              >
                <div className="relative h-[180px]">
                  <div className={locked ? "h-full blur-[5px]" : "h-full"}>
                    <EstateFacade hue={r.hue} className="h-full w-full" />
                  </div>
                  <div className="absolute left-3 top-3 flex gap-2">
                    {r.offMarket && <Pill tone="soft">Off-market</Pill>}
                  </div>
                  <div className="absolute right-3 top-3">
                    <SaveButton
                      propertyId={r.id}
                      initialSaved={savedIds.has(r.id)}
                      signedIn={!!user}
                      variant="chip"
                    />
                  </div>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-forest-deep/45">
                      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-brass-soft">
                        ⌧ Privé
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-[21px] text-forest-deep">{r.name}</h3>
                    <span className="font-serif text-[15px] text-brass">{r.match}%</span>
                  </div>
                  <div className="mt-1 label-eyebrow text-sage">
                    {r.district} · {r.city}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[12.5px] text-ink/55">
                    <span>Prestij {r.prestigeScore}</span>
                    <span>·</span>
                    <span>Mahremiyet {r.privacyLevel.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
