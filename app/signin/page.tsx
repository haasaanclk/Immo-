"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Bağlantı kurulamadı.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="block text-center font-serif text-[26px] tracking-brand">
          DOMAINE
        </Link>
        <div className="mt-2 text-center label-eyebrow">
          {mode === "login" ? "Tekrar hoş geldiniz" : "Üyelik oluşturun"}
        </div>
        <h1 className="mt-4 text-center font-serif text-[40px] font-light leading-tight text-forest-deep">
          {mode === "login" ? "Giriş" : "Katılın"}
        </h1>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
          {mode === "signup" && (
            <Field label="Ad" value={name} onChange={setName} type="text" placeholder="Adınız" />
          )}
          <Field label="E-posta" value={email} onChange={setEmail} type="email" placeholder="ad@ornek.com" />
          <Field label="Parola" value={password} onChange={setPassword} type="password" placeholder="••••••••" />

          {error && <div className="text-[14px] text-burgundy">{error}</div>}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-sm bg-forest py-3.5 font-label text-[12px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-forest-deep disabled:opacity-50"
          >
            {busy ? "…" : mode === "login" ? "Giriş yap" : "Üyelik oluştur"}
          </button>
        </form>

        <div className="mt-8 text-center text-[15px] text-ink/60">
          {mode === "login" ? "Hesabınız yok mu? " : "Zaten üye misiniz? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="border-b border-brass pb-0.5 text-forest"
          >
            {mode === "login" ? "Üyelik oluşturun" : "Giriş yapın"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="label-eyebrow text-ink/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-ink/15 bg-transparent pb-2 font-body text-[17px] text-ink placeholder:text-sage focus:border-brass focus:outline-none"
      />
    </label>
  );
}
