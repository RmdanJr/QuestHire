/** Pure helpers behind the themed meters. Kept free of React so they are easy to test. */

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Number of lit candles, always an integer within [0, max]. */
export function litCandles(current: number, max: number): number {
  const safeMax = Math.max(0, Math.floor(max));
  return clamp(Math.round(current), 0, safeMax);
}

/**
 * Fraction (0..1) of the moon that is lit for a readiness value of 0..100.
 * 0 = new moon (dark), 100 = full moon.
 */
export function moonIllumination(readiness: number): number {
  return clamp(readiness, 0, 100) / 100;
}

export type MoonPhaseName =
  | "new moon"
  | "waxing crescent"
  | "first quarter"
  | "waxing gibbous"
  | "full moon";

/** Human-readable phase, used for the accessible text alternative. */
export function moonPhaseName(readiness: number): MoonPhaseName {
  const v = clamp(readiness, 0, 100);
  if (v < 5) return "new moon";
  if (v < 40) return "waxing crescent";
  if (v < 60) return "first quarter";
  if (v < 95) return "waxing gibbous";
  return "full moon";
}

/** Fraction of sand still in the top bulb: 1 when all the time is left, 0 when none is. */
export function hourglassFill(daysLeft: number, totalDays: number): number {
  if (totalDays <= 0) return 0;
  return clamp(daysLeft / totalDays, 0, 1);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days from `now` until `target`, rounded up, never negative. */
export function daysUntil(target: Date, now: Date): number {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / MS_PER_DAY);
}

/** True in the final 24 hours, when the clock tower tolls its bell. */
export function isFinalDay(target: Date, now: Date): boolean {
  const diff = target.getTime() - now.getTime();
  return diff > 0 && diff <= MS_PER_DAY;
}
