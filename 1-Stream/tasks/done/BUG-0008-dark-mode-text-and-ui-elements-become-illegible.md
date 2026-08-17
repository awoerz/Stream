---
id: BUG-0008
title: Dark mode text and UI elements become illegible
type: bug
status: done
priority: high
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
In dark mode, several UI elements such as close buttons on modals/dialogs and non‑active navigation links become too bright, causing text to be unreadable.

## Acceptance Criteria
- Close buttons on all modals/dialogs are visible against the dark background.
- Non‑active navigation links and items on the left sidebar have sufficient contrast with the dark theme.
- All text within dialogs, modals, and navigation remains legible across all supported browsers.

## Notes
Check the color palette used for dark mode and adjust contrast ratios to meet WCAG AA standards. Verify changes in both light and dark themes to ensure consistency.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and replaced remaining light-only color values with theme-aware tokens for nav links, modal close buttons, helper copy, badges, overlays, and preview text.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
