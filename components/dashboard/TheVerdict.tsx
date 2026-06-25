"use client";

import { useState } from "react";

export function TheVerdict() {
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "streaming" | "done" | "error">("idle");

  async function generate() {
    setText("");
    setState("streaming");
    try {
      const res = await fetch("/api/verdict", { method: "POST" });
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
    <div className="rounded-xl border border-brass/30 bg-forest-deep px-8 py-9 text-ivory">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-label text-[11px] uppercase tracking-[0.28em] text-brass-soft">
            DOMAINE’in Kararı
          </div>
          <h3 className="mt-2 font-serif text-[clamp(24px,3vw,32px)] font-light text-ivory">
            Önce hangisini görmelisiniz?
          </h3>
        </div>
        {state === "idle" || state === "error" ? (
          <button
            onClick={generate}
            className="rounded-sm border border-brass-soft px-6 py-3 font-label text-[11px] uppercase tracking-[0.2em] text-brass-soft transition-colors hover:bg-brass-soft hover:text-forest-deep"
          >
            {state === "error" ? "Tekrar dene" : "Kararı oluştur"}
          </button>
        ) : (
          <span className="font-label text-[11px] uppercase tracking-[0.2em] text-brass-soft">
            {state === "streaming" ? "Değerlendiriliyor…" : "Karar verildi"}
          </span>
        )}
      </div>

      {(state === "streaming" || state === "done") && (
        <div className="mt-6 max-w-[720px] space-y-4">
          {text.split("\n").filter((l) => l.trim() !== "").map((para, i, arr) => (
            <p key={i} className="font-serif text-[18px] leading-relaxed text-ivory/85">
              {para}
              {state === "streaming" && i === arr.length - 1 && (
                <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-brass-soft align-middle" />
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
