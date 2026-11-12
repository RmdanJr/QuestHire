---
inclusion: always
---

# Project structure

Where things live and where new code goes. Stack and coding rules: `tech.md`.

## Top level
| Path | What it holds |
|---|---|
| `src/` | The Next.js app (all product code) |
| `tests/` | Tests that span files or import skill scripts (page tests, route tests, script tests) |
| `.kiro/skills/<name>/scripts/` | Developer and CI helpers run with `node` (CI watch, Sonar report, submission guard), each described by its skill's `SKILL.md` and exposed through an `npm run` alias |
| `prisma/` | `schema.prisma` and migrations; config in `prisma.config.ts` |
| `public/` | Static files served as-is (art and sound from Task 2 go under `public/art/` and `public/sound/`) |
| `docs/` | Project docs, including `kiro-usage-log.md` for the submission write-up |
| `.kiro/` | Kiro steering, specs, skills, hooks and agents (index in `.kiro/README.md`) |
| `.github/workflows/` | CI (`ci.yml`; both jobs are required checks on `main`) |
| `amplify.yml` | AWS Amplify Hosting build spec (Node 22) |
| `.local/` | Gitignored personal files (the user's resume fixture). Never commit |
| `src/generated/`, `coverage/`, `.next/` | Generated output, gitignored |

## Inside `src/`
| Path | What goes there |
|---|---|
| `src/app/` | Routes (App Router). Pages are thin; move logic out of them |
| `src/app/api/<name>/route.ts` | Route handlers. Keep them thin: validate input, call `src/lib`, return JSON |
| `src/components/ui/` | The Haunted Library component kit. Export new components from `index.ts` and show them in `/gallery` |
| `src/components/<feature>/` | Feature components (for example `battle/`, `map/`, `wardrobe/`) as features arrive |
| `src/design/` | Design tokens and contrast math |
| `src/lib/ui/` | Pure UI logic behind the meters |
| `src/lib/game/` | Pure game rules: scheduler, scout staircase, mastery, XP, boss composition. Property-tested |
| `src/lib/llm/` | `LLMClient` interface, Bedrock adapter, Zod schemas (Bedrock rules apply here) |
| `src/lib/code-runner/` | `CodeRunner` interface and the Judge0 client (Task 10) |
| `src/lib/<domain>/` | Other server-side logic (resume parsing, campaigns, problem bank) |

## Tests
- Unit tests sit next to the code as `*.test.ts(x)` (for example `src/lib/health.test.ts`).
- Cross-cutting tests and tests for skill scripts go in `tests/`.
- Every pure rule in `src/lib/game/` gets fast-check property tests.

## Naming
- Files: kebab-case for modules and scripts (`check-submission.mjs`), PascalCase for React components (`CandleHp.tsx`).
- Specs: `.kiro/specs/task-NN-<name>/`, matching the roadmap number.
- Product code goes in `src/`. Kiro-related tooling goes in a skill: `.kiro/skills/<name>/SKILL.md` plus `scripts/`. SonarQube Cloud skips dot folders, so skill scripts are covered by ESLint, tests and the coverage gate but not by Sonar; keep their logic small and well tested.
