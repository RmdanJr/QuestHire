import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      // `include` also lists untested files, so gaps stay visible in the report.
      include: ["src/**/*.{ts,tsx}", ".kiro/skills/submission-guard/scripts/check-submission.mjs", ".kiro/skills/pr-checks/scripts/lib/sonar.mjs", ".kiro/skills/pr-checks/scripts/lib/poll.mjs"],
      exclude: ["**/*.test.{ts,tsx}", "src/generated/**", "**/*.d.ts"],
      reporter: ["text-summary", "text", "lcov", "json-summary"],
      reportsDirectory: "coverage",
      // Gate: fail the run if coverage drops below these floors.
      // Measured baseline is ~88% statements / 91% lines; floors sit a few points
      // below so normal refactors pass but real regressions do not. Raise over time.
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 85,
      },
    },
  },
});
