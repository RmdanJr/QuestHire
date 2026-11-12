---
inclusion: always
---

# QuestHire roadmap and current status

This file is the source of truth for the build plan. A new chat can be asked to "start Task N": read the task here, check **Current status**, then follow **How to work on a task**. Update this file whenever a task starts or finishes, or a decision changes.

## Current status (update this section)
- **Deadline:** Kiroween 2026 submission, Dec 4, 2026, 2:00 PM PT (Costume Contest category).
- **Done:** Task 1 (foundation and design system), plus CI hardening, SonarQube Cloud cleanup, coverage gate, and the first AWS Amplify deploy.
- **Next:** Task 2 (art pipeline) or Task 3 (Bedrock LLM client and model spike). AWS access is ready for Task 3.
- **Live app:** https://main.d1dlm8l72zqe87.amplifyapp.com (`/`, `/gallery`, `/api/health`).
- **Every PR gets** two required CI checks ("Lint, test and build (Node 24)" and "Amplify compatibility (Node 22)"), SonarQube Cloud and GitGuardian checks, and an Amplify preview at `https://pr-<number>.d1dlm8l72zqe87.amplifyapp.com` (deleted when the PR closes). A PR opened before previews existed needs a close and reopen to get one.

### What exists today
- Next.js 16 (App Router, Cache Components on), TypeScript, Tailwind 4, Framer Motion, Prisma 7 (empty schema), Zod 4, Vitest 5 + fast-check.
- Design tokens with contrast tests (`src/design`), component kit in `src/components/ui` (CandleHp, Hourglass, GrimoirePanel, RuneButton, MoonMeter, ScrollModal; meters are visually hidden native `<meter>` elements), landing page, `/gallery`, `/api/health`.
- CI (`.github/workflows/ci.yml`), two jobs, both required by branch protection on `main`: **"Lint, test and build (Node 24)"** runs `npm ci --ignore-scripts`, Prisma generate, `npm run check` (typecheck, lint, tests with coverage gate, prisma validate, submission guard), prod `npm audit` and the build; **"Amplify compatibility (Node 22)"** runs the tests and build on Node 22, the version Amplify uses. Renaming a job means updating branch protection too. The optional SonarQube Cloud scan step needs a `SONAR_TOKEN` secret (not set yet).
- Coverage gate in `vitest.config.mts`: statements 80, branches 80, functions 80, lines 85.
- Scripts: `npm run ci:watch` (watch the CI run for HEAD), `npm run sonar:issues` (quality gate and open issues for the PR), `npm run check:submission` (submission guard).
- Kiro: see `.kiro/README.md` for the full index of steering, specs, hooks and agents. Task 1 spec: `.kiro/specs/task-01-foundation-and-design-system`.
- AWS: Amplify app `questhire` deploys `main` on every push; $10/month budget alarm; work as IAM user `hassan`, never root. Details, commands and what is not created yet: `aws-and-deployment.md`.

### Related steering
`kiro-workflow.md` (how to use Kiro and organize `.kiro`), `dev-environment.md` (Windows/PowerShell and tooling gotchas), `aws-and-deployment.md`, `research-and-licenses.md` (vetted sources, licenses, prices), `kiroween-submission.md` (rules, judging, checklist).

