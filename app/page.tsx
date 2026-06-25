import { TopBar, Hero, Footer } from "@/components/sections/Chrome";
import { Tiers, Palette, FeatureStrip } from "@/components/sections/Tiers";
import { SectionHead } from "@/components/ui/primitives";
import { Gallery, GalleryItem } from "@/components/ui/Gallery";
import { ConciergeChat } from "@/components/screens/ConciergeChat";
import {
  LifestyleScreen,
  CuratedScreen,
  DNAScreen,
  PrivacyScreen,
  SilenceHealthScreen,
} from "@/components/screens/IntelligenceScreens";
import {
  PrivatePreviewScreen,
  InvisibleBuyerScreen,
  NegotiationScreen,
} from "@/components/screens/PrivateScreens";
import { InteriorDesigner } from "@/components/screens/InteriorDesigner";

export default function Home() {
  return (
    <main>
      <TopBar />
      <Hero />

      {/* 01 — CONCIERGE */}
      <section id="concierge" className="py-24">
        <div className="mx-auto max-w-wrap px-7">
          <SectionHead eyebrow="01 — Zamanımı kurtar" title="AI Property Concierge">
            5.000 ilan gezmezsiniz. Yapay zekâ filtre sormaz — yaşam tarzınızı
            anlar ve sizin yerinize çalışır.
          </SectionHead>
          <Gallery>
            <GalleryItem
              eyebrow="Adım 1"
              title="Yaşam görüşmesi"
              caption="Tıklayın — AI'nin profilinizi nasıl çıkardığını görün."
            >
              <ConciergeChat />
            </GalleryItem>
            <GalleryItem
              eyebrow="Adım 2"
              title="Lifestyle Profile"
              caption="Filtre değil, bir karakter. Evler buna göre sıralanır."
              time="9:43"
            >
              <LifestyleScreen />
            </GalleryItem>
            <GalleryItem
              eyebrow="Adım 3"
              title="Yaşam senaryosu"
              caption="Her öneride “Neden?” gerekçesiyle. Ev değil, hayat."
              time="9:44"
            >
              <CuratedScreen />
            </GalleryItem>
          </Gallery>
        </div>
      </section>

      {/* 02 — INTELLIGENCE */}
      <section id="intelligence" className="bg-ivory-2 py-24">
        <div className="mx-auto max-w-wrap px-7">
          <SectionHead
            eyebrow="02 — Prestiji ve kaliteyi kanıtla"
            title="Property Intelligence"
          >
            Banka ekstresi sadeliğinde raporlar. Sayfayı doldurmak için değil —
            karar vermek için.
          </SectionHead>
          <Gallery>
            <GalleryItem
              eyebrow="DNA Report"
              title="Ev DNA"
              caption="Mimari, malzeme, lokasyon, prestij — tek sayfada."
              time="10:02"
            >
              <DNAScreen />
            </GalleryItem>
            <GalleryItem
              eyebrow="Privacy"
              title="Mahremiyet"
              caption="Komşu mesafesi, görünürlük, drone taraması, giriş güvenliği."
              time="10:03"
            >
              <PrivacyScreen />
            </GalleryItem>
            <GalleryItem
              eyebrow="Silence · Health"
              title="Sessizlik & Sağlık"
              caption="Ses haritası ve evin tam check-up raporu."
              time="10:05"
            >
              <SilenceHealthScreen />
            </GalleryItem>
          </Gallery>
        </div>
      </section>

      {/* 03 — PRIVATE MARKET */}
      <section id="private" className="py-24">
        <div className="mx-auto max-w-wrap px-7">
          <SectionHead eyebrow="03 — Mahremiyetimi koru" title="The Private Market">
            Yüksek gelir grubunda mahremiyet bir değerdir. Herkese açık ilan yok —
            yalnızca onaylı alıcılar.
          </SectionHead>
          <Gallery>
            <GalleryItem
              eyebrow="First Access"
              title="Gizli portföy"
              caption="Onaylı alıcılar, gizli teklif, 48 saat erken erişim."
              time="11:20"
              dark
            >
              <PrivatePreviewScreen />
            </GalleryItem>
            <GalleryItem
              eyebrow="Anonymity"
              title="Görünmez alıcı"
              caption="“İstediğim ev” bilgisi yayılmaz. Sadece yeterlilik görünür."
              time="11:22"
            >
              <InvisibleBuyerScreen />
            </GalleryItem>
            <GalleryItem
              eyebrow="Strategy"
              title="Negotiation Shield"
              caption="AI stratejik teklif kurar, gösterim rotanızı planlar."
              time="11:25"
            >
              <NegotiationScreen />
            </GalleryItem>
          </Gallery>
        </div>
      </section>

      {/* 04 — ATELIER / INTERIOR DESIGNER */}
      <section id="atelier" className="bg-ivory-2 py-24">
        <div className="mx-auto max-w-wrap px-7">
          <SectionHead eyebrow="04 — Hayalini gör" title="Atelier — AI Interior Designer">
            Mülkü almadan önce yaşamını gör. Tek cümleyle tarzı değiştir;
            maliyetini ve ev değerine etkisini anında öğren.
          </SectionHead>
          <InteriorDesigner />
        </div>
      </section>

      <FeatureStrip />
      <Tiers />
      <Palette />
      <Footer />
    </main>
  );
}
