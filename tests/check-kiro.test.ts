import { describe, expect, it } from "vitest";
import { findProblems } from "../scripts/check-kiro.mjs";

const goodIgnore = ["/node_modules", "/.local/", ".env*"].join("\n");

describe("repo guard", () => {
  it("passes for a healthy repo", () => {
    expect(
      findProblems({ hasKiroDir: true, hasLicense: true, gitignoreText: goodIgnore }),
    ).toEqual([]);
  });

  it("flags a missing .kiro directory and LICENSE", () => {
    const problems = findProblems({
      hasKiroDir: false,
      hasLicense: false,
      gitignoreText: goodIgnore,
    });
    expect(problems).toHaveLength(2);
  });

  it.each([".kiro", "/.kiro/", ".kiro/**", "/.kiro"])(
    "flags a .gitignore that ignores .kiro (%s)",
    (rule) => {
      const problems = findProblems({
        hasKiroDir: true,
        hasLicense: true,
        gitignoreText: `${goodIgnore}\n${rule}`,
      });
      expect(problems.some((p) => p.includes(".kiro is gitignored"))).toBe(true);
    },
  );

  it("flags a .gitignore that no longer ignores .local/", () => {
    const problems = findProblems({
      hasKiroDir: true,
      hasLicense: true,
      gitignoreText: "/node_modules",
    });
    expect(problems.some((p) => p.includes(".local/ is not gitignored"))).toBe(true);
  });

  it("does not treat a commented .kiro rule as active", () => {
    const problems = findProblems({
      hasKiroDir: true,
      hasLicense: true,
      gitignoreText: `${goodIgnore}\n# .kiro must never be ignored`,
    });
    expect(problems).toEqual([]);
  });
});
