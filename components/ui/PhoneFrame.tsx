import { ReactNode } from "react";

export function PhoneFrame({
  children,
  time = "9:41",
  dark = false,
}: {
  children: ReactNode;
  time?: string;
  dark?: boolean;
}) {
  return (
    <div className="h-[620px] w-[300px] flex-none rounded-[42px] bg-forest-deep p-[11px] shadow-[0_40px_80px_-30px_rgba(20,36,28,0.55),0_0_0_1px_rgba(176,141,87,0.25)]">
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[32px] ${
          dark ? "bg-forest-deep" : "bg-ivory"
        }`}
      >
        <div className="absolute left-1/2 top-0 z-10 h-6 w-[120px] -translate-x-1/2 rounded-b-2xl bg-forest-deep" />
        <div
          className={`flex h-10 items-center justify-between px-5 font-label text-[11px] ${
            dark ? "text-ivory/60" : "text-ink/60"
          }`}
        >
          <span>{time}</span>
          <span>DOMAINE</span>
        </div>
        <div className="flex-1 overflow-hidden px-5 pb-5 pt-1.5">{children}</div>
      </div>
    </div>
  );
}

export function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-center font-serif text-[15px] tracking-[0.34em] text-forest">
      {children}
    </div>
  );
}

export function ScreenDivider({ className = "" }: { className?: string }) {
  return <div className={`hair-rule my-3 ${className}`} />;
}
