---
inclusion: always
---

# QuestHire product context

QuestHire turns an interview invite ("system design in 6 days") into a playable campaign set in a haunted gothic library. The user provides a resume, a job description (JD) and interview details. The AI builds a time-boxed prep plan. The player works through it with a per-topic loop: Scout (adaptive placement) -> Lore scrolls (lessons on gaps) -> Practice battle -> Mastery check. The interview itself is the final boss.

Target: Kiroween 2026 **Costume Contest** ("a haunting user interface that's polished and unforgettable, with spooky design elements that enhance the app's function"). Deadline: Dec 4, 2026, 2:00 PM PT.

## Interview types (5)
Initial/HR screen, behavioral, system design, algorithmic coding, live coding.

## Hard rules
- Every spooky element must serve a function (candles = HP, hourglass = countdown, moon = readiness, runes = mastery).
- Never commit personal data. The resume fixture lives in `.local/` (gitignored).
- `/.kiro` must stay committed and must never be added to `.gitignore`.
- Third-party content needs visible attribution: system-design-primer (CC BY 4.0, Donne Martin) and the Blind 75 dataset (downloaded at setup, never committed).
- Do not claim WCAG compliance. We target contrast ratios and support reduced motion, keyboard use and labels; full compliance needs manual assistive-technology review.
- Cost control: no AWS credits. Prefer code-graded multiple choice, cached pre-generated questions, tiered models and per-session guest token caps.
