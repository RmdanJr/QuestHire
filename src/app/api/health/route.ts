import { connection, NextResponse } from "next/server";
import { checkHealth } from "@/lib/health";

export async function GET() {
  // Cache Components can prerender handlers that touch no runtime data.
  // A health check must run per request, so opt out of prerendering explicitly.
  await connection();
  const result = await checkHealth(process.env.DATABASE_URL);
  return NextResponse.json(
    { status: result.status, db: result.db },
    { status: result.httpStatus },
  );
}
