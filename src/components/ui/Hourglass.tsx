import { hourglassFill } from "@/lib/ui/meters";

type HourglassProps = {
  daysLeft: number;
  totalDays: number;
  /** Accessible name, e.g. "Time until your interview". */
  label?: string;
  className?: string;
};

/**
 * Countdown to the real interview. The top bulb holds the sand that is left.
 * A visually hidden native <meter> carries the semantics; the glass is decorative.
 */
export function Hourglass({
  daysLeft,
  totalDays,
  label = "Time until your interview",
  className,
}: Readonly<HourglassProps>) {
  const fill = hourglassFill(daysLeft, totalDays);
  const safeTotal = Math.max(0, Math.floor(totalDays));
  const safeLeft = Math.min(safeTotal, Math.max(0, Math.floor(daysLeft)));
  const topSandHeight = 26 * fill;
  const bottomSandHeight = 26 * (1 - fill);
  const text = `${safeLeft} ${safeLeft === 1 ? "day" : "days"} left`;

  return (
    <div className={["inline-flex flex-col items-center gap-1", className].filter(Boolean).join(" ")}>
      <meter
        className="sr-only"
        min={0}
        max={safeTotal}
        value={safeLeft}
        aria-label={label}
        aria-valuetext={text}
      >
        {text}
      </meter>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 48 72" width="48" height="72">
        <defs>
          <clipPath id="top-bulb">
            <path d="M8 6 H40 L26 34 H22 Z" />
          </clipPath>
          <clipPath id="bottom-bulb">
            <path d="M22 38 H26 L40 66 H8 Z" />
          </clipPath>
        </defs>
        <rect x="4" y="2" width="40" height="4" rx="2" fill="var(--crypt-border)" />
        <rect x="4" y="66" width="40" height="4" rx="2" fill="var(--crypt-border)" />
        <g clipPath="url(#top-bulb)">
          <rect x="0" y={34 - topSandHeight} width="48" height={topSandHeight} fill="var(--candle)" />
        </g>
        <g clipPath="url(#bottom-bulb)">
          <rect x="0" y={66 - bottomSandHeight} width="48" height={bottomSandHeight} fill="var(--candle)" />
        </g>
        <path d="M8 6 H40 L26 34 H22 Z M22 38 H26 L40 66 H8 Z" fill="none" stroke="var(--parchment-dim)" strokeWidth="1.5" />
      </svg>
      <span aria-hidden="true" className="text-sm text-parchment-dim">
        {text}
      </span>
    </div>
  );
}
