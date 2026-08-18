import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export const panelClass =
  "rounded-2xl border border-line bg-panel bg-gradient-to-b from-white/[0.02] to-transparent shadow-panel";

const controlBase =
  "h-11 w-full rounded-[0.6rem] border border-line bg-[rgb(10_12_16/0.6)] text-sm text-fg transition placeholder:text-[#5b6472] focus:border-amber focus:outline-none focus:ring-4 focus:ring-amber/15";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-amber">
      <span className="h-0.5 w-7 bg-amber" aria-hidden="true" />
      {children}
    </p>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${panelClass} ${className}`}>{children}</div>;
}

export function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

export function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-steel"
    >
      {children}
    </label>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`${controlBase} px-3 ${className}`}
      {...props}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${controlBase} min-h-[5.25rem] resize-none px-3 py-3 ${className}`}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", children, ...props }, ref) {
  return (
    <span className="relative block">
      <select
        ref={ref}
        className={`${controlBase} cursor-pointer appearance-none pr-10 ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-steel"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
});

export function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-[0.6rem] bg-amber px-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1203] transition hover:-translate-y-px hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const readoutTones = {
  steel: "text-steel",
  rec: "text-rec",
  amber: "text-amber",
} as const;

export function Readout({
  children,
  className = "",
  tone = "steel",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof readoutTones;
}) {
  return (
    <span
      className={`font-mono text-xs tracking-[0.08em] ${readoutTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const eqSizes = {
  md: { bar: "h-4 w-[3px]", box: "h-4" },
  sm: { bar: "h-3 w-0.5", box: "h-3" },
  xs: { bar: "h-2.5 w-0.5", box: "h-2.5" },
} as const;

export function Equalizer({
  bars = 5,
  size = "md",
  className = "",
}: {
  bars?: number;
  size?: keyof typeof eqSizes;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-end gap-0.5 ${eqSizes[size].box} ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`${eqSizes[size].bar} animate-eq rounded-full bg-amber`}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

export function Rec({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-rec">
      <span
        className="size-2 animate-blink rounded-full bg-rec"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}
