# DOMAINE
### Private AI Real Estate Concierge — "Old Money" Konsept

> *Your Time. Your Privacy. Your Property.*
> **Ev aramazsınız. Size ait olanı keşfedersiniz.**

Bir ilan sitesi değil — **kişiye özel gayrimenkul karar sistemi.** Yoğun çalışan
profesyoneller ve yüksek gelir grubu için, "old money" estetiğinde, AI destekli
bir gayrimenkul concierge konsepti.

## İçerik
| Dosya / Klasör | Açıklama |
|---|---|
| **[CONCEPT.md](CONCEPT.md)** | Tam konsept & marka kitabı: felsefe, görsel kimlik, üyelik katmanları, özellikler, pazar stratejisi |
| **`app/`, `components/`, `data/`** | **Çalışan uygulama** — Next.js 14 + TypeScript + Tailwind. Tasarım gerçek bileşenlere dönüştürüldü. |
| **[prototype/index.html](prototype/index.html)** | Tek dosyalık statik prototip (hızlı önizleme — kurulum gerekmez) |

## Uygulamayı çalıştırma (Next.js)
```bash
npm install
npm run dev      # http://localhost:3000
# üretim derlemesi:
npm run build && npm run start
```

## ⭐ Kişisel Panel — "Sizin DOMAINE'iniz"
`/dashboard` her şeyi tek deneyimde toplar:
- **Yaşam DNA'nız** — concierge'ün çıkardığı profil (eksenler + öncelikler)
- **Sizin için seçildi** — `lib/matching.ts` profilinizi canlı DB portföyüne karşı puanlar
  (öncelik + eksen ağırlıkları → 0-100 uyum), kişisel gerekçelerle sıralar
- **Koleksiyonunuz** — kaydettiğiniz mülkler (`saved_properties`)
- **DOMAINE'in Kararı** — Claude, en iyi eşleşmelerinizi profilinize karşı karşılaştırıp
  *önce hangisini görmeniz gerektiğine* dair akan, kararlı bir tavsiye verir (`/api/verdict`)

Kaydetme (`✧/✦`) hem portföy kartlarında hem mülk detayında çalışır (`/api/saved`).

