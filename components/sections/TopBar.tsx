"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function TopBar({ user }: { user: { name: string; tier: string } | null }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Concierge", "#concierge"],
    ["Intelligence", "#intelligence"],
    ["Private Market", "#private"],
    ["Atelier", "#atelier"],
  ];

  const text = solid ? "text-ink/70" : "text-ivory/75";
  const brand = solid ? "text-forest-deep" : "text-ivory";

  return (
    <div
      className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
        solid ? "border-b border-ink/10 bg-ivory/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-wrap items-center justify-between px-7">
        <Link href="/" className={`pl-[0.42em] font-serif text-[26px] tracking-brand transition-colors duration-500 ${brand}`}>
          DOMAINE
        </Link>
        <nav className="hidden items-center gap-[34px] md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={`font-label text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:text-brass ${text}`}
            >
              {label}
            </a>
          ))}
          <Link
            href="/collection"
            className={`font-label text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:text-brass ${text}`}
          >
            Collection
          </Link>
          <Link
            href={user ? "/dashboard" : "/signin"}
            className={`border-b border-brass pb-0.5 font-label text-[11px] uppercase tracking-[0.18em] transition-colors duration-500 ${
              solid ? "text-forest" : "text-brass-soft"
            }`}
          >
            {user ? `${user.name.split(" ")[0]} · ${user.tier}` : "Giriş"}
          </Link>
        </nav>
      </div>
    </div>
  );
}
