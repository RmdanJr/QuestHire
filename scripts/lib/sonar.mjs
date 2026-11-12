/**
 * Pure helpers for reading SonarQube Cloud results. No I/O except through the
 * `fetchJson` function that callers inject, so everything here is unit-testable.
 */

export const SONAR_BASE = "https://sonarcloud.io";
export const SONAR_CHECK_APP = "sonarqubecloud";

const SEVERITY_ORDER = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "INFO"];

/**
 * @param {string} propertiesText contents of sonar-project.properties
 * @returns {string | undefined}
 */
export function parseProjectKey(propertiesText) {
  const match = /^\s*sonar\.projectKey\s*=\s*(\S+)\s*$/m.exec(propertiesText);
  return match ? match[1] : undefined;
}

/**
 * @param {string[]} argv arguments after the script name
 * @returns {{ pullRequest?: string, branch?: string }}
 */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--pr") out.pullRequest = argv[++i];
    else if (argv[i] === "--branch") out.branch = argv[++i];
  }
  return out;
}

/**
 * @param {{ pullRequest?: number | string, branch?: string }} scope
 * @param {URLSearchParams} params
 */
function applyScope(scope, params) {
  if (scope.pullRequest) params.set("pullRequest", String(scope.pullRequest));
  else if (scope.branch) params.set("branch", scope.branch);
}

/**
 * @param {{ projectKey: string, pullRequest?: number | string, branch?: string }} options
 * @returns {string}
 */
export function buildIssuesUrl({ projectKey, ...scope }) {
  const params = new URLSearchParams({ componentKeys: projectKey, resolved: "false", ps: "200" });
  applyScope(scope, params);
  return `${SONAR_BASE}/api/issues/search?${params}`;
}

/**
 * @param {{ projectKey: string, pullRequest?: number | string, branch?: string }} options
 * @returns {string}
 */
export function buildGateUrl({ projectKey, ...scope }) {
  const params = new URLSearchParams({ projectKey });
  applyScope(scope, params);
  return `${SONAR_BASE}/api/qualitygates/project_status?${params}`;
}

/**
 * Turns the Sonar API issue list into readable lines, worst severity first.
 * @param {Array<{ severity: string, type: string, rule: string, component: string, line?: number, message: string }>} issues
 * @param {string} projectKey
 * @returns {string[]}
 */
export function formatIssues(issues, projectKey) {
  const rank = (/** @type {string} */ s) => {
    const i = SEVERITY_ORDER.indexOf(s);
    return i === -1 ? SEVERITY_ORDER.length : i;
  };
  return [...issues]
    .sort(
      (a, b) =>
        rank(a.severity) - rank(b.severity) ||
        a.rule.localeCompare(b.rule) ||
        a.component.localeCompare(b.component) ||
        (a.line ?? 0) - (b.line ?? 0),
    )
    .map((issue) => {
      const file = issue.component.replace(`${projectKey}:`, "");
      const where = issue.line ? `${file}:${issue.line}` : file;
      return `[${issue.severity}] ${issue.rule} ${where} - ${issue.message}`;
    });
}

/**
 * @param {any} json response of /api/issues/search
 * @returns {Array<any>}
 */
export function extractIssues(json) {
  if (typeof json !== "object" || json === null || !Array.isArray(json.issues)) {
    throw new TypeError("Unexpected response from SonarQube Cloud (no issues array).");
  }
  return json.issues;
}

/**
 * Picks the finished SonarQube Cloud check from a GitHub check-runs response.
 * @param {any} checkRunsResponse
 * @returns {any | undefined}
 */
export function findCompletedCheck(checkRunsResponse) {
  const runs = Array.isArray(checkRunsResponse?.check_runs) ? checkRunsResponse.check_runs : [];
  return runs.find((c) => c.app?.slug === SONAR_CHECK_APP && c.status === "completed");
}

/**
 * Fetches the quality gate and open issues and returns a ready-to-print report.
 * @param {{ projectKey: string, scope: { pullRequest?: number | string, branch?: string }, fetchJson: (url: string) => Promise<any> }} options
 * @returns {Promise<{ gateStatus: string, lines: string[] }>}
 */
export async function collectReport({ projectKey, scope, fetchJson }) {
  const [gate, issuesJson] = await Promise.all([
    fetchJson(buildGateUrl({ projectKey, ...scope })),
    fetchJson(buildIssuesUrl({ projectKey, ...scope })),
  ]);
  return {
    gateStatus: gate?.projectStatus?.status ?? "unknown",
    lines: formatIssues(extractIssues(issuesJson), projectKey),
  };
}
