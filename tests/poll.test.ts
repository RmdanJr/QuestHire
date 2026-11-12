import { describe, expect, it, vi } from "vitest";
import { pollUntil } from "../.kiro/skills/pr-checks/scripts/lib/poll.mjs";

/** A fake clock: `wait` advances time, so tests are instant and deterministic. */
function fakeClock() {
  let t = 0;
  const waits: number[] = [];
  return {
    now: () => t,
    wait: async (ms: number) => {
      waits.push(ms);
      t += ms;
    },
    waits,
  };
}

describe("pollUntil", () => {
  it("returns immediately when the first attempt succeeds, without waiting", async () => {
    const clock = fakeClock();
    const attempt = vi.fn().mockResolvedValue("done");
    const result = await pollUntil(attempt, { timeoutMs: 1000, intervalMs: 100, ...clock });
    expect(result).toBe("done");
    expect(attempt).toHaveBeenCalledTimes(1);
    expect(clock.waits).toEqual([]);
  });

  it("retries at the given interval until an attempt succeeds", async () => {
    const clock = fakeClock();
    const attempt = vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ id: 7 });
    const result = await pollUntil(attempt, { timeoutMs: 10_000, intervalMs: 250, ...clock });
    expect(result).toEqual({ id: 7 });
    expect(attempt).toHaveBeenCalledTimes(3);
    expect(clock.waits).toEqual([250, 250]);
  });

  it("returns null once the timeout has passed", async () => {
    const clock = fakeClock();
    const attempt = vi.fn().mockResolvedValue(null);
    const result = await pollUntil(attempt, { timeoutMs: 500, intervalMs: 200, ...clock });
    expect(result).toBeNull();
    // attempts at t=0, 200, 400, 600 (the last one is past the deadline, so it stops)
    expect(attempt).toHaveBeenCalledTimes(4);
  });

  it("runs attempts strictly one after another", async () => {
    const clock = fakeClock();
    let running = 0;
    let maxRunning = 0;
    let calls = 0;
    const attempt = async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await Promise.resolve();
      running--;
      return ++calls >= 3 ? "ok" : null;
    };
    await pollUntil(attempt, { timeoutMs: 1000, intervalMs: 10, ...clock });
    expect(maxRunning).toBe(1);
  });

  it("propagates errors from an attempt instead of swallowing them", async () => {
    const clock = fakeClock();
    const attempt = vi.fn().mockRejectedValue(new Error("gh failed"));
    await expect(pollUntil(attempt, { timeoutMs: 1000, intervalMs: 10, ...clock })).rejects.toThrow(
      "gh failed",
    );
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  it("uses real timers by default", async () => {
    vi.useFakeTimers();
    try {
      const attempt = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce("later");
      const promise = pollUntil(attempt, { timeoutMs: 5000, intervalMs: 1000 });
      await vi.advanceTimersByTimeAsync(1000);
      await expect(promise).resolves.toBe("later");
    } finally {
      vi.useRealTimers();
    }
  });
});
