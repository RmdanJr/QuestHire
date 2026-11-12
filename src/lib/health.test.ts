import { describe, expect, it, vi } from "vitest";
import { checkHealth } from "./health";

describe("checkHealth", () => {
  it("reports unconfigured (200) when DATABASE_URL is missing or blank", async () => {
    const ping = vi.fn();
    expect(await checkHealth(undefined, ping)).toEqual({
      status: "ok",
      db: "unconfigured",
      httpStatus: 200,
    });
    expect((await checkHealth("   ", ping)).db).toBe("unconfigured");
    expect(ping).not.toHaveBeenCalled();
  });

  it("reports ok (200) when the database answers", async () => {
    const ping = vi.fn().mockResolvedValue(undefined);
    const result = await checkHealth("postgresql://x", ping);
    expect(result).toEqual({ status: "ok", db: "ok", httpStatus: 200 });
    expect(ping).toHaveBeenCalledWith("postgresql://x");
  });

  it("reports error (503) when the database is unreachable", async () => {
    const ping = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    expect(await checkHealth("postgresql://x", ping)).toEqual({
      status: "degraded",
      db: "error",
      httpStatus: 503,
    });
  });
});
