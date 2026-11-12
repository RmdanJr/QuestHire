# QuestHire: The Crypt of the Hiring Manager

Turn your interview invite into an adventure. QuestHire reads your resume and the job description, builds a time-boxed prep plan, and lets you fight through it in a haunted gothic library. The real interview is the final boss.

Built for the **Kiroween 2026 Costume Contest**. Every spooky element has a job:

| Element | Function |
|---|---|
| Candles | Hit points. Wrong answers snuff them out |
| Hourglass | Days left until the real interview |
| Moon | Readiness, from new moon to full |
| Runes | Topic mastery |
| The Archivist | Lore scrolls and hints |

## Status

Work in progress. Task 1 (foundation and design system) is in place: the themed landing page, a component gallery at `/gallery`, the `/api/health` endpoint, and automated contrast checks. Game features land in later tasks.

## Getting started

```bash
npm install
cp .env.example .env   # optional: add DATABASE_URL for a real database
npm run dev
```

Open http://localhost:3000. The component kit is at http://localhost:3000/gallery.

### Useful commands

| Command | What it does |
|---|---|
| `npm run check` | Typecheck, lint, tests, Prisma validate and the repo guard |
| `npm run test` | Vitest unit and property-based tests |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run check:kiro` | Confirms `/.kiro` is tracked, a LICENSE exists, and local fixtures stay ignored |

## Stack

Next.js (App Router, TypeScript), Tailwind, Framer Motion, Prisma + Postgres, Zod, Vitest and fast-check.

## Accessibility

Contrast ratios for every text and UI color pair are tested (4.5:1 for text, 3:1 for UI). Components expose meters to assistive technology, respect `prefers-reduced-motion`, and have visible focus rings. This is not a WCAG compliance claim: that needs manual testing with assistive technologies.

## Built with Kiro

The `/.kiro` directory holds the steering files, hooks and specs used to build this project.

## Credits and licenses

- Code: MIT, see [LICENSE](LICENSE).
- Planned content sources, with attribution added when each is used:
  - System design problems adapted from [system-design-primer](https://github.com/donnemartin/system-design-primer) by Donne Martin, licensed CC BY 4.0.
  - Algorithm problems from the `newfacade/LeetCodeDataset` on Hugging Face, downloaded at setup and not committed to this repository.
