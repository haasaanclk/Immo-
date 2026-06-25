import Anthropic from "@anthropic-ai/sdk";
import { getPropertyById } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { rowToProperty } from "@/lib/property";
import type { Property } from "@/data/properties";
import type { LifestyleProfile } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function buildPrompt(property: Property, profile: LifestyleProfile | null, name: string) {
  const p = property;
  const who = profile
    ? `Müşteri: ${name}. Yaşam profili: ${profile.tier}. ` +
      `Eksenler: ${profile.traits.map((t) => `${t.label} %${t.value}`).join(", ")}. ` +
      `Öncelikler: ${profile.priorities.join(", ")}.`
    : `Müşteri henüz yaşam profilini çıkarmadı; genel ama üst segment bir profil varsay.`;

  return (
    `${who}\n\n` +
    `Mülk: ${p.name}, ${p.district} (${p.city}).\n` +
    `DNA — mimari ${p.dna.architecture}, malzeme ${p.dna.materials}, lokasyon ${p.dna.location}, ` +
    `mahremiyet ${p.dna.privacy}, enerji ${p.dna.energy}, yatırım ${p.dna.investment}.\n` +
    `Prestij ${p.prestigeScore}, mahremiyet ${p.privacyLevel}/10, ` +
    `sessizlik gündüz ${p.silence.day}dB / gece ${p.silence.night}dB. ` +
    `${p.offMarket ? "Off-market (gizli portföy)." : "Halka açık."} ` +
    `Öne çıkanlar: ${p.reasons.join(", ")}.\n\n` +
    `Bu müşteriye özel, kişiselleştirilmiş bir gayrimenkul zekâ raporu yaz. ` +
    `Tam olarak şu beş başlığı kullan ve her birini "## " ile başlat:\n` +
    `## Yaşam Uyumu\n## Yatırım Tezi\n## Müzakere Stratejisi\n## Riskler\n## Karar\n\n` +
    `Müşterinin önceliklerine doğrudan bağlan, somut ol, sayıları kullan. ` +
    `Müzakere Stratejisi'nde önerilen teklif yüzdesi ver. Karar tek paragraf olsun.`
  );
}

const SYSTEM =
  `Sen DOMAINE'nin kıdemli gayrimenkul danışmanısın — "old money" zarafetinde, ` +
  `keskin ve dürüst. Türkçe yaz, sakin ama yetkin bir tonla. Abartı yok, kanıt var. ` +
  `Markdown başlıkları (## ) ve kısa paragraflar kullan.`;

function demoReport(p: Property, profile: LifestyleProfile | null, name: string): string {
  const topTrait = profile?.traits?.slice().sort((a, b) => b.value - a.value)[0];
  const offerPct = p.offMarket ? 4 : Math.round((100 - p.prestigeScore) / 8 + 5);
  const who = profile ? name : "Sayın misafirimiz";
  return [
    `## Yaşam Uyumu`,
    `${who}, ${p.name} sizin yaşam ritminize güçlü biçimde oturuyor. ${p.district} (${p.city}), ${p.reasons[0].toLowerCase()} ve ${p.reasons[1]?.toLowerCase() ?? "sakin doku"} ile öne çıkıyor.${topTrait ? ` Profilinizde en belirgin eksen "${topTrait.label}" (%${topTrait.value}); bu mülkün mahremiyet skoru ${p.privacyLevel}/10 ve gece ${p.silence.night} dB sessizliği bu beklentiyi doğrudan karşılıyor.` : ` Mahremiyet ${p.privacyLevel}/10, gece ${p.silence.night} dB — ultra sessiz bir bölge.`}`,
    ``,
    `## Yatırım Tezi`,
    `Prestij skoru ${p.prestigeScore} ve yatırım göstergesi ${p.dna.investment}/10 ile orta-uzun vadede değer korumanın ötesinde, ${p.city} üst segmentinde nadirlik primi taşıyor. Lokasyon kalitesi ${p.dna.location}/10 ve enerji sınıfı ${p.dna.energy}, hem kullanım hem yeniden satışta avantaj sağlar.`,
    ``,
    `## Müzakere Stratejisi`,
    `${p.offMarket ? "Mülk gizli portföyde; rekabet sınırlı ve satıcı motivasyonu okunabilir." : "Halka açık; karşılaştırılabilir satışlar üzerinden çapa kurun."} Benzer işlemler ışığında açılış teklifini liste değerinin yaklaşık %${offerPct} altında konumlandırmanızı öneririm. Mahremiyet ve sessizlik raporlarını müzakere kaldıracı olarak kullanın; satıcıya "doğrulanmış, hazır alıcı" sinyali verin.`,
    ``,
    `## Riskler`,
    `Çatı durumu "${p.checkup.roof}" — devir öncesi bağımsız ekspertiz isteyin. ${p.dna.materials < 9 ? `Malzeme skoru ${p.dna.materials}/10; bazı detaylarda yenileme bütçesi ayırın.` : "Malzeme kalitesi yüksek; sürpriz beklenmez."} Likidite, bu segmentte ortalamadan yavaştır.`,
    ``,
    `## Karar`,
    `${who} için ${p.name}, ${profile ? "profilinizle" : "üst segment bir yaşam tezi ile"} %${p.match} uyum gösteriyor: mahremiyet, mimari kalite ve değer korumayı aynı anda sunan ender bir bileşim. Önerim — özel gösterim planlayın ve yukarıdaki teklif aralığıyla ilerleyin.`,
  ].join("\n");
}

async function* chunkText(text: string): AsyncGenerator<string> {
  const tokens = text.split(/(\s+)/);
  for (const t of tokens) {
    yield t;
    await new Promise((r) => setTimeout(r, 12));
  }
}

export async function POST(req: Request) {
  const { propertyId } = await req.json().catch(() => ({}));
  const row = propertyId ? await getPropertyById(propertyId) : null;
  if (!row) return new Response("Mülk bulunamadı.", { status: 404 });

  const property = rowToProperty(row);
  const user = await getCurrentUser();
  const profile = user?.lifestyleProfile ?? null;
  const name = user?.name ?? "misafir";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (process.env.ANTHROPIC_API_KEY) {
          const client = new Anthropic();
          const ms = client.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 1400,
            system: SYSTEM,
            messages: [{ role: "user", content: buildPrompt(property, profile, name) }],
          });
          for await (const event of ms) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } else {
          for await (const piece of chunkText(demoReport(property, profile, name))) {
            controller.enqueue(encoder.encode(piece));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n_Rapor şu an oluşturulamadı._"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
