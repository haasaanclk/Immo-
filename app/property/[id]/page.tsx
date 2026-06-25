import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { canViewPrivate } from "@/lib/membership";
import { rowToProperty } from "@/lib/property";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PropertyDetail } from "@/components/detail/PropertyDetail";
import { EstateFacade } from "@/components/art/EstateArt";
import { Pill } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const row = await getPropertyById(params.id);
  if (!row) notFound();

  const user = await getCurrentUser();
  const locked = row.offMarket && !canViewPrivate(user?.tier);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      {locked ? <LockedView name={row.name} district={row.district} hue={row.hue} signedIn={!!user} /> : (
        <PropertyDetail property={rowToProperty(row)} />
      )}
    </main>
  );
}

function LockedView({
  name,
  district,
  hue,
  signedIn,
}: {
  name: string;
  district: string;
  hue: number;
  signedIn: boolean;
}) {
  return (
    <div className="mx-auto max-w-wrap px-7 py-12">
      <Link href="/collection" className="label-eyebrow hover:text-forest">
        ← Collection
      </Link>
      <div className="relative mt-6 overflow-hidden rounded-xl border border-brass/25">
        <div className="h-[320px] blur-[6px]">
          <EstateFacade hue={hue} className="h-full w-full" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-deep/55 text-center">
          <div className="mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full border border-brass-soft text-[24px] text-brass-soft">
            ⌧
          </div>
          <div className="font-serif text-[26px] text-ivory">Private Collection</div>
          <p className="mt-2 max-w-[420px] text-[15px] text-ivory/70">
            <b className="text-brass-soft">{name}</b> · {district} yalnızca onaylı
            alıcılara açıktır.
          </p>
          <div className="mt-5">
            <Pill tone="soft">Privé üyeliği gerekli</Pill>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-[560px]">
        <h1 className="font-serif text-[clamp(30px,4vw,44px)] font-light leading-tight text-forest-deep">
          Mahremiyet, bir değerdir.
        </h1>
        <p className="mt-4 text-[18px] leading-relaxed text-ink/65">
          Bu mülk halka açık değil. DNA raporu, mahremiyet ve sessizlik analizini
          görmek ve özel gösterim talep etmek için Privé veya Cercle Noir üyeliği gerekir.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link
            href={signedIn ? "/account" : "/signin"}
            className="rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep"
          >
            {signedIn ? "Üyeliği yükselt" : "Giriş yap / Katıl"}
          </Link>
          <Link
            href="/collection"
            className="rounded-sm border border-ink/20 px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-forest hover:text-forest"
          >
            Portföye dön
          </Link>
        </div>
      </div>
    </div>
  );
}
