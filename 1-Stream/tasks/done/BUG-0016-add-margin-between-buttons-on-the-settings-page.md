---
id: BUG-0016
title: Add margin between buttons on the settings page
type: bug
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Add a small margin between the buttons on the settings page to improve visual spacing without altering the overall layout or button size.

## Acceptance Criteria
- A consistent margin is applied between all adjacent buttons on the settings page.
- The margin does not shift any button out of its current horizontal alignment.
- Button sizes remain unchanged; only spacing is adjusted.

## Notes
Check the CSS for the settings page buttons and add a `margin-right` (or appropriate margin) that is subtle yet visible. Ensure the change passes visual regression tests and does not affect responsive behavior.

## Activity Log
- 2026-03-24: Reviewed the settings page button groups and found they were relying on the generic `.button-row` spacing with no settings-specific layout rule.
- 2026-03-24: Added a dedicated `settings-button-row` class so the settings actions use explicit, consistent spacing without changing button size or horizontal alignment.
- 2026-03-24: Verified the change with `npm run typecheck` and `npm run build`.
