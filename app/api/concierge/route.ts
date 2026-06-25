import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { propertyCatalogForPrompt, properties } from "@/data/properties";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM = `Sen DOMAINE'sin — yüksek gelir grubu ve yoğun çalışan profesyoneller için
"old money" estetiğinde, özel bir gayrimenkul concierge'isin. Bir ilan sitesi değil,
kişiye özel bir gayrimenkul zekâ asistanısın.

Marka felsefen: "Zamanını koru. Mahremiyetini koru. Sana özel olanı göster. Prestiji kanıtla."

GÖREVİN: Kullanıcının yaşam tarzını anlamak için sakin, zarif sorular sor; sonra ona
yalnızca aşağıdaki portföyden en uygun mülkleri eşleştir.

KURALLAR:
- Her seferinde TEK bir soru sor. Türkçe, sıcak ama abartısız, "old money" bir tonla.
- Klasik filtre sorma (kaç oda, kaç m²). Yaşam tarzı sor: rutin, mahremiyet, sessizlik,
  misafir, tasarım zevki, yaşam mı yatırım mı.
- En fazla 5 soru sor. Yeterince anladığında present_profile aracını çağır.
- present_profile'da eşleşmeleri SADECE aşağıdaki id'lerden seç ve mantıklı sırala.
  match yüzdesi ve her eşleşmenin somut nedenlerini kullanıcının söylediklerine dayandır.
- Kısa konuş. Tek soru, gereksiz önsöz yok.

PORTFÖY:
${propertyCatalogForPrompt()}`;

const presentProfileTool: Anthropic.Tool = {
  name: "present_profile",
  description:
    "Kullanıcının yaşam profilini ve portföyden sıralanmış mülk eşleşmelerini sun. " +
    "Yeterince soru sorup yaşam tarzını anladığında çağır.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      tier: {
        type: "string",
        description: "Tek kelimelik yaşam profili etiketi, örn. Executive, Aile, Yatırımcı.",
      },
      traits: {
        type: "array",
        description: "3-4 yaşam tarzı ekseni ve 0-100 arası yüzde.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            label: { type: "string" },
            value: { type: "integer" },
          },
          required: ["label", "value"],
        },
      },
      priorities: {
        type: "array",
        description: "Önem sırasına göre 3-4 öncelik.",
        items: { type: "string" },
      },
      matches: {
        type: "array",
        description: "Portföyden sıralanmış eşleşmeler.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              enum: properties.map((p) => p.id),
            },
            match: { type: "integer" },
            reasons: { type: "array", items: { type: "string" } },
          },
          required: ["id", "match", "reasons"],
        },
      },
    },
    required: ["tier", "traits", "priorities", "matches"],
  },
};

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ type: "unconfigured" });
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "geçersiz istek" }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      system: SYSTEM,
      tools: [presentProfileTool],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      return NextResponse.json({ type: "profile", profile: toolUse.input });
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ type: "question", text });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Şu an yoğunuz, bir an sonra tekrar deneyin." }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Concierge ulaşılamıyor (${err.status ?? "?"}).` }, { status: 502 });
    }
    return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
