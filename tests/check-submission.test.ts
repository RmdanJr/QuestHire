import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkRepo, findProblems } from "../.kiro/skills/submission-guard/scripts/check-submission.mjs";

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

describe("checkRepo (reads a real folder)", () => {
  const created: string[] = [];

  function makeRepo(opts: { kiro: boolean; license: boolean; gitignore?: string }) {
    const dir = mkdtempSync(join(tmpdir(), "qh-guard-"));
    created.push(dir);
    if (opts.kiro) mkdirSync(join(dir, ".kiro"));
    if (opts.license) writeFileSync(join(dir, "LICENSE"), "MIT");
    if (opts.gitignore !== undefined) writeFileSync(join(dir, ".gitignore"), opts.gitignore);
    return dir;
  }

  afterEach(() => {
    for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it("passes for a healthy folder", () => {
    const dir = makeRepo({ kiro: true, license: true, gitignore: "/.local/\n" });
    expect(checkRepo(dir)).toEqual([]);
  });

  it("reports every problem for an empty folder", () => {
    const dir = makeRepo({ kiro: false, license: false });
    // no .gitignore at all means .local/ is not ignored either
    expect(checkRepo(dir)).toHaveLength(3);
  });

  it("catches .kiro being ignored in the real .gitignore file", () => {
    const dir = makeRepo({ kiro: true, license: true, gitignore: "/.local/\n.kiro\n" });
    expect(checkRepo(dir).join("\n")).toContain(".kiro is gitignored");
  });
});
