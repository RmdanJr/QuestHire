# Requirements: Foundation and design system (Task 1)

## Introduction
A deployable Next.js app with the "Haunted Library" design system: tokens, an accessible component kit, a themed landing page, a component gallery, a health endpoint and repo guards for the Kiroween submission.

## Requirements

### Requirement 1: Themed landing page
**User Story:** As a visitor, I want a landing page that immediately feels like a haunted library, so I understand the product and want to start.

#### Acceptance Criteria
1. WHEN the landing page loads THEN it SHALL show the product name, a one-line pitch and a primary call to action.
2. WHEN the user has `prefers-reduced-motion` set THEN the page SHALL not run decorative animations.
3. The page SHALL use only design tokens for color.

### Requirement 2: Accessible component kit
**User Story:** As a developer, I want reusable themed components so that every screen stays consistent.

#### Acceptance Criteria
1. The kit SHALL include CandleHp, Hourglass, GrimoirePanel, RuneButton, MoonMeter and ScrollModal.
2. WHEN a meter component renders THEN it SHALL expose `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and an accessible name.
3. WHEN the user tabs through interactive components THEN a visible focus ring SHALL appear.
4. ScrollModal SHALL trap focus, close on Escape and return focus to the opener.

### Requirement 3: Contrast targets
#### Acceptance Criteria
1. Every pair in `contrastPairs` SHALL meet 4.5:1 for text and 3:1 for UI elements, verified by an automated test.

### Requirement 4: Health endpoint
#### Acceptance Criteria
1. WHEN `GET /api/health` is called THEN it SHALL return JSON with `status` and `db`.
2. WHEN `DATABASE_URL` is unset THEN `db` SHALL be `"unconfigured"` and the status code SHALL be 200.
3. WHEN `DATABASE_URL` is set and reachable THEN `db` SHALL be `"ok"`; WHEN unreachable THEN `db` SHALL be `"error"` and the status code SHALL be 503.

### Requirement 5: Submission guards
#### Acceptance Criteria
1. The repo SHALL contain a detectable MIT LICENSE and a committed `/.kiro` directory.
2. `.kiro` SHALL NOT be gitignored, and `.local/` (personal fixtures) SHALL be gitignored. `npm run check:kiro` SHALL enforce both.
