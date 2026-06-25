import { ScreenTitle, ScreenDivider } from "@/components/ui/PhoneFrame";
import { Pill } from "@/components/ui/primitives";

export function PrivatePreviewScreen() {
  return (
    <div className="-mx-5 -mb-5 flex h-[calc(100%+1.25rem)] flex-col bg-forest-deep px-5 pb-5">
      <div className="mb-2 mt-1.5 text-center font-serif text-[15px] tracking-[0.34em] text-brass-soft">
        PRIVATE PREVIEW
      </div>
      <div className="my-3" style={{ height: 1, background: "linear-gradient(90deg,transparent,#C9A86A,transparent)" }} />
      <div className="mt-7 text-center">
        <div className="mx-auto mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full border border-brass-soft text-[22px] text-brass-soft">
          ⌧
        </div>
        <div className="font-serif text-[22px] leading-tight text-ivory">
          Bu mülk henüz
          <br />
          halka açılmadı.
        </div>
        <p className="mt-3.5 text-[14px] text-ivory/60">
          Sadece <b className="text-brass-soft">12 seçilmiş alıcıya</b> gösteriliyor.
        </p>
      </div>
      <div className="mt-6" style={{ height: 1, background: "linear-gradient(90deg,transparent,#C9A86A,transparent)" }} />
      <div className="mt-2 text-center">
        <span className="label-eyebrow text-brass-soft">VIP First Access</span>
        <div className="mt-2 font-serif text-[18px] text-ivory/90">Halktan 48 saat önce.</div>
      </div>
    </div>
  );
}

export function InvisibleBuyerScreen() {
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>INVISIBLE BUYER</ScreenTitle>
      <ScreenDivider />
      <div className="my-1.5 text-center">
        <div className="mx-auto mb-3.5 flex h-[54px] w-[54px] items-center justify-center rounded-full border border-brass text-[22px] text-brass">
          ◍
        </div>
        <div className="font-serif text-[20px] text-forest-deep">Kimliğiniz gizli.</div>
        <p className="mt-2 text-[14px] text-ink/60">
          Satıcı sizi göremez.
          <br />
          Yalnızca finansal yeterliliğiniz doğrulanır.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-brass/40 bg-white px-3.5 py-3">
        <span className="label-eyebrow text-sage">Doğrulanmış alıcı</span>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-serif text-[17px] text-forest">Yeterlilik</span>
          <Pill tone="forest">✓ Onaylı</Pill>
        </div>
        <div className="mt-2.5 text-[13.5px] text-ink/65">
          Kimlik · gizli &nbsp;|&nbsp; Bütçe · doğrulandı
        </div>
      </div>
    </div>
  );
}

export function NegotiationScreen() {
  const rows: [string, string][] = [
    ["Satıcı motivasyonu", "Yüksek"],
    ["Piyasada kalma", "128 gün"],
    ["Benzer satışlar", "−6%"],
    ["Önerilen teklif", "−8.5%"],
  ];
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>NEGOTIATION SHIELD</ScreenTitle>
      <ScreenDivider />
      <div className="max-w-full rounded-2xl rounded-bl-sm bg-forest px-3.5 py-2.5 text-[14.5px] leading-snug text-ivory">
        Sizin adınıza stratejik bir teklif hazırlıyorum.
      </div>
      <div className="label-eyebrow my-4 text-ink/70">AI analizi</div>
      <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <div className="self-center font-label text-[11px] uppercase tracking-[0.12em] text-ink/70">
              {k}
            </div>
            <div
              className={`text-right font-serif font-medium text-forest ${
                k === "Önerilen teklif" ? "text-[19px]" : "text-[15px]"
              }`}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <ScreenDivider className="mt-4" />
      <div className="label-eyebrow mb-2 text-ink/70">Private Viewing · Cumartesi</div>
      <div className="font-serif text-[15px] leading-[1.8] text-forest">
        10:00 — Villa Solitude
        <br />
        12:00 — Penthouse Noir
        <br />
        15:00 — Residence Eaux
      </div>
    </div>
  );
}
