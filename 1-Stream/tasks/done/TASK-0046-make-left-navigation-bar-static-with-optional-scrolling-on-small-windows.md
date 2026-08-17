---
id: TASK-0046
title: Make left navigation bar static with optional scrolling on small windows
type: task
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Implement a static left navigation bar that remains fixed while the main content scrolls. The nav should only become scrollable when the viewport height is insufficient to display all items.

## Acceptance Criteria
- The left nav bar stays fixed in place during page scrolling.
- When the viewport height is too small, the nav bar becomes scrollable internally without affecting the main content.
- The solution works across modern browsers and responsive breakpoints.

## Notes
Consider using CSS `position: sticky` or `fixed` with a max-height and overflow-y set to auto. Test on various screen sizes and ensure accessibility compliance.

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and updated the shell layout so the sidebar stays sticky while main content scrolls, with internal sidebar scrolling only when the viewport height is constrained.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
