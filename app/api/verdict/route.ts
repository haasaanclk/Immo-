import Anthropic from "@anthropic-ai/sdk";
import { getAllProperties } from "@/db";
import { getCurrentUser } from "@/lib/current-user";
import { rowToProperty } from "@/lib/property";
import { rankForProfile, type RankedMatch } from "@/lib/matching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function prompt(name: string, hasProfile: boolean, top: RankedMatch[], priorities: string[]) {
  const lines = top
    .map(
      (m, i) =>
        `${i + 1}. ${m.property.name} (${m.property.district}, ${m.property.city}) — uyum %${m.score}; ` +
        `mahremiyet ${m.property.privacyLevel}/10, prestij ${m.property.prestigeScore}, ` +
        `yatırım ${m.property.dna.investment}/10, gece ${m.property.silence.night}dB, ` +
        `${m.property.offMarket ? "off-market" : "halka açık"}.`,
    )
    .join("\n");
  return (
    `Müşteri: ${name}. ${hasProfile ? `Öncelikleri: ${priorities.join(", ")}.` : "Profil henüz yok; üst segment varsay."}\n\n` +
    `Aday mülkler:\n${lines}\n\n` +
    `Bu müşteriye, bu adaylar arasından HANGİSİNİ ÖNCE görmesi gerektiğine dair net bir karar ver. ` +
    `Tek bir mülk seç, 2 kısa paragrafta gerekçelendir: neden bu, diğerlerinden farkı ne, sonraki adım ne. ` +
    `Kararlı ve somut ol; Türkçe yaz. Başlık kullanma.`
  );
}

function demoVerdict(name: string, top: RankedMatch[]): string {
  const [first, second] = top;
  const f = first.property;
  return (
    `${name}, adaylarınız arasında önce ${f.name}'ı görmenizi öneririm. ` +
    `%${first.score} uyumla başı çekiyor: mahremiyet ${f.privacyLevel}/10 ve gece ${f.silence.night} dB sessizliği, ` +
    `${f.reasons[0]?.toLowerCase() ?? "konum kalitesi"} ile birleşince önceliklerinizi en eksiksiz karşılayan seçenek bu. ` +
    `${f.offMarket ? "Off-market olması rekabeti sınırlıyor; erken hareket avantaj sağlar." : "Halka açık; hızlı ama disiplinli ilerleyin."}\n\n` +
    (second
      ? `${second.property.name} (%${second.score}) güçlü bir ikinci; özellikle ${second.property.dna.investment >= f.dna.investment ? "yatırım getirisinde öne çıkıyor" : "konumuyla dikkat çekiyor"}. ` +
        `Yine de ${f.name}'ın dengeli profili, ilk özel gösterimi hak ediyor. Önerim: bu hafta ${f.name} için randevu, ardından ${second.property.name}'ı kıyas için planlayın.`
      : `İlk özel gösteriminizi ${f.name} için ayarlayın.`)
  );
}

async function* chunk(text: string) {
  for (const t of text.split(/(\s+)/)) {
    yield t;
    await new Promise((r) => setTimeout(r, 14));
  }
}

export async function POST() {
  const user = await getCurrentUser();
  const name = user?.name ?? "Sayın misafirimiz";
  const profile = user?.lifestyleProfile ?? null;

  const all = (await getAllProperties()).map(rowToProperty);
  const top = rankForProfile(profile, all).slice(0, 3);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (process.env.ANTHROPIC_API_KEY) {
          const client = new Anthropic();
          const ms = client.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 900,
            system:
              "Sen DOMAINE'nin kıdemli danışmanısın — old money zarafetinde, kararlı ve dürüst. " +
              "Müşteriye hangi mülkü önce görmesi gerektiğine dair net bir karar verirsin.",
            messages: [
              { role: "user", content: prompt(name, !!profile, top, profile?.priorities ?? []) },
            ],
          });
          for await (const event of ms) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } else {
          for await (const piece of chunk(demoVerdict(name, top))) {
            controller.enqueue(encoder.encode(piece));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("Karar şu an oluşturulamadı."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
