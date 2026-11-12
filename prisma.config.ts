import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Falls back to a placeholder so `prisma validate` and `prisma generate`
    // work in CI without a database. Real commands (migrate, db push) need DATABASE_URL.
    url:
      process.env["DATABASE_URL"] ||
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
