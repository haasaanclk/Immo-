"use client";

import { useState } from "react";

export function IntelligenceReport({
  propertyId,
  personalized,
  userName,
  signedIn,
}: {
  propertyId: string;
  personalized: boolean;
  userName?: string;
  signedIn: boolean;
}) {
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "streaming" | "done" | "error">("idle");

  async function generate() {
    setText("");
    setState("streaming");
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      if (!res.ok || !res.body) {
        setState("error");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setText(acc);
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="mt-16 border-t border-ink/10 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow">DOMAINE Intelligence</div>
          <h2 className="mt-2 font-serif text-[clamp(26px,3.5vw,38px)] font-light text-forest-deep">
            Size özel zekâ raporu
          </h2>
          <p className="mt-2 max-w-[560px] text-[16px] text-ink/60">
            {personalized
              ? `${userName ? userName.split(" ")[0] + ", " : ""}yaşam profilinize göre bu evi sizin adınıza analiz ediyorum — yatırım tezi, müzakere stratejisi ve karar.`
              : signedIn
                ? "Concierge ile yaşam profilinizi çıkarırsanız bu rapor tamamen size özel hale gelir."
                : "Üst segment bir profil için hazırlanır; giriş yapıp profilinizi çıkarırsanız kişiselleşir."}
          </p>
        </div>
        {state === "idle" || state === "error" ? (
          <button
            onClick={generate}
            className="rounded-sm bg-forest px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest-deep"
          >
            {state === "error" ? "Tekrar dene" : "Raporu oluştur"}
          </button>
        ) : (
          <span className="font-label text-[11px] uppercase tracking-[0.2em] text-brass">
            {state === "streaming" ? "Analiz ediliyor…" : "Tamamlandı"}
          </span>
        )}
      </div>

      {(state === "streaming" || state === "done") && (
        <div className="mt-8 max-w-[760px]">
          <Rendered text={text} streaming={state === "streaming"} />
        </div>
      )}

      {personalized && (
        <div className="mt-8 inline-block rounded-full border border-brass/40 px-4 py-1.5 font-label text-[9.5px] uppercase tracking-[0.18em] text-brass">
          ✦ Yaşam profilinize göre kişiselleştirildi
        </div>
      )}
    </section>
  );
}

function Rendered({ text, streaming }: { text: string; streaming: boolean }) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        if (line.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="mb-2 mt-7 font-label text-[11px] uppercase tracking-[0.22em] text-brass first:mt-0"
            >
              {line.slice(3)}
            </h3>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="font-serif text-[18px] leading-relaxed text-ink/80">
            {line}
            {streaming && last && (
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-brass align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}
