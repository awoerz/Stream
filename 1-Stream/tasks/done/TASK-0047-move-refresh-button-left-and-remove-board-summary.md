---
id: TASK-0047
title: Move refresh button left and remove board summary
type: task
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Reposition the refresh button to the left side of the screen, directly above the Kanban board, and remove the existing board summary display.

## Acceptance Criteria
- The refresh button is visible on the left side of the screen, immediately above the Kanban board.
- The board summary section is no longer rendered or visible in the UI.
- All related CSS and layout adjustments maintain responsive design across screen sizes.

## Notes
* Update the component that renders the board summary to conditionally render only when a feature flag is enabled.  
* Ensure the refresh button triggers the same data fetch logic as before.  
* Verify that keyboard navigation and focus order remain logical after repositioning the button.

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and removed the board summary card, replacing it with a compact utility row above the kanban board that keeps the refresh action on the left.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
