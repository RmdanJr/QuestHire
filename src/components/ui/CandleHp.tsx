import { litCandles } from "@/lib/ui/meters";

type CandleHpProps = {
  current: number;
  max: number;
  /** Accessible name, e.g. "Your hit points". */
  label?: string;
  className?: string;
};

/**
 * HP as candles. A wrong answer snuffs one out, so the room gets darker.
 * Exposed to assistive tech as a meter with a text value.
 */
export function CandleHp({ current, max, label = "Hit points", className }: Readonly<CandleHpProps>) {
  const safeMax = Math.max(0, Math.floor(max));
  const lit = litCandles(current, safeMax);

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={lit}
      aria-valuetext={`${lit} of ${safeMax} candles lit`}
      className={["flex items-end gap-2", className].filter(Boolean).join(" ")}
    >
      {Array.from({ length: safeMax }, (_, i) => {
        const isLit = i < lit;
        return (
          <svg
            key={i}
            viewBox="0 0 24 48"
            width="24"
            height="48"
            aria-hidden="true"
            focusable="false"
            data-lit={isLit}
          >
            {isLit ? (
              <g className="flame">
                <path
                  d="M12 2 C16 9 18 13 12 20 C6 13 8 9 12 2 Z"
                  fill="var(--candle)"
                />
                <path d="M12 9 C14 13 14 15 12 18 C10 15 10 13 12 9 Z" fill="var(--parchment)" />
              </g>
            ) : (
              <path d="M12 18 C12 15 13 13 12 10" stroke="var(--parchment-dim)" strokeWidth="1.5" fill="none" opacity="0.5" />
            )}
            <rect x="7" y="22" width="10" height="24" rx="2" fill="var(--parchment)" opacity={isLit ? 1 : 0.55} />
            <rect x="11.2" y="19" width="1.6" height="4" fill="var(--void)" />
          </svg>
        );
      })}
      <span className="sr-only">{`${lit} of ${safeMax} candles lit`}</span>
    </div>
  );
}
