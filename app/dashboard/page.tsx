import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllProperties, getSavedProperties } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { tierInfo, canViewPrivate } from "@/lib/membership";
import { rowToProperty } from "@/lib/property";
import { rankForProfile } from "@/lib/matching";
import { SiteHeader } from "@/components/site/SiteHeader";
import { EstateFacade } from "@/components/art/EstateArt";
import { Pill } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const profile = user.lifestyleProfile;
  const member = canViewPrivate(user.tier);
  const allRows = await getAllProperties();
  const all = allRows.map(rowToProperty);
  const ranked = rankForProfile(profile, all).slice(0, 3);
  const savedRows = await getSavedProperties(user.id);
  const saved = savedRows.map(rowToProperty);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-wrap px-7 py-16">
        {/* Greeting */}
        <div className="label-eyebrow">Sizin DOMAINE’iniz</div>
        <h1 className="mt-3 font-serif text-[clamp(34px,5vw,56px)] font-light leading-none text-forest-deep">
          {greeting()}, {user.name.split(" ")[0]}.
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Pill>Üyelik · {tierInfo(user.tier).name}</Pill>
          <Link href="/account" className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-forest">
            Üyeliği yönet →
          </Link>
        </div>

        {/* Lifestyle DNA */}
        <section className="mt-16">
          <div className="label-eyebrow mb-5">Yaşam DNA’nız</div>
          {profile ? (
            <div className="grid grid-cols-1 gap-x-16 gap-y-2 md:grid-cols-2">
              <div>
                {profile.traits.slice(0, 4).map((t) => (
                  <div key={t.label} className="my-3.5">
                    <div className="mb-1.5 flex items-end justify-between">
                      <span className="font-label text-[10.5px] uppercase tracking-[0.1em] text-ink/70">
                        {t.label}
                      </span>
                      <b className="font-serif text-[14px] text-forest">{t.value}%</b>
                    </div>
                    <div className="h-1 overflow-hidden rounded bg-ivory-2">
                      <div className="gold-track h-full rounded" style={{ width: `${t.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="label-eyebrow text-ink/50">Önceliklerimiz</div>
                <ol className="mt-3">
                  {profile.priorities.map((p, i) => (
                    <li key={p} className="flex items-baseline gap-3 border-t border-ink/8 py-2.5 font-serif text-[18px] text-forest">
                      <span className="font-label text-[11px] text-brass">{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-ink/12 px-7 py-8">
              <p className="font-serif text-[20px] text-forest-deep">
                Henüz yaşam profilinizi çıkarmadınız.
              </p>
              <p className="mt-2 text-[16px] text-ink/60">
                AI Concierge ile birkaç soruyu yanıtlayın; sonra her ev sizin için kişiselleşsin.
              </p>
              <Link
                href="/#concierge"
                className="mt-5 inline-block rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep"
              >
                Concierge ile başla
              </Link>
            </div>
          )}
        </section>

        {/* Personalized matches from the live DB */}
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <div className="label-eyebrow">Sizin için seçildi</div>
              <h2 className="mt-2 font-serif text-[clamp(26px,3.5vw,38px)] font-light text-forest-deep">
                {profile ? "Profilinize göre sıralandı" : "Portföyden öne çıkanlar"}
              </h2>
            </div>
            <Link href="/collection" className="font-label text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-forest">
              Tümü →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {ranked.map((m) => (
              <MatchCard
                key={m.property.id}
                id={m.property.id}
                name={m.property.name}
                district={m.property.district}
                city={m.property.city}
                hue={m.property.hue}
                score={m.score}
                reasons={m.reasons}
                offMarket={m.property.offMarket}
                locked={m.property.offMarket && !member}
              />
            ))}
          </div>
        </section>

        {/* Saved */}
        <section className="mt-16">
          <div className="label-eyebrow mb-6">Koleksiyonunuz</div>
          {saved.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {saved.map((p) => (
                <MatchCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  district={p.district}
                  city={p.city}
                  hue={p.hue}
                  score={p.match}
                  reasons={p.reasons.slice(0, 2)}
                  offMarket={p.offMarket}
                  locked={p.offMarket && !member}
                />
              ))}
            </div>
          ) : (
            <p className="text-[16px] text-ink/55">
              Henüz ev kaydetmediniz. Portföyde ✧ simgesine dokunarak koleksiyonunuza ekleyin.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

function MatchCard({
  id,
  name,
  district,
  city,
  hue,
  score,
  reasons,
  offMarket,
  locked,
}: {
  id: string;
  name: string;
  district: string;
  city: string;
  hue: number;
  score: number;
  reasons: string[];
  offMarket: boolean;
  locked: boolean;
}) {
  return (
    <Link
      href={`/property/${id}`}
      className="group overflow-hidden rounded-xl border border-brass/25 bg-white transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(20,36,28,0.35)]"
    >
      <div className="relative h-[160px]">
        <div className={locked ? "h-full blur-[5px]" : "h-full"}>
          <EstateFacade hue={hue} className="h-full w-full" />
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          {offMarket && <Pill tone="soft">Off-market</Pill>}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-forest-deep/70 px-2.5 py-1 font-serif text-[13px] text-brass-soft backdrop-blur">
          {score}%
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-forest-deep/45">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-brass-soft">⌧ Privé</span>
          </div>
        )}
      </div>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[20px] text-forest-deep">{name}</h3>
        </div>
        <div className="mt-1 label-eyebrow text-sage">
          {district} · {city}
        </div>
        <div className="mt-3 text-[13px] leading-snug text-ink/60">
          {reasons.map((r) => `+ ${r}`).join("  ")}
        </div>
      </div>
    </Link>
  );
}
