import type { ReactNode } from "react";

type GrimoirePanelProps = {
  title: string;
  /** Heading level for the title so the page outline stays correct. */
  headingLevel?: 2 | 3 | 4;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Ornate container for lessons, results and forms. */
export function GrimoirePanel({
  title,
  headingLevel = 2,
  children,
  footer,
  className,
}: GrimoirePanelProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <section
      className={[
        "relative rounded-lg border-2 border-crypt-border bg-crypt p-6 shadow-[0_0_40px_rgb(0_0_0/0.5)]",
        "before:pointer-events-none before:absolute before:inset-1 before:rounded-md before:border before:border-crypt-border/50 before:content-['']",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Heading className="mb-3 text-xl font-semibold text-candle">{title}</Heading>
      <div className="text-parchment">{children}</div>
      {footer ? <footer className="mt-4 border-t border-crypt-border/60 pt-3 text-sm text-parchment-dim">{footer}</footer> : null}
    </section>
  );
}
