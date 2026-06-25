import { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { PhoneCaption } from "./primitives";

export function Gallery({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-10">{children}</div>
  );
}

export function GalleryItem({
  eyebrow,
  title,
  caption,
  time,
  dark = false,
  children,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  time?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex w-[300px] flex-col items-center gap-[18px]">
      <PhoneFrame time={time} dark={dark}>
        {children}
      </PhoneFrame>
      <PhoneCaption eyebrow={eyebrow} title={title}>
        {caption}
      </PhoneCaption>
    </div>
  );
}
