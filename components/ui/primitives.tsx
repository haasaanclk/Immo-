import { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="label-eyebrow">{children}</div>;
}

export function Pill({
  children,
  tone = "brass",
}: {
  children: ReactNode;
  tone?: "brass" | "forest" | "soft";
}) {
  const tones = {
    brass: "text-brass border-brass",
    forest: "text-forest border-forest",
    soft: "text-brass-soft border-brass-soft",
  };
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.18em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="my-3.5">
      <div className="mb-1.5 flex items-end justify-between">
        <span className="font-label text-[10.5px] uppercase tracking-[0.1em] text-ink/70">
          {label}
        </span>
        <b className="font-serif text-[14px] font-medium text-forest">{value}%</b>
      </div>
      <div className="h-1 overflow-hidden rounded bg-ivory-2">
        <div className="gold-track h-full rounded" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-16 max-w-[680px] text-center">
      <div className={light ? "label-eyebrow text-brass-soft" : "label-eyebrow"}>
        {eyebrow}
      </div>
      <h2
        className={`mt-3.5 font-serif text-[clamp(34px,5vw,56px)] font-light leading-[1.08] ${
          light ? "text-ivory" : "text-forest-deep"
        }`}
      >
        {title}
      </h2>
      {children && (
        <p
          className={`mt-4 text-[19px] ${light ? "text-ivory/70" : "text-ink/70"}`}
        >
          {children}
        </p>
      )}
    </div>
  );
}

export function PhoneCaption({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="w-[300px] text-center">
      <span className="label-eyebrow">{eyebrow}</span>
      <h3 className="mt-1.5 font-serif text-[23px] text-forest-deep">{title}</h3>
      <p className="mx-auto mt-1 max-w-[280px] text-[15px] text-ink/55">{children}</p>
    </div>
  );
}
