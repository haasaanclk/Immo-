import { getAllProperties, getSavedPropertyIds } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { canViewPrivate } from "@/lib/membership";
import { CATEGORIES } from "@/data/properties";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SectionHead } from "@/components/ui/primitives";
import { CollectionIndex, type IndexItem } from "@/components/collection/CollectionIndex";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const rows = await getAllProperties();
  const user = await getCurrentUser();
  const member = canViewPrivate(user?.tier);
  const savedIds = new Set(user ? await getSavedPropertyIds(user.id) : []);

  const items: IndexItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city: r.city,
    kind: r.kind,
    year: r.year,
    hue: r.hue,
    match: r.match,
    prestigeScore: r.prestigeScore,
    privacyLevel: r.privacyLevel,
    offMarket: r.offMarket,
    saved: savedIds.has(r.id),
  }));

  // Only show categories that actually have properties, in canonical order.
  const present = CATEGORIES.filter((c) => items.some((i) => i.kind === c));

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-wrap px-7 py-16">
        <SectionHead eyebrow="The Collection" title="Portföy">
          Yalnızca özenle seçilmiş mülkler. Bir isme yaklaşın; mülk belirsin.
          Off-market olanlar Private Collection üyeliğiyle açılır.
        </SectionHead>

        <CollectionIndex
          items={items}
          categories={present}
          member={member}
          signedIn={!!user}
        />
      </div>
    </main>
  );
}
