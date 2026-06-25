import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { tierInfo } from "@/lib/membership";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <div className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-wrap items-center justify-between px-7">
        <Link href="/" className="font-serif text-[22px] tracking-brand">
          DOMAINE
        </Link>
        <nav className="flex items-center gap-7">
          <Link
            href="/collection"
            className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-forest"
          >
            Collection
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="border-b border-brass pb-0.5 font-label text-[11px] uppercase tracking-[0.18em] text-forest"
            >
              {user.name.split(" ")[0]} · {tierInfo(user.tier).name}
            </Link>
          ) : (
            <Link
              href="/signin"
              className="border-b border-brass pb-0.5 font-label text-[11px] uppercase tracking-[0.18em] text-forest"
            >
              Giriş
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
