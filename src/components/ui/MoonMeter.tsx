import { moonIllumination, moonPhaseName } from "@/lib/ui/meters";

type MoonMeterProps = {
  /** Readiness from 0 (new moon) to 100 (full moon). */
  value: number;
  label?: string;
  size?: number;
  className?: string;
};

/** Lit region of a waxing moon: right half circle plus a terminator ellipse arc. */
function litPath(f: number, r: number, c: number): string {
  const rx = r * Math.abs(1 - 2 * f);
  const sweep = f > 0.5 ? 1 : 0;
  return `M ${c} ${c - r} A ${r} ${r} 0 0 1 ${c} ${c + r} A ${rx} ${r} 0 0 ${sweep} ${c} ${c - r} Z`;
}

/**
 * Readiness meter. New moon = unprepared, full moon = ready.
 * A visually hidden native <meter> carries the semantics; the moon is decorative.
 */
export function MoonMeter({
  value,
  label = "Readiness",
  size = 96,
  className,
}: Readonly<MoonMeterProps>) {
  const f = moonIllumination(value);
  const rounded = Math.round(f * 100);
  const phase = moonPhaseName(value);
  const r = 44;
  const c = 50;
  const text = `${rounded} percent, ${phase}`;

  return (
    <div className={["inline-flex flex-col items-center gap-1", className].filter(Boolean).join(" ")}>
      <meter
        className="sr-only"
        min={0}
        max={100}
        value={rounded}
        aria-label={label}
        aria-valuetext={text}
      >
        {text}
      </meter>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="var(--crypt-raised)" stroke="var(--moon)" strokeWidth="1.5" />
        {f > 0 && <path d={litPath(f, r, c)} fill="var(--moon)" />}
      </svg>
      <span aria-hidden="true" className="text-sm text-parchment-dim">{`${rounded}% · ${phase}`}</span>
    </div>
  );
}
