import { afterEach, describe, expect, it, vi } from "vitest";

// connection() only works inside a real request scope; stub it for unit tests.
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, connection: async () => undefined };
});

const query = vi.fn();
const end = vi.fn();
vi.mock("pg", () => ({
  Pool: class {
    query = query;
    end = end;
  },
}));

import { GET } from "@/app/api/health/route";
import { checkHealth } from "@/lib/health";

afterEach(() => {
  vi.unstubAllEnvs();
  query.mockReset();
  end.mockReset();
});

describe("GET /api/health", () => {
  it("returns 200 and 'unconfigured' when there is no database URL", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", db: "unconfigured" });
  });

  it("returns 200 and 'ok' when the database answers", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example");
    query.mockResolvedValue({ rows: [] });
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", db: "ok" });
  });

  it("returns 503 and 'error' when the database is unreachable", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example");
    query.mockRejectedValue(new Error("ECONNREFUSED"));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "degraded", db: "error" });
  });
});

describe("default Postgres pinger", () => {
  it("runs SELECT 1 and closes the pool on success", async () => {
    query.mockResolvedValue({ rows: [] });
    await checkHealth("postgresql://example");
    expect(query).toHaveBeenCalledWith("SELECT 1");
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("still closes the pool when the query fails", async () => {
    query.mockRejectedValue(new Error("boom"));
    const result = await checkHealth("postgresql://example");
    expect(result.db).toBe("error");
    expect(end).toHaveBeenCalledTimes(1);
  });
});
