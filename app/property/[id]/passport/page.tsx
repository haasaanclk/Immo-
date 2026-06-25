import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { canViewPrivate } from "@/lib/membership";
import { rowToProperty } from "@/lib/property";
import { passportSerial } from "@/lib/passport";
import { PropertyPassport } from "@/components/detail/PropertyPassport";
import { PrintButton } from "@/components/detail/PrintButton";

export const dynamic = "force-dynamic";

export default async function PassportPage({ params }: { params: { id: string } }) {
  const row = await getPropertyById(params.id);
  if (!row) notFound();

  const user = await getCurrentUser();
  if (row.offMarket && !canViewPrivate(user?.tier)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-7 text-center">
        <div className="label-eyebrow text-brass">Private Collection</div>
        <h1 className="mt-3 font-serif text-[32px] font-light text-forest-deep">
          Bu pasaport gizli portföye ait.
        </h1>
        <p className="mt-3 max-w-[440px] text-[16px] text-ink/60">
          {row.name} pasaportunu görmek için Privé veya Cercle Noir üyeliği gerekir.
        </p>
        <Link
          href={user ? "/account" : "/signin"}
          className="mt-6 rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory hover:bg-forest-deep"
        >
          {user ? "Üyeliği yükselt" : "Giriş yap"}
        </Link>
      </main>
    );
  }

  const property = rowToProperty(row);
  const serial = passportSerial(property.id);
  const issued = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main className="min-h-screen bg-ivory-2/40 py-2 print:bg-white print:py-0">
      <div className="no-print mx-auto flex max-w-[900px] items-center justify-between px-10 pt-6">
        <Link href={`/property/${property.id}`} className="label-eyebrow hover:text-forest">
          ← {property.name}
        </Link>
        <PrintButton />
      </div>
      <PropertyPassport property={property} serial={serial} issued={issued} />
    </main>
  );
}
