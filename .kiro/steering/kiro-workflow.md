---
inclusion: always
---

# Kiro workflow and .kiro organization

Kiro usage is a scored judging criterion ("Technological Implementation"), so use Kiro features deliberately on every task and record them in `docs/kiro-usage-log.md`.

## Use Kiro features by default
- **Specs: one feature spec per roadmap task, created when that task starts** (not all up front; later designs depend on earlier results, such as the Task 3 model choice). Kiro's docs recommend multiple specs, one per feature, rather than one big spec. See "Spec workflow" below.
- **Steering** for durable knowledge: conventions, decisions, gotchas and research. When something is learned the hard way in chat, save it to the right steering file before the session ends.
- **Hooks** for repeatable checks instead of remembering them. Create hooks with the `createHook` tool, never by writing JSON by hand. Hooks only activate in the next session.
- **Custom agents** in `.kiro/agents/` for recurring roles (`design-system`, `aws-setup`). Add one when a role keeps coming back. List `skill://.kiro/skills/*/SKILL.md` in their `resources`; custom agents do not load skills by default.
- **Skills** in `.kiro/skills/<name>/` hold committed, repeatable tools: a `SKILL.md` (frontmatter `name` matching the folder, plus a `description`) that tells the agent when and how to use it, and a `scripts/` folder with the code (shared helpers in `scripts/lib/`, tests in the repo's `tests/`). Expose every script through an `npm run` alias so hooks and CI never hard-code paths. Trade-off we accepted: SonarQube Cloud skips dot folders, so code under `.kiro` is covered by ESLint, tests and the coverage gate but not by Sonar. There is no `.kiro/scripts/` convention, and Kiro powers install globally (`~/.kiro/powers/`), so skills are the per-project home for scripts.
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
    tech.md                stack and coding rules                     (always)
    structure.md           folder layout, where new code goes         (always)
    dev-environment.md     Windows, PowerShell and tooling gotchas    (always)
    theme-and-ui.md        design system and accessibility rules      (always)
    bedrock-schema-rules.md     Bedrock structured-output limits      (fileMatch src/lib/llm/**)
    aws-and-deployment.md  AWS account, Amplify, cost controls        (auto)
    research-and-licenses.md    vetted sources, licenses, prices      (auto)
    kiroween-submission.md hackathon rules and judging criteria       (auto)
  specs/task-NN-<name>/    requirements.md, design.md, tasks.md (one per roadmap task)
  skills/<name>/           SKILL.md + scripts/ (committed tools; npm run aliases)
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

## Spec workflow (per roadmap task)
1. **Start it in a Kiro spec session**, not by hand-writing files, so the Review button, task execution UI and our `PostTaskExec` hooks (`repo-guard-after-task`, `update-roadmap-after-task`) all work. Name the spec `task-NN-<name>` and seed it from the task's entry in `roadmap.md`.
2. **Pick the workflow when creating it** (it cannot be switched later):
   - **Requirements-first** (default) when the behaviour is clear: Tasks 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14.
   - **Design-first** when architecture or feasibility comes first: Task 3 (LLM client and model spike) and Task 10 (Judge0 on EC2).
   - **Quick Spec** (single pass, no approval gates) only for small, well-understood work, such as parts of Task 15.
   - **Bugfix spec** (`bugfix.md`) for tricky or regression-prone bugs; a plain chat fix is fine for trivial ones.
3. **Iterate with the user at each gate:** requirements (EARS: `WHEN ... THE SYSTEM SHALL ...`), then design (architecture, data flow, interfaces, data models, error handling, testing strategy), then tasks linked to requirement numbers.
4. **Run tasks from the spec** (`#spec:task-NN-<name> implement task 2.1`, or the task UI) so status updates and hooks fire. Use Sync Files after edits made outside the spec.
5. **Keep it living:** when a decision changes, update requirements and design first, then sync tasks.
6. Do not retro-write specs for finished work as if they guided it. Task 1's spec is a record written after delivery; say so where it matters (for example in the Kiro write-up).
