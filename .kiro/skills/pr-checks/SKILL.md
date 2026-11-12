---
name: pr-checks
description: Watch the GitHub Actions run for the current commit and read the SonarQube Cloud quality gate and open issues for the pull request. Use after pushing or opening a PR, or when CI or Sonar is failing.
license: MIT
compatibility: Node 22+, GitHub CLI (gh) signed in, run from the repo root
---

# PR checks

Two scripts that report what CI and SonarQube Cloud think of the current commit. The `watch-ci-after-pr` hook runs this skill automatically after `gh pr create`.

## Scripts
| Command | Script | Exit codes |
|---|---|---|
| `npm run ci:watch [-- <branch>]` | `scripts/watch-ci.mjs` | 0 passed, 1 failed (prints failed-step logs), 2 no run found or gh problem |
| `npm run sonar:issues [-- --pr <n> --branch <name>]` | `scripts/sonar-issues.mjs` | 0 no open issues, 1 issues found, 2 could not get results |

- `watch-ci` matches the run by **commit SHA**, so it never reports an older run by mistake. It waits up to 2 minutes for the run to appear.
- `sonar-issues` waits up to 5 minutes for the SonarQube Cloud check on the commit, then queries the public API (no token needed). The PR number comes from `gh pr view` unless passed in.
- Sonar only reports on files it indexed. It skips dot folders, so **these scripts are not analysed by Sonar** (a deliberate choice: Kiro scripts stay in `.kiro`). ESLint, the tests in `tests/` and the coverage gate still cover them.

## How to use the results
1. Fix CI first. CI starts from a clean checkout; reproduce from a clean copy before changing anything (see `dev-environment.md`).
2. Then fix Sonar findings at the root cause, one commit per rule. Never silence a rule, add exclusions, lower thresholds or delete tests to make a finding go away; ask the user if a finding looks like a false positive.
3. Push and re-run. Stop after two fix rounds and explain.

## Layout
- `scripts/lib/sonar.mjs` - pure logic (URL building, formatting, log sanitizing); unit tested in `tests/sonar-issues.test.ts`.
- `scripts/lib/poll.mjs` - `pollUntil` helper; tested in `tests/poll.test.ts`.
- `scripts/lib/cli.mjs` - the only place that spawns `git` and `gh` (fixed arguments, no shell).
- The two entry scripts are thin I/O glue and are excluded from coverage on purpose.

Text from the Sonar API is passed through `cleanText` and `normalizeGateStatus` before printing, to prevent log injection.
