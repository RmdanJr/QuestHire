import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { colors, contrastPairs, CONTRAST_TARGETS } from "./tokens";

describe("design tokens contrast", () => {
  for (const pair of contrastPairs) {
    const target =
      pair.kind === "text" ? CONTRAST_TARGETS.text : CONTRAST_TARGETS.largeTextAndUi;
    it(`${pair.label} (${pair.fg} on ${pair.bg}) meets ${target}:1`, () => {
      const ratio = contrastRatio(colors[pair.fg], colors[pair.bg]);
      expect(ratio).toBeGreaterThanOrEqual(target);
    });
  }
});

describe("contrastRatio properties", () => {
  const hex = fc
    .tuple(fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }))
    .map(([r, g, b]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`);

  it("is symmetric and within [1, 21]", () => {
    fc.assert(
      fc.property(hex, hex, (a, b) => {
        const ab = contrastRatio(a, b);
        const ba = contrastRatio(b, a);
        expect(ab).toBeCloseTo(ba, 10);
        expect(ab).toBeGreaterThanOrEqual(1);
        expect(ab).toBeLessThanOrEqual(21.0001);
      }),
    );
  });

  it("equals 1 for identical colors", () => {
    fc.assert(
      fc.property(hex, (a) => {
        expect(contrastRatio(a, a)).toBeCloseTo(1, 10);
      }),
    );
  });
});
