import type { ButtonHTMLAttributes } from "react";

type RuneButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

const variants: Record<NonNullable<RuneButtonProps["variant"]>, string> = {
  primary: "bg-candle text-void hover:bg-ember",
  ghost: "border border-crypt-border bg-transparent text-parchment hover:bg-crypt-raised",
  danger: "border border-blood bg-transparent text-blood hover:bg-crypt-raised",
};

/** Primary action button. Focus ring comes from the global :focus-visible rule. */
export function RuneButton({
  variant = "primary",
  className,
  type = "button",
  ...props
}: Readonly<RuneButtonProps>) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
