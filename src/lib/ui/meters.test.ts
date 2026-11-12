import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  clamp,
  daysUntil,
  hourglassFill,
  isFinalDay,
  litCandles,
  moonIllumination,
  moonPhaseName,
} from "./meters";

describe("litCandles", () => {
  it("is always an integer between 0 and max", () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.integer({ min: 0, max: 20 }),
        (current, max) => {
          const lit = litCandles(current, max);
          expect(Number.isInteger(lit)).toBe(true);
          expect(lit).toBeGreaterThanOrEqual(0);
          expect(lit).toBeLessThanOrEqual(max);
        },
      ),
    );
  });

  it("is monotonic in current HP", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 20 }),
        fc.integer({ min: 0, max: 20 }),
        fc.integer({ min: 1, max: 20 }),
        (a, b, max) => {
          const [lo, hi] = a <= b ? [a, b] : [b, a];
          expect(litCandles(lo, max)).toBeLessThanOrEqual(litCandles(hi, max));
        },
      ),
    );
  });
});

describe("moon", () => {
  it("illumination stays within [0, 1] and is monotonic", () => {
    fc.assert(
      fc.property(
        fc.double({ min: -50, max: 150, noNaN: true }),
        fc.double({ min: -50, max: 150, noNaN: true }),
        (a, b) => {
          const [lo, hi] = a <= b ? [a, b] : [b, a];
          const il = moonIllumination(lo);
          expect(il).toBeGreaterThanOrEqual(0);
          expect(il).toBeLessThanOrEqual(1);
          expect(moonIllumination(lo)).toBeLessThanOrEqual(moonIllumination(hi));
        },
      ),
    );
  });

  it("names the extremes", () => {
    expect(moonPhaseName(0)).toBe("new moon");
    expect(moonPhaseName(100)).toBe("full moon");
    expect(moonPhaseName(50)).toBe("first quarter");
  });
});

describe("hourglass and countdown", () => {
  it("fill is within [0, 1]", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10, max: 100 }),
        fc.integer({ min: -10, max: 100 }),
        (left, total) => {
          const f = hourglassFill(left, total);
          expect(f).toBeGreaterThanOrEqual(0);
          expect(f).toBeLessThanOrEqual(1);
        },
      ),
    );
  });

  it("daysUntil is never negative and rounds up", () => {
    const now = new Date("2026-11-12T12:00:00Z");
    expect(daysUntil(new Date("2026-11-12T11:00:00Z"), now)).toBe(0);
    expect(daysUntil(new Date("2026-11-12T13:00:00Z"), now)).toBe(1);
    expect(daysUntil(new Date("2026-11-18T12:00:00Z"), now)).toBe(6);
  });

  it("final day is true only in the last 24 hours", () => {
    const now = new Date("2026-11-12T12:00:00Z");
    expect(isFinalDay(new Date("2026-11-13T11:00:00Z"), now)).toBe(true);
    expect(isFinalDay(new Date("2026-11-13T13:00:00Z"), now)).toBe(false);
    expect(isFinalDay(new Date("2026-11-12T11:00:00Z"), now)).toBe(false);
  });
});

describe("clamp", () => {
  it("treats NaN as the minimum", () => {
    expect(clamp(Number.NaN, 0, 10)).toBe(0);
  });
});
