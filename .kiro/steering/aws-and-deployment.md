---
inclusion: auto
name: aws-and-deployment
description: QuestHire AWS account setup, Amplify Hosting deployment, budget and cost controls, IAM rules. Use when deploying, checking a build, or creating AWS resources.
---

# AWS and deployment

## Identity and safety
- Work as the IAM user `hassan` (AdministratorAccess). **Never use root.** Sign in with `aws login --region us-east-1`; confirm with `aws sts get-caller-identity` (the ARN must not end in `:root`). If the CLI is still on a cached root session, run `aws logout` then `aws login` with the browser signed in as `hassan`.
- Do not write the account ID, keys, tokens or passwords into the repo. Ask the user before creating anything billable, and state the cost or "unknown, check pricing".
- The user has **no AWS credits**: everything is pay as you go.
- Pending on the user: rotate the root password that was pasted in chat; MFA for root and `hassan`; optionally enable "IAM user and role access to Billing information" and detach the three redundant policies from `hassan`.

## Cost controls
- Budget `questhire-monthly`: $10/month, email `RmdanJrx@gmail.com` at 50% and 100% of actual and 100% of forecast. Check with `aws budgets describe-budgets --account-id <id>` (get the ID from `sts get-caller-identity`).
- Stop or delete anything idle (Judge0 EC2 instance in Task 10).

## Amplify Hosting
- App `questhire`, id `d1dlm8l72zqe87`, us-east-1, platform `WEB_COMPUTE` (SSR). Branch `main`: framework `Next.js - SSR`, stage PRODUCTION, auto-build on push.
- Live URL: https://main.d1dlm8l72zqe87.amplifyapp.com. Smoke test `/`, `/gallery` and `/api/health` (expect `{"status":"ok","db":"unconfigured"}` until a database exists).
- Connected to GitHub with the `gh` token passed once at app creation (not stored in the repo).
- **PR previews need the Amplify GitHub App** installed on the repo (the user did this in the console: Hosting > Previews > Install GitHub app, only the QuestHire repo). An app connected only through the token-created `push` webhook builds `main` but never sees PR events. The `gh` token cannot manage app installations (GitHub returns 403), so this step is manual.
- **PR previews are on** for `main` (`enablePullRequestPreview`). Each PR into `main` gets its own temporary branch and URL (`https://pr-<number>.d1dlm8l72zqe87.amplifyapp.com`), deleted when the PR closes. Each open PR counts toward Amplify's 50-branches-per-app quota, so close stale PRs. Preview builds cost build minutes like any other build.
- **Preview security (public repo):** anyone can open a PR, and its code runs in a preview build with the app's settings. So:
  - Keep **no IAM service role and no app-level compute role** on this app. If the app later needs AWS access at runtime (Bedrock, S3), attach a **compute role to the `main` branch only**, never at app level, as AWS recommends for public repos with previews.
  - **Never put secrets in app-level environment variables** (they reach preview builds). Set secrets such as `DATABASE_URL` as **branch-level variables on `main`**, or in AWS Secrets Manager read by the `main` compute role.
  - AWS docs are inconsistent here: one paragraph says previews can't be enabled for `WEB_COMPUTE` apps in public repos, the next describes doing it with a branch-level compute role. Amplify accepted the setting for this app (no roles attached).
- Build spec is `amplify.yml` in the repo.
  - **Node 22 only.** Amplify rejects Node 24 and `nvm use` cannot override it. The app env var `_LIVE_UPDATES=[{"pkg":"node","type":"nvm","version":"22"}]` pins Node 22. The CI job "Amplify compatibility (Node 22)" proves the app builds and tests on 22.
  - **SSR runtime env vars:** console env vars are not passed to the running Next.js server. The build step appends an allow-list (`AWS_REGION|DATABASE_URL|GUEST_TOKEN_CAP`) to `.env.production`. Add new server-side vars to that regex.
  - Env var names starting with `AWS_` are believed to be reserved by Amplify (not verified); `AWS_REGION` is expected to be provided by the runtime. Verify when Bedrock is wired up.
- **Next.js 16 risk:** AWS documents managed SSR for Next 12-15. Reports say Next 16 ships the full `next` package (~183 MB here) and can hit the 220 MB SSR output cap. Our traced server bundle measured 14.8 MB and the first deploy succeeded. If a build fails on size, trim the bundle first; container fallback is Amazon ECS Express Mode (App Runner closed to new customers on April 30, 2026).

### Useful commands
```powershell
aws amplify list-jobs --app-id d1dlm8l72zqe87 --branch-name main --region us-east-1
aws amplify get-job --app-id d1dlm8l72zqe87 --branch-name main --job-id <n> --region us-east-1   # steps[].logUrl has the build log
aws amplify start-job --app-id d1dlm8l72zqe87 --branch-name main --job-type RELEASE --region us-east-1
```
The build log `logUrl` returns bytes; decode with `[Text.Encoding]::UTF8.GetString($r.Content)` before searching it.

## Not created yet
- Private S3 bucket for resumes (Block Public Access, encryption, short lifecycle expiry, presigned URLs) - Task 4.
- App IAM role with only `bedrock:InvokeModel`/`Converse` on chosen model ARNs and S3 access to one bucket - Task 3/4.
- GitHub Actions to AWS via OIDC limited to `RmdanJr/QuestHire` on `main` (no long-lived keys), only if CI needs AWS.
- Judge0 CE on EC2 - Task 10.
- Database (Neon or Supabase free tier, then `DATABASE_URL` in Amplify).

The `aws-setup` agent (`.kiro/agents/aws-setup.md`) follows these rules for AWS work.
