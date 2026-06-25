"use client";

import { useEffect, useRef, useState } from "react";
import { conciergeFlow } from "@/data/properties";
import { ScreenTitle, ScreenDivider } from "@/components/ui/PhoneFrame";

type Message = { from: "ai" | "me"; text: string };

export function ConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "İyi akşamlar. Size uygun evi bulabilmem için yaşam tarzınızı anlamam gerekiyor — yalnızca beş soru.",
    },
    { from: "ai", text: conciergeFlow[0].q },
  ]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function answer(value: string) {
    const next = step + 1;
    setMessages((m) => [...m, { from: "me", text: value }]);
    window.setTimeout(() => {
      if (next < conciergeFlow.length) {
        setMessages((m) => [...m, { from: "ai", text: conciergeFlow[next].q }]);
        setStep(next);
      } else {
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text: "Teşekkürler. Profiliniz hazır: Executive · Mahremiyet öncelikli. 3 mülk %90+ uyumla eşleşti.",
          },
        ]);
        setDone(true);
      }
    }, 360);
  }

  const current = conciergeFlow[step];

  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>CONCIERGE</ScreenTitle>
      <ScreenDivider />
      <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.from === "ai"
                ? "max-w-[88%] self-start rounded-2xl rounded-bl-sm bg-forest px-3.5 py-2.5 text-[14.5px] leading-snug text-ivory"
                : "max-w-[88%] self-end rounded-2xl rounded-br-sm border border-brass/30 bg-ivory-2 px-3.5 py-2.5 text-[14.5px] leading-snug text-ink"
            }
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 pt-3">
        {!done ? (
          current.options.map((o) => (
            <button
              key={o.value}
              onClick={() => answer(o.value)}
              className="rounded-full border border-brass px-3 py-2 font-label text-[10.5px] uppercase tracking-[0.12em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-ivory"
            >
              {o.chip}
            </button>
          ))
        ) : (
          <span className="label-eyebrow text-sage">Profil tamamlandı →</span>
        )}
      </div>
    </div>
  );
}
