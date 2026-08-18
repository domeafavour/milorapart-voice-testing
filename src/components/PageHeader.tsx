import type { ReactNode } from "react";
import { Eyebrow } from "./ui";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="animate-rise flex flex-col gap-2">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-display text-5xl font-semibold uppercase leading-none tracking-wide text-fg">
        {title}
      </h1>
      {children ? (
        <p className="max-w-md text-sm leading-relaxed text-steel">{children}</p>
      ) : null}
    </header>
  );
}