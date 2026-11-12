#!/usr/bin/env node
/**
 * List the SonarQube Cloud issues for the current pull request (or branch).
 *
 * Usage: node .kiro/skills/pr-checks/scripts/sonar-issues.mjs [--pr <number>] [--branch <name>]
 *
 * - Waits for the SonarQube Cloud check on the current commit to finish.
 * - Prints the quality gate status and every open issue, worst first.
 * Exit codes: 0 = no open issues, 1 = issues found, 2 = could not get results.
 *
 * Works without a token because the project is public.
 * The logic lives in .kiro/skills/pr-checks/scripts/lib/sonar.mjs (unit tested); this file is only I/O glue.
 */
import { readFileSync } from "node:fs";
import { capture } from "./lib/cli.mjs";
import { pollUntil } from "./lib/poll.mjs";
import { collectReport, findCompletedCheck, parseArgs, parseProjectKey } from "./lib/sonar.mjs";

const WAIT_FOR_CHECK_MS = 300_000;
const POLL_MS = 10_000;

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

function waitForSonarCheck(sha) {
  return pollUntil(
    async () => {
      const data = JSON.parse(capture("gh", ["api", `repos/{owner}/{repo}/commits/${sha}/check-runs`]));
      return findCompletedCheck(data);
    },
    { timeoutMs: WAIT_FOR_CHECK_MS, intervalMs: POLL_MS },
  );
}

function currentPullRequest() {
  try {
    return JSON.parse(capture("gh", ["pr", "view", "--json", "number"])).number;
  } catch {
    return undefined; // no pull request for this branch
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectKey = parseProjectKey(readFileSync("sonar-project.properties", "utf8"));
  if (!projectKey) {
    console.error("sonar.projectKey not found in sonar-project.properties");
    process.exit(2);
  }

  const sha = capture("git", ["rev-parse", "HEAD"]);
  const scope = {
    pullRequest: args.pullRequest ?? currentPullRequest(),
    branch: args.branch ?? capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]),
  };

  console.log(`Waiting for the SonarQube Cloud check on ${sha.slice(0, 7)}...`);
  if (!(await waitForSonarCheck(sha))) {
    console.error("The SonarQube Cloud check did not complete within 5 minutes (or is not installed).");
    process.exit(2);
  }

  const { gateStatus, lines } = await collectReport({ projectKey, scope, fetchJson });
  console.log(`Quality gate: ${gateStatus}`);
  if (lines.length === 0) {
    console.log("No open SonarQube Cloud issues.");
    return;
  }
  console.error(`${lines.length} open issue(s):`);
  console.error(lines.join("\n"));
  process.exit(1);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
}
