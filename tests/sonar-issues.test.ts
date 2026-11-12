import { describe, expect, it } from "vitest";
import {
  buildGateUrl,
  buildIssuesUrl,
  collectReport,
  extractIssues,
  findCompletedCheck,
  formatIssues,
  parseArgs,
  parseProjectKey,
} from "../scripts/lib/sonar.mjs";

const key = "RmdanJr_QuestHire";

describe("parseProjectKey", () => {
  it("reads the key from the properties file", () => {
    const text = "sonar.organization=rmdanjr\nsonar.projectKey=RmdanJr_QuestHire\nsonar.sources=src\n";
    expect(parseProjectKey(text)).toBe(key);
  });

  it("tolerates spaces and Windows line endings", () => {
    expect(parseProjectKey("  sonar.projectKey = abc_def  \r\nother=1\r\n")).toBe("abc_def");
  });

  it("returns undefined when the key is missing or only commented out", () => {
    expect(parseProjectKey("sonar.sources=src")).toBeUndefined();
    expect(parseProjectKey("#sonar.projectKey=nope")).toBeUndefined();
  });
});

describe("URL builders", () => {
  it("scopes to a pull request when one is given", () => {
    const url = new URL(buildIssuesUrl({ projectKey: key, pullRequest: 7, branch: "x" }));
    expect(url.pathname).toBe("/api/issues/search");
    expect(url.searchParams.get("componentKeys")).toBe(key);
    expect(url.searchParams.get("resolved")).toBe("false");
    expect(url.searchParams.get("pullRequest")).toBe("7");
    expect(url.searchParams.has("branch")).toBe(false);
  });

  it("falls back to the branch when there is no pull request", () => {
    const url = new URL(buildIssuesUrl({ projectKey: key, branch: "feat/a b" }));
    expect(url.searchParams.get("branch")).toBe("feat/a b");
    expect(url.searchParams.has("pullRequest")).toBe(false);
  });

  it("builds the quality gate URL with the same scoping", () => {
    const url = new URL(buildGateUrl({ projectKey: key, pullRequest: "3" }));
    expect(url.pathname).toBe("/api/qualitygates/project_status");
    expect(url.searchParams.get("projectKey")).toBe(key);
    expect(url.searchParams.get("pullRequest")).toBe("3");
  });
});

describe("formatIssues", () => {
  const issues = [
    { severity: "MINOR", type: "CODE_SMELL", rule: "typescript:S7773", component: `${key}:src/b.ts`, line: 9, message: "minor thing" },
    { severity: "MAJOR", type: "CODE_SMELL", rule: "css:S9423", component: `${key}:src/a.css`, line: 20, message: "major thing" },
    { severity: "BLOCKER", type: "BUG", rule: "x:S1", component: `${key}:src/c.ts`, message: "blocker, no line" },
    { severity: "MAJOR", type: "CODE_SMELL", rule: "css:S9423", component: `${key}:src/a.css`, line: 5, message: "earlier line" },
  ];

  it("sorts by severity, then rule, file and line", () => {
    const lines = formatIssues(issues, key);
    expect(lines).toEqual([
      "[BLOCKER] x:S1 src/c.ts - blocker, no line",
      "[MAJOR] css:S9423 src/a.css:5 - earlier line",
      "[MAJOR] css:S9423 src/a.css:20 - major thing",
      "[MINOR] typescript:S7773 src/b.ts:9 - minor thing",
    ]);
  });

  it("does not mutate its input", () => {
    const copy = JSON.parse(JSON.stringify(issues));
    formatIssues(issues, key);
    expect(issues).toEqual(copy);
  });

  it("puts unknown severities last", () => {
    const lines = formatIssues(
      [
        { severity: "WEIRD", type: "X", rule: "a:1", component: `${key}:f`, message: "m" },
        { severity: "INFO", type: "X", rule: "a:2", component: `${key}:f`, message: "m" },
      ],
      key,
    );
    expect(lines[0]).toContain("[INFO]");
    expect(lines[1]).toContain("[WEIRD]");
  });
});

describe("extractIssues", () => {
  it("returns the issues array", () => {
    expect(extractIssues({ issues: [{ rule: "a" }] })).toEqual([{ rule: "a" }]);
  });

  it.each([null, undefined, {}, { issues: "no" }, "text"])("rejects %j", (bad) => {
    expect(() => extractIssues(bad)).toThrow(TypeError);
  });
});

describe("parseArgs", () => {
  it("reads --pr and --branch", () => {
    expect(parseArgs(["--pr", "12", "--branch", "feat/x"])).toEqual({
      pullRequest: "12",
      branch: "feat/x",
    });
  });

  it("ignores unknown flags and returns an empty object for no args", () => {
    expect(parseArgs([])).toEqual({});
    expect(parseArgs(["--verbose"])).toEqual({});
  });
});

describe("findCompletedCheck", () => {
  const sonar = (status: string) => ({
    app: { slug: "sonarqubecloud" },
    status,
    name: "SonarCloud Code Analysis",
  });

  it("returns the Sonar check only when it has completed", () => {
    const done = findCompletedCheck({
      check_runs: [{ app: { slug: "github-actions" }, status: "completed" }, sonar("completed")],
    });
    expect(done?.name).toBe("SonarCloud Code Analysis");
    expect(findCompletedCheck({ check_runs: [sonar("in_progress")] })).toBeUndefined();
  });

  it("is safe on malformed responses", () => {
    expect(findCompletedCheck(undefined)).toBeUndefined();
    expect(findCompletedCheck({})).toBeUndefined();
    expect(findCompletedCheck({ check_runs: [{ status: "completed" }] })).toBeUndefined();
  });
});

describe("collectReport", () => {
  const issue = {
    severity: "MAJOR",
    type: "CODE_SMELL",
    rule: "css:S9423",
    component: `${key}:a.css`,
    line: 3,
    message: "m",
  };

  it("combines the gate status and formatted issues using scoped URLs", async () => {
    const seen: string[] = [];
    const fetchJson = async (url: string) => {
      seen.push(url);
      return url.includes("project_status")
        ? { projectStatus: { status: "OK" } }
        : { issues: [issue] };
    };

    const report = await collectReport({ projectKey: key, scope: { pullRequest: 4 }, fetchJson });

    expect(report.gateStatus).toBe("OK");
    expect(report.lines).toEqual(["[MAJOR] css:S9423 a.css:3 - m"]);
    expect(seen).toHaveLength(2);
    expect(seen.every((u) => u.includes("pullRequest=4"))).toBe(true);
  });

  it("reports an unknown gate and no lines when Sonar returns nothing useful", async () => {
    const fetchJson = async (url: string) => (url.includes("project_status") ? {} : { issues: [] });
    const report = await collectReport({ projectKey: key, scope: { branch: "main" }, fetchJson });
    expect(report).toEqual({ gateStatus: "unknown", lines: [] });
  });

  it("propagates failures from the Sonar API", async () => {
    const fetchJson = async () => {
      throw new Error("HTTP 500");
    };
    await expect(
      collectReport({ projectKey: key, scope: { branch: "main" }, fetchJson }),
    ).rejects.toThrow("HTTP 500");
  });
});
