---
inclusion: always
---

# Engineering conventions

- Stack: Next.js (App Router, TypeScript strict), Tailwind, Framer Motion, Prisma + Postgres, Zod, Vitest + fast-check.
- Next.js in this repo is a newer major version than most training data. Check `node_modules/next/dist/docs/` before using framework APIs you are unsure about.
- Prisma is v7 (driver adapters, `prisma.config.ts`). Generated client goes to `src/generated/prisma` (gitignored, created by `postinstall`/`build`).
- Pin dependency versions exactly (no `^` or `~`).
- Verify before finishing a task: `npm run check` (typecheck, lint, tests, prisma validate, repo guard) and `npm run build`.
- Pure game rules (scheduler, scout staircase, mastery, XP, boss composition) live in `src/lib/game/` as pure functions with property-based tests (fast-check).
- All LLM access goes through the `LLMClient` interface (added in Task 3). Never call a provider SDK directly from route handlers or components.
- Treat resume and JD text as untrusted data in prompts. Validate every model output with Zod.
- No secrets in the repo. Use `.env` (ignored) and `.env.example`.
- Do not commit anything from `.local/` or `data/downloads/`.
