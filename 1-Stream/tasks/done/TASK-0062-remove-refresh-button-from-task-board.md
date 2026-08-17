---
id: TASK-0062
title: Remove Refresh Button from Task Board
type: task
priority: medium
rank: 1
created: 2024-02-29
updated: 2026-04-02
---

## Summary
Remove the refresh button from the task board to simplify the user interface and reduce unnecessary updates.

## Acceptance Criteria
- The refresh button is completely removed from the task board view.
- Users can still get updated board state through existing non-button paths such as the filesystem watcher or a normal app reload.
- The removal of the refresh button does not negatively impact existing functionality or user workflows.

## Notes
This change aims to reduce visual clutter and improve the overall usability of the task board.

## Activity Log
- 2026-04-01: Removed the manual refresh control from the task-board utility row while leaving the existing filesystem-watcher refresh behavior intact.
- 2026-04-01: Cleaned up the now-unused task-board refresh prop and quiet-button styling tied only to that button.
- 2026-04-01: Verified the task-board cleanup with `npm run typecheck` and `npm run build`.
