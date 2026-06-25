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

### Mimari
- **`app/`** — App Router. `layout.tsx` (next/font ile Cormorant/EB Garamond/Jost), `page.tsx` tüm bölümleri kurar.
- **`tailwind.config.ts`** — "old money" tasarım token'ları (ivory · forest · brass · burgundy · sage) ve tipografi.
- **`data/properties.ts`** — mülk veri modeli, concierge akışı ve iç mekân tarzları (tek doğruluk kaynağı).
- **`components/`**
  - `ui/` — PhoneFrame, Gallery, Bar/Pill/Gauge gibi tasarım primitifleri
  - `art/EstateArt.tsx` — **kendi kendine yeten SVG görseller**: mülk cephesi + iç mekân sahnesi (harici fotoğraf/ağ gerektirmez, çevrimdışı çalışır)
  - `screens/` — Concierge (interaktif), Lifestyle, DNA, Privacy, Silence/Health, Private Market, **AI Interior Designer (canlı tarz değiştirici)**
  - `sections/` — TopBar, Hero, Tiers, Palette, Footer

### Hızlı statik önizleme
`prototype/index.html` dosyasını tarayıcıda açın — kurulum gerektirmez. Concierge
ekranındaki seçenekleri tıklayarak AI'nin yaşam profilini nasıl çıkardığını görün.

## Konseptin kalbi
**AI kişilik analizi + Ev DNA + Dijital Ev Pasaportu + Gizli Teklif + Lüks yaşam eşleştirme.**

Üç katman, tek uygulama: **Résident** (orta kesim) · **Privé** (premium) · **Cercle Noir** (UHNW, davetiye).

İlk pazarlar: München · Zürich · Wien · Dubai · London.
