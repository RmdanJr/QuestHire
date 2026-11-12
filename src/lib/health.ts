import { Pool } from "pg";

export type DbStatus = "unconfigured" | "ok" | "error";

export type HealthResult = {
  status: "ok" | "degraded";
  db: DbStatus;
  httpStatus: 200 | 503;
};

type Pinger = (connectionString: string) => Promise<void>;

/** Default pinger: opens a short-lived connection and runs SELECT 1. */
const pingPostgres: Pinger = async (connectionString) => {
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 3000,
    max: 1,
  });
  try {
    await pool.query("SELECT 1");
  } finally {
    await pool.end();
  }
};

/**
 * Reports app and database health.
 * - No DATABASE_URL: db is "unconfigured" and the app is still healthy (200).
 * - Reachable: db "ok" (200). Unreachable: db "error" (503).
 */
export async function checkHealth(
  databaseUrl: string | undefined,
  ping: Pinger = pingPostgres,
): Promise<HealthResult> {
  if (!databaseUrl || databaseUrl.trim() === "") {
    return { status: "ok", db: "unconfigured", httpStatus: 200 };
  }
  try {
    await ping(databaseUrl);
    return { status: "ok", db: "ok", httpStatus: 200 };
  } catch {
    return { status: "degraded", db: "error", httpStatus: 503 };
  }
}
