# Design: Foundation and design system (Task 1)

Status: **done** (merged in PR #1 and PR #2).

## Overview
A Next.js App Router app with a token-driven "Haunted Library" design system. Pure logic sits apart from React so it can be property-tested.

## Architecture
| Layer | Location | Notes |
|---|---|---|
| Design tokens | `src/design/tokens.ts`, mirrored as CSS variables in `src/app/globals.css` | `contrastPairs` lists every text/UI pairing; `tokens.test.ts` enforces 4.5:1 text and 3:1 UI |
| Contrast math | `src/design/contrast.ts` | WCAG 2.x relative luminance; property-tested for symmetry and range |
| Meter logic | `src/lib/ui/meters.ts` | `litCandles`, `moonIllumination`, `moonPhaseName`, `hourglassFill`, `daysUntil`, `isFinalDay`; pure and property-tested |
| Component kit | `src/components/ui` | CandleHp, Hourglass, MoonMeter, GrimoirePanel, RuneButton, ScrollModal |
| Pages | `src/app/page.tsx`, `src/app/gallery` | Landing page and a live component gallery |
| Health | `src/lib/health.ts`, `src/app/api/health/route.ts` | Injected pinger for tests; `await connection()` keeps it per request under Cache Components |
| Repo guard | `.kiro/skills/submission-guard/scripts/check-submission.mjs` | Pure `findProblems()` and `checkRepo(root)`; uses the `ignore` package instead of spawning git |

## Key decisions
- **Meters use a visually hidden native `<meter>`** carrying `min`, `max`, `value`, an accessible name and `aria-valuetext`; the SVG art is `aria-hidden`. This replaced `role="meter"` after SonarCloud rule S6819.
- **Decorative animation is opt-in** under `@media (prefers-reduced-motion: no-preference)`, so no `!important` overrides are needed (S9423).
- **ScrollModal uses the native `<dialog>`** for focus trapping, Escape to close and focus return.
- **Palette fix:** the panel border was raised from `#4a3a63` to `#705a96` after the contrast test showed 1.94:1 against a 3:1 target.
- **Health semantics:** no `DATABASE_URL` means `db: "unconfigured"` with HTTP 200; an unreachable database means `db: "error"` with HTTP 503.

## Testing
Unit, component and property-based tests with Vitest, Testing Library and fast-check. The coverage gate (`vitest.config.mts`) is statements 80, branches 80, functions 80, lines 85.
