/** @param {number} ms */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls `attempt` until it returns a truthy value or the timeout passes.
 * Attempts run one after another on purpose (each one waits for the previous result),
 * so this uses recursion rather than an `await` inside a loop.
 *
 * `now` and `wait` can be injected so tests do not need real time.
 *
 * @template T
 * @param {() => Promise<T | null | undefined | false>} attempt
 * @param {{ timeoutMs: number, intervalMs: number, now?: () => number, wait?: (ms: number) => Promise<void> }} options
 * @returns {Promise<T | null>} the first truthy result, or null on timeout
 */
export async function pollUntil(attempt, { timeoutMs, intervalMs, now = Date.now, wait = sleep }) {
  const deadline = now() + timeoutMs;

  async function step() {
    const result = await attempt();
    if (result) return result;
    if (now() >= deadline) return null;
    await wait(intervalMs);
    return step();
  }

  return step();
}
