import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface DesignResult {
  name: string;
  description: string;
  palette: { wall: string; floor: string; accent: string; textile: string };
  materials: string[];
  cost: string;
  valueImpact: string;
  rationale: string;
}

const designTool: Anthropic.Tool = {
  name: "present_design",
  description: "Bir iç mekân yeniden tasarımını yapılandırılmış olarak sun.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string", description: "Tarzın kısa adı, örn. 'Sıcak İskandinav'." },
      description: { type: "string", description: "Bir cümlelik his tanımı." },
      palette: {
        type: "object",
        additionalProperties: false,
        properties: {
          wall: { type: "string", description: "Duvar HEX rengi, örn. #E7E0D2" },
          floor: { type: "string", description: "Zemin HEX" },
          accent: { type: "string", description: "Vurgu HEX (pirinç/metal/ahşap)" },
          textile: { type: "string", description: "Tekstil/mobilya HEX" },
        },
        required: ["wall", "floor", "accent", "textile"],
      },
      materials: { type: "array", items: { type: "string" }, description: "3-5 malzeme/öğe." },
      cost: { type: "string", description: "Tahmini maliyet, örn. '~95.000 €'." },
      valueImpact: { type: "string", description: "Ev değerine etki, örn. '+%4'." },
      rationale: { type: "string", description: "Bir cümle: neden bu müşteriye uygun." },
    },
    required: ["name", "description", "palette", "materials", "cost", "valueImpact", "rationale"],
  },
};

const PRESETS: { keys: string[]; d: DesignResult }[] = [
  {
    keys: ["japandi", "sıcak", "doğal", "kil"],
    d: {
      name: "Japandi",
      description: "Sıcak minimalizm — doğal ahşap, kil tonları, sakin ışık.",
      palette: { wall: "#E7E0D2", floor: "#C9A86A", accent: "#6F5B43", textile: "#A8A293" },
      materials: ["Açık meşe", "El dokuması keten", "Kağıt avize", "Mat seramik"],
      cost: "~80.000 €",
      valueImpact: "+%3",
      rationale: "Sessiz, sıcak ve düşük uyarımlı; yoğun çalışan bir zihne huzur verir.",
    },
  },
  {
    keys: ["old money", "klasik", "lüks", "prestij", "şişe yeşili", "pirinç"],
    d: {
      name: "Old Money",
      description: "Şişe yeşili, pirinç detay, koyu meşe — köklü ve sessiz prestij.",
      palette: { wall: "#23362B", floor: "#3A2A1E", accent: "#B08D57", textile: "#1E3A2F" },
      materials: ["Koyu meşe parke", "Pirinç armatür", "Kadife döşeme", "Mermer şömine"],
      cost: "~140.000 €",
      valueImpact: "+%5",
      rationale: "Kalıcı, statü çağrıştıran malzemeler yeniden satışta prim sağlar.",
    },
  },
  {
    keys: ["minimal", "beyaz", "modern", "sade"],
    d: {
      name: "Minimal",
      description: "Saf beyaz, gizli depolama, tek bir mimari jest.",
      palette: { wall: "#F4F1EA", floor: "#D8D2C5", accent: "#1C1B19", textile: "#EBE5D8" },
      materials: ["Mikrobeton zemin", "Gizli dolaplar", "Çizgisel LED", "Mat lake yüzeyler"],
      cost: "~55.000 €",
      valueImpact: "+%2",
      rationale: "Zamansız sadelik geniş bir alıcı kitlesine hitap eder.",
    },
  },
  {
    keys: ["iskandinav", "scandi", "nordic", "açık ahşap"],
    d: {
      name: "Sıcak İskandinav",
      description: "Açık ahşap, kar beyazı, yumuşak yün — aydınlık ve nefes alan.",
      palette: { wall: "#F1ECE3", floor: "#D9C3A3", accent: "#8A9A86", textile: "#C7C2B6" },
      materials: ["Huş kontrplak", "Yün kilim", "Mat cam aydınlatma", "Açık tonlu meşe"],
      cost: "~70.000 €",
      valueImpact: "+%3",
      rationale: "Doğal ışığı çoğaltır; sessiz ve dengeli bir yaşam isteyene ideal.",
    },
  },
  {
    keys: ["endüstriyel", "industrial", "loft", "beton", "metal"],
    d: {
      name: "Rafine Endüstriyel",
      description: "Ham beton, kararmış çelik, deri — şehirli ve karakterli.",
      palette: { wall: "#3A3A38", floor: "#52504B", accent: "#B08D57", textile: "#2B2A28" },
      materials: ["Cilalı beton", "Kararmış çelik", "Aniline deri", "Açık tesisat"],
      cost: "~95.000 €",
      valueImpact: "+%3",
      rationale: "Penthouse ve loft tipolojisinde güçlü, ayırt edici bir kimlik kurar.",
    },
  },
];

function demoDesign(prompt: string): DesignResult {
  const q = prompt.toLowerCase();
  // Score each preset by how many of its keywords appear; most specific wins.
  let best = PRESETS[2].d; // minimal default
  let bestScore = 0;
  for (const p of PRESETS) {
    const score = p.keys.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = p.d;
    }
  }
  return best;
}

export async function POST(req: Request) {
  const { prompt, propertyName } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Bir istek yazın." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ mode: "demo", design: demoDesign(prompt) });
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 900,
      system:
        "Sen DOMAINE'nin AI iç mimarısın. Kullanıcının isteğine göre üst segment, " +
        "uygulanabilir bir yeniden tasarım üret. HEX renkleri gerçekçi ve uyumlu seç. " +
        "Maliyet ve ev değerine etkiyi gerçekçi ver. Türkçe yaz.",
      tools: [designTool],
      tool_choice: { type: "tool", name: "present_design" },
      messages: [
        {
          role: "user",
          content: `Mülk: ${propertyName ?? "lüks konut"}. İstek: ${prompt}`,
        },
      ],
    });
    const tool = response.content.find((b) => b.type === "tool_use");
    if (tool && tool.type === "tool_use") {
      return NextResponse.json({ mode: "ai", design: tool.input as DesignResult });
    }
    return NextResponse.json({ mode: "demo", design: demoDesign(prompt) });
  } catch {
    return NextResponse.json({ mode: "demo", design: demoDesign(prompt) });
  }
}
