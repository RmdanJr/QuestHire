---
inclusion: always
---

# Theme and UI conventions: "The Haunted Library"

Art direction: dark storybook illustration, painterly, warm candlelight against deep purple and teal.

## Tokens
Use `src/design/tokens.ts` and the CSS variables in `src/app/globals.css`. Do not hard-code hex colors in components. Any new text/background pairing must be added to `contrastPairs` so `tokens.test.ts` enforces it (4.5:1 text, 3:1 UI).

## Function-first spooky elements
| Element | Function |
|---|---|
| Candle flames | HP, wrong answer snuffs one out |
| Hourglass / clock tower | Countdown to the real interview |
| Moon phase | Readiness meter |
| Runes / sigils | Topic mastery |
| The Archivist (ghost) | Lore scrolls and hints |
| Wardrobe | Resume upload shown as dressing in a role costume |
| Boss door | The real interview, with the company's name |

## Component kit (src/components/ui)
CandleHp, Hourglass, GrimoirePanel, RuneButton, MoonMeter, ScrollModal. Reuse these; do not create one-off lookalikes.

## Accessibility
- Respect `prefers-reduced-motion` (CSS and Framer Motion `useReducedMotion`).
- Meters use a visually hidden native `<meter>` (min, max, value, an accessible name and `aria-valuetext`); the SVG art is `aria-hidden`. Prefer the native element over `role="meter"` (SonarCloud rule S6819).
- Everything interactive is keyboard reachable with a visible focus ring (candle color).
- Decorative art gets `alt=""` or `aria-hidden`.
- Sound is off by default or has a visible mute toggle. Only CC0/royalty-free audio. No copyrighted music.

## Performance
Keep the landing page light (lazy-load heavy art). Animations should use transform/opacity.
