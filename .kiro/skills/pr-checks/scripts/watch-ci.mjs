#!/usr/bin/env node
/**
 * Watch the GitHub Actions run for the current commit and report the result.
 *
 * Usage: node scripts/watch-ci.mjs [branch]
 *
 * - Finds the run whose head commit matches local HEAD (so an old run is never mistaken for this one).
 * - Waits for the run to start, then streams it with `gh run watch`.
 * - On failure, prints the tail of the failed-step logs and exits 1.
 * Exit codes: 0 = passed, 1 = failed, 2 = no run found / gh problem.
 *
 * Requires the GitHub CLI (`gh`) signed in with repo access.
 */
import { capture, run } from "./lib/cli.mjs";
import { pollUntil } from "./lib/poll.mjs";

const WAIT_FOR_RUN_MS = 120_000;
const POLL_MS = 5_000;
const LOG_TAIL_LINES = 80;

function fail(code, message) {
  console.error(message);
  process.exit(code);
}

/**
 * @param {string} branch
 * @param {string} sha
 */
function findRun(branch, sha) {
  return pollUntil(
    async () => {
      const runs = JSON.parse(
        capture("gh", [
          "run", "list", "--branch", branch, "--limit", "10",
          "--json", "databaseId,headSha,status,conclusion,workflowName,event",
        ]),
      );
      return runs.find((r) => r.headSha === sha);
    },
    { timeoutMs: WAIT_FOR_RUN_MS, intervalMs: POLL_MS },
  );
}

async function main() {
  let branch;
  let sha;
  try {
    branch = process.argv[2] ?? capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    sha = capture("git", ["rev-parse", "HEAD"]);
    capture("gh", ["--version"]);
  } catch (error) {
    fail(2, `Cannot run git/gh: ${error instanceof Error ? error.message : error}`);
  }

  console.log(`Looking for a CI run on "${branch}" at ${sha.slice(0, 7)}...`);

  let found;
  try {
    found = await findRun(branch, sha);
  } catch (error) {
    fail(2, `gh run list failed: ${error instanceof Error ? error.message : error}`);
  }
  if (!found) {
    fail(
      2,
      `No CI run found for ${sha.slice(0, 7)} on "${branch}" after ${WAIT_FOR_RUN_MS / 1000}s. ` +
        "Workflows trigger on pull requests and pushes to main; confirm the PR exists and the push succeeded.",
    );
  }

  console.log(`Watching ${found.workflowName} (run ${found.databaseId}, event: ${found.event})`);
  const watch = run("gh", ["run", "watch", String(found.databaseId), "--exit-status"], {
    inherit: true,
  });
  if (watch.status === 0) {
    console.log("\nCI passed.");
    return;
  }

  console.error("\nCI FAILED. Failed-step logs (tail):");
  const logs = run("gh", ["run", "view", String(found.databaseId), "--log-failed"]);
  const lines = logs.stdout.split(/\r?\n/).filter(Boolean);
  console.error(lines.slice(-LOG_TAIL_LINES).join("\n") || "(no failed-step logs available)");
  console.error(`\nFull run: gh run view ${found.databaseId} --web`);
  process.exit(1);
}

await main();
