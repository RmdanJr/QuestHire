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

/** Readiness meter. New moon = unprepared, full moon = ready. */
export function MoonMeter({ value, label = "Readiness", size = 96, className }: Readonly<MoonMeterProps>) {
  const f = moonIllumination(value);
  const rounded = Math.round(f * 100);
  const phase = moonPhaseName(value);
  const r = 44;
  const c = 50;

  return (
    <div className={["inline-flex flex-col items-center gap-1", className].filter(Boolean).join(" ")}>
      <svg
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${rounded} percent, ${phase}`}
        viewBox="0 0 100 100"
        width={size}
        height={size}
      >
        <circle cx={c} cy={c} r={r} fill="var(--crypt-raised)" stroke="var(--moon)" strokeWidth="1.5" />
        {f > 0 && <path d={litPath(f, r, c)} fill="var(--moon)" />}
      </svg>
      <span className="text-sm text-parchment-dim">{`${rounded}% · ${phase}`}</span>
    </div>
  );
}