## ⭐ Akıllı Finans — niceliksel karar zekâsı
Her mülk sayfasında interaktif **özel finansal zekâ** (`components/detail/FinanceModule.tsx`):
peşinat/vade/faiz sürgüleriyle aylık kredi ödemesi, toplam sahip olma maliyeti
(bakım + enerji + vergi), bütçeye göre uygunluk kararı ve **10 yıllık değer projeksiyonu**
(mülkün yatırım DNA'sına bağlı büyüme oranı). Tümü anlık, deterministik. Mülklere gerçek
**fiyat** alanı eklendi.

## ⭐ DOMAINE Intelligence — kişiselleştirilmiş AI danışman
Ürünün kalbi. Giriş yapmış kullanıcının concierge ile çıkardığı **yaşam profili DB'ye
kaydedilir** (`users.lifestyle_profile`); her mülk sayfasında Claude, bu profile göre
**akan (streaming)** bir zekâ raporu üretir:
**Yaşam Uyumu · Yatırım Tezi · Müzakere Stratejisi · Riskler · Karar** — kullanıcının
adına, önceliklerine ve mülkün gerçek verisine bağlı, somut tekliflerle.

- `app/api/intelligence/route.ts` — Claude streaming; anahtar yoksa veriden sentezlenen
  rapor aynı "yazılıyor" etkisiyle akar.
- `app/api/profile/route.ts` — concierge profilini kullanıcıya kaydeder.
- `components/detail/IntelligenceReport.tsx` — canlı stream + zarif markdown render.

## ⭐ Canlı AI Interior Designer (Atelier)
Serbest metinle ("bu evi İskandinav yap, çalışma köşesi ekle") Claude gerçek bir yeniden
tasarım üretir: HEX paleti, malzemeler, maliyet, ev değerine etki ve gerekçe — oda anında
yeniden render olur. `app/api/atelier/route.ts` (anahtar yoksa anahtar-kelime eşleştiren
demo). Üç hazır tarz çipi de korunur.

## Gerçek AI Concierge (Claude)
Concierge ekranı gerçek **Claude** ile çalışır (`claude-opus-4-8`). Kullanıcının
yaşam tarzı yanıtlarını gerçek bir sohbetle alır ve `present_profile` aracıyla
yapılandırılmış bir yaşam profili + portföyden sıralanmış eşleşmeler üretir.

```bash
cp .env.local.example .env.local
# .env.local içine ANTHROPIC_API_KEY=sk-ant-... ekleyin
npm run dev
```

- API anahtarı **varsa**: concierge canlı Claude'a bağlanır (`app/api/concierge/route.ts`).
- API anahtarı **yoksa**: uygulama otomatik olarak senaryolu **demo akışı**na düşer —
  hiçbir şey bozulmaz, sorular yine yanıtlanıp profil üretilir.

## Veritabanı · Üyelik · Ödeme
| Katman | Teknoloji | Davranış |
|---|---|---|
| **Veritabanı** | Drizzle ORM + **libSQL** | İlk çalışmada otomatik tablo + portföy seed'i. Yerelde dosya (`file:`), üretimde **Turso** bulut (`libsql://`) — **Vercel'e hazır** (bkz. [DEPLOY.md](DEPLOY.md)). |
| **Kimlik** | bcrypt + JWT (`jose`) httpOnly cookie | Kayıt / giriş / çıkış. Tier her zaman DB'den okunur (stale cookie yok). |
| **Üyelik** | `lib/membership.ts` | Résident / Privé / Cercle Noir. Off-market mülkler Privé+ gerektirir. |
| **Ödeme** | Stripe Checkout | Anahtar **varsa** gerçek Checkout; **yoksa** demo yükseltme anında uygulanır. |

Sayfalar: `/` (landing) · `/collection` (DB portföy) · `/property/[id]` (gated detay) ·
`/account` (üyelik) · `/signin` (kimlik).

**Yayına alma:** [DEPLOY.md](DEPLOY.md) — Vercel + Turso + Stripe adımları.

```bash
cp .env.local.example .env.local   # ANTHROPIC_API_KEY, AUTH_SECRET, STRIPE_* (hepsi opsiyonel)
npm run dev
```

### Mimari
- **`app/`** — App Router. `layout.tsx` (next/font), `page.tsx` landing, `api/` (concierge, auth, checkout, stripe webhook), `collection` · `property/[id]` · `account` · `signin` sayfaları.
- **`db/`** — Drizzle schema + client (auto-init/seed) + veri erişim fonksiyonları.
- **`lib/`** — `auth.ts` (oturum), `current-user.ts` (DB'den tier), `membership.ts` (katmanlar + gating), `property.ts` (DB→view mapper).
- **`tailwind.config.ts`** — "old money" tasarım token'ları (ivory · forest · brass · burgundy · sage) ve tipografi.
- **`data/properties.ts`** — mülk veri modeli, concierge akışı ve iç mekân tarzları (tek doğruluk kaynağı).
- **`components/`**
  - `ui/` — PhoneFrame, Gallery, Bar/Pill/Gauge gibi tasarım primitifleri
  - `art/EstateArt.tsx` — **kendi kendine yeten SVG görseller**: mülk cephesi + iç mekân sahnesi (harici fotoğraf/ağ gerektirmez, çevrimdışı çalışır)
  - `screens/` — **ConciergeLive (gerçek Claude sohbeti + demo fallback)**, Lifestyle, DNA, Privacy, Silence/Health, Private Market, **AI Interior Designer (canlı tarz değiştirici)**
  - `sections/` — TopBar, Hero, Tiers, Palette, Footer

### Hızlı statik önizleme
`prototype/index.html` dosyasını tarayıcıda açın — kurulum gerektirmez. Concierge
ekranındaki seçenekleri tıklayarak AI'nin yaşam profilini nasıl çıkardığını görün.

## Konseptin kalbi
**AI kişilik analizi + Ev DNA + Dijital Ev Pasaportu + Gizli Teklif + Lüks yaşam eşleştirme.**

Üç katman, tek uygulama: **Résident** (orta kesim) · **Privé** (premium) · **Cercle Noir** (UHNW, davetiye).

İlk pazarlar: München · Zürich · Wien · Dubai · London.
