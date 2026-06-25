import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { tierInfo } from "@/lib/membership";
import { UpgradeButtons, LogoutButton } from "@/components/account/AccountActions";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const current = tierInfo(user.tier);
  const upgraded = searchParams.upgraded ? tierInfo(searchParams.upgraded) : null;

  return (
    <main className="min-h-screen">
      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-wrap items-center justify-between px-7 py-5">
          <Link href="/" className="font-serif text-[22px] tracking-brand">
            DOMAINE
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/collection"
              className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-forest"
            >
              Collection
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-wrap px-7 py-16">
        <div className="label-eyebrow">Hesap</div>
        <h1 className="mt-3 font-serif text-[clamp(34px,5vw,52px)] font-light text-forest-deep">
          {user.name}
        </h1>
        <p className="mt-3 text-[18px] text-ink/60">{user.email}</p>
        <div className="mt-5 inline-block rounded-full border border-brass px-4 py-2 font-label text-[11px] uppercase tracking-[0.2em] text-brass">
          Üyelik · {current.name}
        </div>

        {upgraded && (
          <div className="mt-8 rounded-sm border border-forest bg-forest/[0.04] px-5 py-4 font-serif text-[18px] text-forest">
            Üyeliğiniz <em className="italic text-brass">{upgraded.name}</em> seviyesine yükseltildi.
            Private Market artık açık.
          </div>
        )}

        <div className="mt-14">
          <div className="mb-6 label-eyebrow">Üyelik katmanları</div>
          <UpgradeButtons currentTier={user.tier} />
        </div>
      </div>
    </main>
  );
}
