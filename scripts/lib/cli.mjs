import { spawnSync } from "node:child_process";

/**
 * Runs a developer CLI (git, gh) and returns its result.
 *
 * Why this is the only place that spawns processes: these are local and CI helper
 * scripts that intentionally use the developer's own `git` and `gh` from PATH.
 * No shell is used and arguments are passed as an array, so nothing is interpolated.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {{ inherit?: boolean }} [options] inherit=true streams output to the terminal
 * @returns {{ status: number, stdout: string, stderr: string }}
 */
export function run(command, args, { inherit = false } = {}) {
  const result = spawnSync(command, args, { // NOSONAR S4036: dev/CI helper, fixed arguments, no shell
    encoding: "utf8",
    stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
  return {
    status: result.status ?? 1,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
  };
}

/**
 * Like run(), but throws on a non-zero exit and returns stdout.
 * @param {string} command
 * @param {string[]} args
 * @returns {string}
 */
export function capture(command, args) {
  const result = run(command, args);
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

/** @param {number} ms */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
