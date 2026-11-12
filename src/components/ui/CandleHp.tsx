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
 * A visually hidden native <meter> carries the semantics for assistive tech;
 * the candles are decorative.
 */
export function CandleHp({
  current,
  max,
  label = "Hit points",
  className,
}: Readonly<CandleHpProps>) {
  const safeMax = Math.max(0, Math.floor(max));
  const lit = litCandles(current, safeMax);
  const text = `${lit} of ${safeMax} candles lit`;

  return (
    <div className={className}>
      <meter
        className="sr-only"
        min={0}
        max={safeMax}
        value={lit}
        aria-label={label}
        aria-valuetext={text}
      >
        {text}
      </meter>
      <div aria-hidden="true" className="flex items-end gap-2">
        {Array.from({ length: safeMax }, (_, i) => {
          const isLit = i < lit;
          return (
            <svg
              key={i}
              viewBox="0 0 24 48"
              width="24"
              height="48"
              focusable="false"
              data-lit={isLit}
            >
              {isLit ? (
                <g className="flame">
                  <path d="M12 2 C16 9 18 13 12 20 C6 13 8 9 12 2 Z" fill="var(--candle)" />
                  <path d="M12 9 C14 13 14 15 12 18 C10 15 10 13 12 9 Z" fill="var(--parchment)" />
                </g>
              ) : (
                <path
                  d="M12 18 C12 15 13 13 12 10"
                  stroke="var(--parchment-dim)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.5"
                />
              )}
              <rect x="7" y="22" width="10" height="24" rx="2" fill="var(--parchment)" opacity={isLit ? 1 : 0.55} />
              <rect x="11.2" y="19" width="1.6" height="4" fill="var(--void)" />
            </svg>
          );
        })}
      </div>
    </div>
  );
}
