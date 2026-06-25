"use client";

import { useEffect, useRef, useState } from "react";
import { conciergeFlow, lifestyleProfile, properties } from "@/data/properties";
import { ScreenTitle, ScreenDivider } from "@/components/ui/PhoneFrame";

type Display = { from: "ai" | "me"; text: string };
type ApiMsg = { role: "user" | "assistant"; content: string };

type MatchOut = { id: string; match: number; reasons: string[] };
type Profile = {
  tier: string;
  traits: { label: string; value: number }[];
  priorities: string[];
  matches: MatchOut[];
};

const GREETING =
  "İyi akşamlar. Size uygun evi bulabilmem için yaşam tarzınızı anlamam gerekiyor — birkaç soru.";

export function ConciergeLive() {
  const [messages, setMessages] = useState<Display[]>([
    { from: "ai", text: GREETING },
    { from: "ai", text: conciergeFlow[0].q },
  ]);
  const [api, setApi] = useState<ApiMsg[]>([
    { role: "assistant", content: `${GREETING}\n${conciergeFlow[0].q}` },
  ]);
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0); // scripted-fallback cursor
  const [profile, setProfile] = useState<Profile | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, profile, busy]);

  function scriptedAdvance(history: ApiMsg[]) {
    // No API key: walk the static flow, then synthesize a profile.
    const next = step + 1;
    if (next < conciergeFlow.length) {
      setMessages((m) => [...m, { from: "ai", text: conciergeFlow[next].q }]);
      setApi([...history, { role: "assistant", content: conciergeFlow[next].q }]);
      setStep(next);
    } else {
      setProfile({
        tier: lifestyleProfile.tier,
        traits: lifestyleProfile.traits,
        priorities: lifestyleProfile.priorities,
        matches: properties.map((p) => ({ id: p.id, match: p.match, reasons: p.reasons })),
      });
    }
  }

  async function send(value: string) {
    const text = value.trim();
    if (!text || busy || profile) return;
    setInput("");
    const meMsg: Display = { from: "me", text };
    const history: ApiMsg[] = [...api, { role: "user", content: text }];
    setMessages((m) => [...m, meMsg]);
    setApi(history);

    if (demo) {
      window.setTimeout(() => scriptedAdvance(history), 320);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();

      if (data.type === "unconfigured") {
        setDemo(true);
        window.setTimeout(() => scriptedAdvance(history), 320);
      } else if (data.type === "profile") {
        setProfile(data.profile as Profile);
      } else if (data.type === "question") {
        setMessages((m) => [...m, { from: "ai", text: data.text }]);
        setApi([...history, { role: "assistant", content: data.text }]);
      } else {
        setMessages((m) => [
          ...m,
          { from: "ai", text: data.error ?? "Bir an sonra tekrar deneyelim." },
        ]);
      }
    } catch {
      setMessages((m) => [...m, { from: "ai", text: "Bağlantı kurulamadı." }]);
    } finally {
      setBusy(false);
    }
  }

  // Quick chips only for the static opening question (and scripted follow-ups).
  const chips =
    !profile && (step === 0 || demo) && conciergeFlow[step]
      ? conciergeFlow[step].options
      : [];

  if (profile) return <ProfileResult profile={profile} demo={demo} />;

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
        {busy && (
          <div className="self-start rounded-2xl rounded-bl-sm bg-forest/70 px-3.5 py-2.5 text-[14.5px] text-ivory/80">
            …
          </div>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2.5">
          {chips.map((o) => (
            <button
              key={o.value}
              disabled={busy}
              onClick={() => send(o.value)}
              className="rounded-full border border-brass px-3 py-1.5 font-label text-[10.5px] uppercase tracking-[0.12em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-ivory disabled:opacity-40"
            >
              {o.chip}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-2.5 flex items-center gap-2 border-t border-ink/10 pt-2.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          placeholder="Yanıtınızı yazın…"
          className="min-w-0 flex-1 bg-transparent font-body text-[14px] text-ink placeholder:text-sage focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="font-label text-[11px] uppercase tracking-[0.18em] text-brass disabled:opacity-30"
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

function ProfileResult({ profile, demo }: { profile: Profile; demo: boolean }) {
  const byId = (id: string) => properties.find((p) => p.id === id);
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle>PROFILE</ScreenTitle>
      <ScreenDivider />
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-center">
          <span className="inline-block rounded-full border border-brass px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.18em] text-brass">
            Lifestyle · {profile.tier}
          </span>
        </div>
        <div className="mt-3">
          {profile.traits.slice(0, 4).map((t) => (
            <div key={t.label} className="my-3">
              <div className="mb-1.5 flex items-end justify-between">
                <span className="font-label text-[10px] uppercase tracking-[0.1em] text-ink/70">
                  {t.label}
                </span>
                <b className="font-serif text-[13px] text-forest">{t.value}%</b>
              </div>
              <div className="h-1 overflow-hidden rounded bg-ivory-2">
                <div className="gold-track h-full rounded" style={{ width: `${t.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <ScreenDivider className="mt-3" />
        <div className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Size özel eşleşmeler
        </div>
        {profile.matches.slice(0, 3).map((m) => {
          const p = byId(m.id);
          return (
            <div key={m.id} className="mt-3 border-l border-brass/40 pl-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-[16px] text-forest-deep">
                  {p?.name ?? m.id}
                </span>
                <span className="font-serif text-[14px] text-brass">{m.match}%</span>
              </div>
              <div className="mt-1 text-[12.5px] leading-snug text-ink/60">
                {m.reasons.slice(0, 4).map((r) => `+ ${r}`).join("  ")}
              </div>
            </div>
          );
        })}
      </div>
      <div className="pt-2 text-center font-label text-[9px] uppercase tracking-[0.18em] text-sage">
        {demo ? "Demo akışı · ANTHROPIC_API_KEY ile canlı AI" : "Claude ile canlı eşleştirildi"}
      </div>
    </div>
  );
}