## Decisions (do not re-litigate without the user)
- **Theme:** "The Crypt of the Hiring Manager", a haunted gothic library in dark storybook illustration style (painterly, warm candlelight against deep purple and teal). Every spooky element serves a function (candles = HP, hourglass = countdown, moon = readiness, runes = mastery, the Archivist = lessons and hints, wardrobe = resume upload as dressing in a role costume, boss door with the company name = the real interview, ectoplasm path = route through the plan's days).
- **Inputs:** resume PDF (parsed with `unpdf`, structured by the LLM), JD by paste or URL (no company/role web search in the MVP), interview email text optional; without it the user picks type, date and company. No LinkedIn.
- **Interview types (5):** initial/HR screen, behavioral, system design, algorithmic coding, live coding.
- **Topic loop:** Scout (adaptive placement) -> Lore scrolls (lessons on gaps only) -> Practice battle -> Mastery check; topic cleared at a mastery threshold; skip lessons after a perfect scout.
- **LLM:** Amazon Bedrock (Converse API, IAM auth, `AWS_REGION`) behind an `LLMClient` interface; tiered models (cheap Nova for bulk work, Claude Haiku / DeepSeek / Nova Pro for grading, chosen by the Task 3 spike). No AWS credits: pay per token. Optional Grok adapter behind the same interface. Follow `bedrock-schema-rules.md`.
- **Algorithmic problems:** Blind 75 from the `newfacade/LeetCodeDataset` (Hugging Face). Downloaded by a seed script at setup, **never committed**. Check its license first. Attribution and links back. Not LLM-generated.
- **Code execution:** self-hosted Judge0 CE on EC2 behind a `CodeRunner` interface. Live coding uses Node/TS. (Piston's public API closed in Feb 2026.)
- **System design bank:** only the 8 problems from `donnemartin/system-design-primer` (CC BY 4.0), adapted with visible attribution in the UI, README and a credits file. ByteByteGo and karanpratapsingh repos are CC BY-NC-ND and unusable.
- **Cost controls:** code-graded multiple choice, pre-generated cached questions, tiered models, per-session guest token caps, budget alarm, fallback to cached content when the budget is hit.
- **Accessibility:** target contrast ratios, reduced motion, keyboard use and labels. Never claim WCAG compliance.

## Task breakdown

**Task 1: Foundation and design system** - DONE.

**Task 2: Art pipeline**
- Objective: a consistent illustration set committed to the repo.
- Guidance: check the image tool's terms first (Grok Imagine about $0.02-0.04/image, or Nova Canvas on Bedrock; verify prices). One style guide and prompt template. Generate and curate about 60 images: guardians per interview type, costumes per role, the Archivist, boss doors, map and battle backgrounds. Optimize and lazy-load. CC0/royalty-free sound effects and ambient loops with a mute toggle (sound off by default). Record every asset's source and license in an assets/credits file.
- Tests: asset manifest check (files exist, within a size budget).
- Demo: the gallery shows real art and sound.

**Task 3: LLMClient on Bedrock and model spike**
- Objective: a reliable structured-output layer and a data-backed model choice.
- Guidance: check model prices and request model access; Converse adapter with IAM auth; Zod validate-and-retry wrapper; 120 s+ timeouts; schema warm-up script; schemas follow `bedrock-schema-rules.md`. Spike on 10-15 graded samples (behavioral, system design, code review) across a cheap Nova model, Claude Haiku and DeepSeek or Gemma; record consistency, schema failures, latency, cost and image-input support. Pick bulk and grading models. Create the app IAM role with only the needed Bedrock actions on the chosen model ARNs. Optional Grok adapter.
- Tests: mocked-response schema tests; spike report.
- Demo: dev page returning validated JSON from Bedrock; report with model choice and per-campaign cost.

**Task 4: Auth, guest mode and the wardrobe (resume ingestion)**
- Objective: register or play as a guest, upload a resume, "dress up" as a role.
- Guidance: Auth.js with a guest option; private S3 bucket (Block Public Access, encryption, short lifecycle expiry, presigned URLs; local storage in dev); `unpdf` parsing; profile pipeline. Wardrobe UI: costume selection plus parsed skills as stitched badges, editable. Never commit the user's real resume (it lives in `.local/`).
- Tests: parser fixture test, upload type/size validation.
- Demo: upload a resume and see the costume with stitched skill badges.

**Task 5: Summoning circle (campaign wizard)**
- Objective: create a campaign from interview details and a JD.
- Guidance: steps for type, company, role, date; optional email text parsing; JD by paste or URL fetch extracted to a structured JD; summoning animation reveals a gate with the countdown.
- Tests: JD extraction and email parsing fixtures.
- Demo: summon "System Design at Company X in 6 days" with an extracted JD summary.

**Task 6: Plan generation and dungeon map**
- Objective: a plan the player sees as a map.
- Guidance: gap analysis, weighted topics, scheduling by days left, per-type templates. Map with locked/unlocked rooms, ectoplasm path, clock-tower countdown, moon meter.
- Tests: property-based tests for the scheduler (total effort fits days left, priority ordering) and plan schema validation.
- Demo: a generated, animated map sized to the days left.

**Task 7: Battle engine**
- Objective: one real turn-based battle end to end.
- Guidance: encounter state machine, candle HP, XP, multiple choice and short answers, LLM grading with feedback, guardian reactions, cached pre-generated questions.
- Tests: state machine tests, grading contract test with a mocked LLM, e2e test (add Playwright with accessibility checks here).
- Demo: fight a guardian and watch candles snuff as feedback arrives.

**Task 8: Topic learning loop**
- Objective: Scout, Lore, Fight, Master for a topic (initial and behavioral first).
- Guidance: adaptive staircase (start level 2, up on correct, down on wrong, 5-6 questions), lessons in pieces from the Archivist, practice battle on gaps, mastery update (0-100), room clearing with a relic, skip option after a perfect scout.
- Tests: property-based tests for staircase and mastery; integration test for a full topic.
- Demo: one behavioral topic from placement to a cleared room.

**Task 9: Gamification and progress**
- Objective: a reason to return daily.
- Guidance: XP and levels, streaks, relics, dashboard with readiness moon (JD-weighted mean of mastery with decay) and countdown, spaced review of missed questions.
- Tests: property-based tests for XP/level formulas (monotonic, no overflow); streak and timezone edge cases.
- Demo: dashboard where the moon fills as rooms are cleared.

**Task 10: Judge0 on EC2 and CodeRunner**
- Objective: a reliable execution backend (start early).
- Guidance: Docker Compose on EC2 with the cgroup setup fixed for the AMI (Judge0 CE 1.13.1 is believed to need cgroup v1; verify), HTTPS in front, auth token, rate limits, stop the instance when idle, state the cost before creating it. `CodeRunner` interface with a Judge0 implementation and a dev fallback.
- Tests: contract tests for run, compile error, timeout, memory limit; health check.
- Demo: API route running Python and JS on the EC2 instance.

**Task 11: Problem bank and algorithmic encounter**
- Objective: play Blind 75 problems in the dungeon.
- Guidance: check the dataset license first. Seed script downloads data at setup (not committed) and loads the 75 slugs with attribution and links. Python and JS harnesses with ListNode/TreeNode serialization (about 15 of the 75 need it); drop problems that can't be harnessed. Monaco, visible and hidden tests, duel UI.
- Tests: run every seeded problem's reference solution through the harness; wrong-answer and timeout cases.
- Demo: solve Two Sum and watch the skeleton fall.

**Task 12: System design encounter (primer-based)**
- Objective: staged system-design fight built on the 8 system-design-primer problems, with attribution.
- Guidance: seed each primer solution into a structured record (prompt; stages: requirements, estimates, components, data, scale/trade-offs; key points; pitfalls; follow-ups), keeping original text separate from adapted fields. Check each solution file for third-party material; do not copy diagrams (players draw their own in Excalidraw). The LLM reframes the scenario to the campaign's company/role; grade each stage against the primer-derived key points; diagram goes to the model as an image if supported, otherwise as a structured text summary. Lore scrolls for gaps come from the primer's topic sections. Attribution to Donne Martin (CC BY 4.0) with an adaptation note in the UI, README and credits file.
- Tests: rubric schema tests; fixture regression test of good/mediocre/weak answers (from the Task 3 spike); every seeded problem has attribution fields.
- Demo: design a URL shortener, draw it, get a staged critique with follow-ups and visible attribution.

**Task 13: Live coding encounter**
- Objective: build a small service, then defend it.
- Guidance: spec and starter files in Monaco, Node/TS tests via Judge0 multi-file, team Q&A graded by rubric. Fall back to LLM review if Judge0 isn't ready.
- Tests: known-good and known-broken solutions; Q&A schema test.
- Demo: build a tiny API, pass the tests, answer "why this design?"

**Task 14: Boss fight and finale**
- Objective: the headline moment.
- Guidance: a boss per interview type mixing earlier topics and scaling with readiness. Boss door with the company's name, costume-specific boss personality, victory/defeat screens, post-game readiness report ("what to improve before the real interview").
- Tests: property-based tests for boss composition (covers highest-weight topics, respects the type); full e2e run.
- Demo: win the final battle and see the readiness report.

**Task 15: Polish, deploy and submission**
- Objective: ready to submit by Dec 4, 2:00 PM PT.
- Guidance: accessibility and performance passes; production deploy on Amplify; seeded demo campaign without personal data, plus judge credentials (in the private Devpost form only); README (architecture, setup, dataset download and attribution, primer attribution, costs); Kiro-usage write-up (IDE/CLI/Crew, custom agents, hooks, specs, steering, MCP, property-based testing, powers); blog post and social post with #KiroweenHackathon26; demo video under 3 minutes (no copyrighted music); verify `/.kiro` is committed and a license is detectable.
- Tests: production smoke test; manual run of the demo script.
- Demo: the live product with a repeatable 3-minute demo.

**Timeline:** Nov 12-18 Tasks 1-5; Nov 19-25 Tasks 6-10; Nov 26-Dec 1 Tasks 11-14; Dec 2-4 Task 15 and submit early.

**Cut order if behind:** voice, leaderboards, live coding reduced to Monaco + LLM review, system design reduced to text only, JS/TS reduced to Python only. Never cut the UI polish of the core path (wardrobe, map, battle, boss).

## How to work on a task
1. Read this file and the relevant steering. Confirm the task's assumptions that need checking (prices, licenses, availability) and say what you verified.
2. Create a spec under `.kiro/specs/task-NN-<name>/` (requirements, then design and tasks) before larger work, following `kiro-workflow.md`.
3. Branch from an up-to-date `main` (for example `feat/task-2-art`). Never push to `main` directly.
4. Make small commits with messages under 50 characters. Git author for this repo is `RmdanJrx@gmail.com` (set locally).
5. Verify before each push: `npm run check` and `npm run build`. CI starts from a clean checkout, so test from a clean copy when changing install or build steps.
6. Open a PR with `gh pr create` (body: summary, testing, not done). The watch hook then runs `node .kiro/skills/pr-checks/scripts/watch-ci.mjs` and `node .kiro/skills/pr-checks/scripts/sonar-issues.mjs`; fix failures at the root cause, never by silencing rules or lowering thresholds.
7. When the task is merged, update **Current status** above, tick the spec's `tasks.md`, and append the Kiro features used to `docs/kiro-usage-log.md`.

## Open items
- User to rotate the root password that was pasted in an earlier chat, and enable MFA for root and `hassan`.
- `SONAR_TOKEN` secret and turning off SonarQube Cloud Automatic Analysis, so CI can upload coverage.
- 7 moderate `npm audit` findings in dev tooling (`@typescript-eslint` chain); `eslint@9` flagged deprecated.
- Kiro permissions: the user was given a workspace `permissions.yaml` (allow all shell commands, with an `ask` list for deletes, force pushes, pushes to `main`, `gh api` writes, AWS writes/IAM and installs) to paste into `~/.kiro/workspace-roots/<hash>/permissions.yaml`; agents cannot write it themselves. Not confirmed applied.
