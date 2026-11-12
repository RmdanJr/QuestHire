---
name: submission-guard
description: Check the repo still meets the Kiroween submission rules and keeps personal data out - /.kiro tracked and not gitignored, an open-source LICENSE present, and the .local/ fixtures folder ignored. Use after editing .gitignore or before submitting.
license: MIT
compatibility: Node 22+, run from the repo root
---

# Submission guard

Runs as part of `npm run check` (and therefore in CI) and after every spec task through the `repo-guard-after-task` hook.

## Command
`npm run check:submission` runs `scripts/check-submission.mjs`. Exit 0 when everything is fine; exit 1 with a list of problems otherwise.

## What it checks
| Check | Why |
|---|---|
| `/.kiro` exists | Kiroween requires it at the repo root |
| `.kiro` is not gitignored | Ignoring it can disqualify the submission |
| `LICENSE` exists | An open-source license must be detectable |
| `.local/` is gitignored | It holds the user's real resume (personal data) |

## How it works
- `findProblems({ hasKiroDir, hasLicense, gitignoreText })` is pure; `checkRepo(root)` reads the facts from disk. Both are tested in `tests/check-submission.test.ts`, including real temporary folders.
- Ignore rules are evaluated with the `ignore` package (the same rules git uses), so the script never spawns `git`.
- SonarQube Cloud skips dot folders, so this script is not analysed by Sonar; ESLint, tests and the coverage gate cover it.

## If it fails
Fix the repo, not the check: remove the `.kiro` rule from `.gitignore`, restore `LICENSE`, or re-add `/.local/` to `.gitignore`. Never weaken the checks.
