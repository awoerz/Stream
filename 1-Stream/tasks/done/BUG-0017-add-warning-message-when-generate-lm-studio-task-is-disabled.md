---
id: BUG-0017
title: Add warning message when Generate LM Studio Task is disabled
type: bug
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
When a user attempts to click the "Generate LM Studio Task" button while it is disabled, no warning or message appears. This causes confusion as users do not understand why the action cannot be performed.

## Acceptance Criteria
- A clear warning message is displayed when the button is clicked while disabled.
- The message explains why the action cannot be performed (e.g., missing prerequisites, insufficient permissions).
- The warning is styled consistently with existing UI alerts.
- The message disappears after a reasonable time or when the user dismisses it.

## Notes
Implement using the existing alert component. Ensure that the message is accessible (ARIA roles) and does not block other UI interactions.

## Activity Log
- 2026-03-24: Confirmed the board only showed passive explanatory copy above the actions, so users got no direct feedback when trying the disabled LM Studio action itself.
- 2026-03-24: Added a clickable disabled-action wrapper plus a dismissible warning banner so the board now explains the missing prerequisite on demand without blocking other controls.
- 2026-03-24: Verified the change with `npm run typecheck` and `npm run build`.
