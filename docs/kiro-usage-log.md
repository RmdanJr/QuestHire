# Kiro usage log

A running record of how Kiro was used to build QuestHire. It feeds the Kiroween "how Kiro was used" write-up (Task 15). Append to it at the end of each session: what feature, what it was used for, and what changed because of it.

## Session 1 (Nov 12, 2026): planning, foundation, CI and first deploy

### Planning in chat (vibe mode) before any code
- Iterated on the idea with Kiro over many rounds of structured questions: theme, inputs, interview types, learning loop, stack, LLM provider, code execution, problem sources and licensing.
- Kiro checked facts on the web instead of assuming: Grok and Bedrock structured-output rules and prices, Piston's closed public API, Judge0 features, Codewars/Codeforces APIs, dataset and content licenses (system-design-primer CC BY 4.0 vs ByteByteGo and karanpratapsingh CC BY-NC-ND), the Kiroween rules and judging criteria, Amplify's Next.js support and App Runner's closure to new customers.
- Result: a 15-task plan with explicit cut order, saved as steering (`.kiro/steering/roadmap.md`) so any new chat can start a task.

### Steering
- `product.md`, `theme-and-ui.md`, `engineering-conventions.md` (always), `bedrock-schema-rules.md` (fileMatch on `src/lib/llm/**`).
- Added later: `roadmap.md`, `kiro-workflow.md`, `dev-environment.md` (always), and `aws-and-deployment.md`, `research-and-licenses.md`, `kiroween-submission.md` (auto inclusion).
- Strategy: always-on files stay short and rule-like; reference material is auto-included only when relevant; hard-won gotchas (PowerShell, Next 16, Prisma 7, Amplify) are written down so they are not rediscovered.

### Specs
- `task-01-foundation-and-design-system`: requirements in EARS style (meters, focus, contrast, health endpoint, submission guards), then design and tasks recorded after delivery.

### Hooks (created with the `createHook` tool)
- `typecheck-on-save` and `prisma-validate-on-schema-save` (PostFileSave).
- `repo-guard-after-task` (PostTaskExec): checks `/.kiro` is tracked, LICENSE exists and personal fixtures stay ignored.
- `watch-ci-after-pr` (PostToolUse after `gh pr create`): watches GitHub Actions, then reads SonarQube Cloud findings for the PR and fixes them at the root cause, never by silencing rules. Run on PR #2 it found 5 issues in brand-new code (unpinned action, backtracking regex, await in a loop, log injection) and drove them to a clean quality gate.

### Custom agents
- `design-system`: scoped to the UI kit and tokens, loads steering, may run lint/typecheck/tests without asking.
- `aws-setup`: never uses root credentials, read-only AWS calls allowed, anything billable or IAM-related needs approval with the cost stated first.

### Sub-agents
- `introspect` answered Kiro questions from the official docs: custom agent file format, and how shell approval works in Kiro 1.x (`permissions.yaml`, deny > ask > allow).

### Property-based testing (fast-check)
- Contrast ratio is symmetric, within [1, 21], and 1 for identical colors.
- Candle HP is always an integer in [0, max] and monotonic; moon illumination stays in [0, 1] and is monotonic; hourglass fill stays in [0, 1].
- PBT found a bug in the test itself on the first run (a property returning `false` from an `expect` arrow) and the contrast test caught a real design flaw: the panel border color was 1.94:1 against a 3:1 target.

### What Kiro changed in the process
- The first CI run failed on GitHub (`LayoutProps` missing in a clean checkout). That led to testing from clean copies and to the CI-watch hook.
- SonarQube Cloud flagged 19 issues on PR #1; all were fixed one rule per commit, including a real accessibility improvement (native `<meter>` instead of `role="meter"`).
- Coverage went from 72% to about 94% lines with a gate that was verified to fail when coverage drops.
- Deployed to AWS Amplify from the CLI as a non-root IAM user, with a budget alarm created first.

### Not used yet (planned)
- MCP servers (browser screenshots for UI checks in Task 7/15), Kiro powers (AWS), Kiro CLI or Crew.

### Skills (added at the end of session 1)
- Moved the helper scripts into two workspace skills: `.kiro/skills/pr-checks` (CI watch and SonarQube Cloud report) and `.kiro/skills/submission-guard` (submission and privacy checks). Each has a `SKILL.md` that tells the agent when and how to use it.
- Checked against the Kiro docs first (via the `introspect` sub-agent): skills are the documented place for committed scripts; there is no `.kiro/scripts/` convention, and powers install globally rather than per project.
- Hooks now call `npm run` aliases instead of file paths, and both custom agents load the skills through `skill://` resources.
