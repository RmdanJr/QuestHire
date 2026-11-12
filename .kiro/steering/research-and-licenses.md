---
inclusion: auto
name: research-and-licenses
description: Vetted research for QuestHire - LLM providers and prices, code execution services, problem banks, system design sources and their licenses, hosting options. Use before choosing a provider, dataset or content source.
---

# Research findings and licenses (checked Nov 12, 2026)

Re-verify prices and availability before relying on them; they change.

## LLM providers
- **Amazon Bedrock (chosen).** Structured outputs via Converse `outputConfig.textFormat` or strict tool use; rules in `bedrock-schema-rules.md`. Catalog seen: Amazon Nova (Micro, Lite, Pro, Nova 2 Lite, Nova Canvas for images), Anthropic Claude (Haiku, Sonnet, Opus lines), DeepSeek (V3.2, V3.1, R1), Google Gemma 4, Cohere, AI21. Grok was not in the part of the list we read. Per-model prices were not retrieved; check the console. Availability is per region and needs a model access request. No built-in web search. Source: docs.aws.amazon.com/bedrock (structured-output, model-cards).
- **xAI Grok (optional adapter).** `grok-4.7` $2 in / $6 out per 1M tokens; `grok-4.3` $1.25 / $2.50 (cached input $0.20). JSON-schema structured outputs, OpenAI-compatible API, server-side Web Search tool, Batch API, Grok Imagine images $0.02-0.04. The user's credits come from a Cursor subscription and may not apply to the API. Source: docs.x.ai.
- **Rough usage per fully played campaign:** about 160k input and 80k output tokens (estimate, not measured). About $0.40-$0.80 on Grok prices.
- Self-hosting an open model on a GPU was rejected (always-on GPU cost, extra operations).

## Code execution
- **Judge0 CE 1.13.1 (chosen, self-hosted).** GPLv3; we only call its API. Sandboxed, 60+ languages, multi-file programs, time/memory limits, webhooks. Believed to need cgroup v1 (verify on the AMI). Free RapidAPI tier exists; limits not confirmed.
- **Piston public API: not usable.** Closed to the public since Feb 15, 2026; keys are not granted for individual, portfolio or temporary projects.
- **HackerEarth API v4:** hosted execution only (5 s, 256 MB per run, free request cap); no problem bank.
- **Sphere Engine Problems:** hosted problems and judging with a widget; commercial, pricing not confirmed.

## Algorithm problem sources
- **`newfacade/LeetCodeDataset` (chosen).** Hugging Face, ~2.87k problems with statements, starter code, reference solutions and tests (`test`, `input_output`). Python-oriented; ~15 of the Blind 75 need ListNode/TreeNode serialization. **License not confirmed** - check before Task 11. Problem statements are LeetCode content: download at setup, never commit, attribute and link back.
- LeetCode has no official API; progress reads go through an unofficial GraphQL endpoint and the ToS restricts automation. Not used.
- Codewars has an official API (`/api/v1/users/{user}/code-challenges/completed`); Codeforces has an official API (`user.status`, `problemset.problems`). Kept as possible future "link out" providers.

## System design sources
| Source | License | Usable? |
|---|---|---|
| `donnemartin/system-design-primer` | CC BY 4.0 | **Yes (chosen).** 8 problems: Pastebin/Bit.ly, Twitter timeline and search, web crawler, Mint.com, social network data structures, key-value store for a search engine, Amazon sales rank by category, scaling to millions of users on AWS. Attribute Donne Martin and note changes. Check each solution file for third-party diagrams. |
| `ByteByteGoHq/system-design-101` | CC BY-NC-ND 4.0 | No (no derivatives, non-commercial). Link only. |
| `karanpratapsingh/system-design` | CC BY-NC-ND 4.0 | No. |
| `ashishps1/awesome-system-design-resources` | GPLv3 | Nothing to copy (a list of links). |
| `ashishps1/awesome-low-level-design` | GPLv3 | Would force GPLv3 on the whole project. Not used. |
| `yangshun/tech-interview-handbook` | MIT | Only question titles, no solutions. |
| Paid courses (Grokking, ByteByteGo, Exponent, Educative) | Proprietary | No. |

## Hosting
- **AWS Amplify Hosting (chosen).** Docs list managed SSR for Next.js 12-15; Next 16 works for us but watch the 220 MB SSR output cap. Unsupported: edge API routes, on-demand ISR, Next.js streaming, `unstable_after`. Build image supports Node 16/18/20/22 only.
- AWS App Runner: closed to new customers since April 30, 2026; AWS points to Amazon ECS Express Mode.

## UI libraries planned
Monaco (`@monaco-editor/react`), Excalidraw (`@excalidraw/excalidraw`, MIT), `unpdf` for PDF text (worked on the user's resume). Sound: CC0/royalty-free only.
