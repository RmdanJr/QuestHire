# .kiro

Everything Kiro uses to build QuestHire. This folder must stay committed (Kiroween submission rule); `npm run check:submission` fails if it is gitignored. Organization rules live in [`steering/kiro-workflow.md`](steering/kiro-workflow.md).

## steering/
| File | Inclusion | Purpose |
|---|---|---|
| [`product.md`](steering/product.md) | always | What QuestHire is and its hard rules |
| [`roadmap.md`](steering/roadmap.md) | always | 15-task plan, decisions, current status, how to work on a task |
| [`kiro-workflow.md`](steering/kiro-workflow.md) | always | How to use Kiro features and keep this folder organized |
| [`tech.md`](steering/tech.md) | always | Stack and coding rules |
| [`structure.md`](steering/structure.md) | always | Folder layout and where new code goes |
| [`dev-environment.md`](steering/dev-environment.md) | always | Windows, PowerShell and tooling gotchas |
| [`theme-and-ui.md`](steering/theme-and-ui.md) | always | Haunted Library design system and accessibility |
| [`bedrock-schema-rules.md`](steering/bedrock-schema-rules.md) | fileMatch `src/lib/llm/**` | Bedrock structured-output limits |
| [`aws-and-deployment.md`](steering/aws-and-deployment.md) | auto | AWS identity, Amplify, budget, commands |
| [`research-and-licenses.md`](steering/research-and-licenses.md) | auto | Vetted providers, datasets, licenses and prices |
| [`kiroween-submission.md`](steering/kiroween-submission.md) | auto | Hackathon rules, judging criteria, submission checklist |

## specs/
| Spec | Status |
|---|---|
| [`task-01-foundation-and-design-system`](specs/task-01-foundation-and-design-system) | done |

New specs follow `task-NN-<name>` to match the roadmap.

## skills/
Workspace skills (`SKILL.md` plus a `scripts/` folder), the documented place for committed, executable helpers. `package.json` scripts, `vitest.config.mts` coverage and the tests in `tests/` point at these paths. SonarQube Cloud skips dot folders, so these scripts are checked by ESLint, tests and the coverage gate, not by Sonar (an accepted trade-off).

| Skill | Command | What it does |
|---|---|---|
| [`pr-checks`](skills/pr-checks/SKILL.md) | `npm run ci:watch`, `npm run sonar:issues` | Watches the CI run for the current commit; reports the Sonar quality gate and open issues |
| [`submission-guard`](skills/submission-guard/SKILL.md) | `npm run check:submission` | `/.kiro` tracked, LICENSE present, `.local/` ignored (also part of `npm run check`) |

## hooks/
| Hook | Trigger | What it does |
|---|---|---|
| `typecheck-on-save` | PostFileSave `*.ts(x)` | `npm run typecheck` |
| `prisma-validate-on-schema-save` | PostFileSave `prisma/schema.prisma` | `npm run db:validate` |
| `repo-guard-after-task` | PostTaskExec | `npm run check:submission` (submission-guard skill) |
| `update-roadmap-after-task` | PostTaskExec | Keeps roadmap status, spec checkboxes and the usage log current |
| `watch-ci-after-pr` | PostToolUse after `gh pr create` | Runs the pr-checks skill: watches CI, then fixes SonarQube Cloud findings |

## agents/
| Agent | Use it for |
|---|---|
| `design-system` | UI kit, tokens, gallery, accessibility |
| `aws-setup` | AWS resources with least privilege and cost checks; never root |

The running record of Kiro usage for the submission write-up is [`docs/kiro-usage-log.md`](../docs/kiro-usage-log.md).
