import { useEffect, useRef } from "react";
import { Equalizer, PlayGlyph } from "./ui";

export interface ReadLineProps {
  isPending: boolean;
  index: number;
  active: boolean;
  text: string;
  onSpeak?: () => void;
}

export function ReadLine({
  isPending,
  index,
  active,
  text,
  onSpeak,
}: ReadLineProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const clickable = !isPending;
  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [active]);
  return (
    <div
      ref={ref}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onSpeak?.() : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSpeak?.();
              }
            }
          : undefined
      }
      className={`group flex items-start gap-3 border-l-2 px-3 py-2 text-sm transition-colors duration-300 ${
        active
          ? "border-amber bg-amber/6 text-fg"
          : clickable
            ? "cursor-pointer border-transparent text-steel hover:bg-white/3 hover:text-fg"
            : "border-transparent text-steel"
      }`}
    >
      <span
        className={`font-mono text-[0.65rem] leading-5 ${
          active ? "text-amber" : "text-line"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 leading-5">{text}</span>
      <span className="flex items-center mt-1">
        {active ? (
          <Equalizer size="xs" />
        ) : clickable ? (
          <PlayGlyph className="h-4 w-4 text-amber opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
        ) : null}
      </span>
    </div>
  );
}
