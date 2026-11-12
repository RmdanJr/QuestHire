---
inclusion: always
---

# Kiro workflow and .kiro organization

Kiro usage is a scored judging criterion ("Technological Implementation"), so use Kiro features deliberately on every task and record them in `docs/kiro-usage-log.md`.

## Use Kiro features by default
- **Specs** for every roadmap task: `.kiro/specs/task-NN-<kebab-name>/` with `requirements.md` (EARS-style acceptance criteria), `design.md` and `tasks.md` (checkboxes linked to requirement numbers). Write the spec before code for anything bigger than a small fix, and tick tasks as they finish.
- **Steering** for durable knowledge: conventions, decisions, gotchas and research. When something is learned the hard way in chat, save it to the right steering file before the session ends.
- **Hooks** for repeatable checks instead of remembering them. Create hooks with the `createHook` tool, never by writing JSON by hand. Hooks only activate in the next session.
- **Custom agents** in `.kiro/agents/` for recurring roles (`design-system`, `aws-setup`). Add one when a role keeps coming back. List `skill://.kiro/skills/*/SKILL.md` in their `resources`; custom agents do not load skills by default.
- **Skills** in `.kiro/skills/<name>/` (`SKILL.md` with `name` matching the folder and a `description`, plus `scripts/`) for deterministic, repeatable helpers. This is the documented place for committed scripts; there is no `.kiro/scripts/` convention. Keep pure logic in the skill's `scripts/lib/` with tests in the repo's `tests/` folder, and expose each script through an `npm run` alias so hooks and CI do not hard-code paths.
- **Sub-agents:** `context-gatherer` for unfamiliar code, `introspect` for Kiro questions, `general-task-execution` for parallel work.
- **Property-based tests** (fast-check) for every pure game rule.
- **MCP and powers:** check whether one fits before building tooling (for example a browser MCP for UI screenshot checks in Task 7 or 15, an AWS power for infrastructure). Record what was tried.

## .kiro layout (keep it this way)
```
.kiro/
  README.md                index of everything below
  steering/                instructions loaded into chats
    product.md             what QuestHire is, hard rules              (always)
    roadmap.md             15-task plan, decisions, current status    (always)
    kiro-workflow.md       this file                                  (always)
    engineering-conventions.md  stack and coding rules                (always)
    dev-environment.md     Windows, PowerShell and tooling gotchas    (always)
    theme-and-ui.md        design system and accessibility rules      (always)
    bedrock-schema-rules.md     Bedrock structured-output limits      (fileMatch src/lib/llm/**)
    aws-and-deployment.md  AWS account, Amplify, cost controls        (auto)
    research-and-licenses.md    vetted sources, licenses, prices      (auto)
    kiroween-submission.md hackathon rules and judging criteria       (auto)
  specs/task-NN-<name>/    requirements.md, design.md, tasks.md
  skills/<name>/           SKILL.md + scripts/ (committed executable helpers)
    pr-checks/             CI watch and SonarQube Cloud report
    submission-guard/      Kiroween submission and privacy checks
  hooks/<verb>-<object>.json   created with createHook
  agents/<role>.md         custom agents
```

## Organization rules
- **Naming:** kebab-case everywhere. Specs are `task-NN-<name>` matching the roadmap number. Hooks are named after what they do (`watch-ci-after-pr`).
- **One topic per steering file.** Update the existing file instead of adding a near-duplicate. If a file grows past about 300 lines, split it and update this layout and `.kiro/README.md`.
- **Pick the narrowest inclusion:** `always` only for rules needed in most chats; `fileMatch` for file-specific rules; `auto` (with `name` and `description`) for reference material.
- **Never put secrets in `.kiro`:** no passwords, tokens, keys or the AWS account ID. `.kiro` is public in the repo.
- **Never gitignore `.kiro`.** It is a submission requirement and `npm run check:submission` enforces it.
- **Keep `.kiro/README.md` and the layout above in sync** whenever files are added, renamed or removed.

## Before ending a session
1. Update **Current status** in `roadmap.md` if a task started, finished or changed.
2. Save new gotchas to `dev-environment.md`, and new research or licensing findings to `research-and-licenses.md`.
3. Append the Kiro features used to `docs/kiro-usage-log.md`.
