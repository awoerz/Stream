---
id: BUG-0010
title: Provide error message when Generate LM Studio Task button is disabled
type: bug
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
When the user cannot click the "Generate LM Studio Task" button, display a clear error message explaining why the action is unavailable.

## Acceptance Criteria
- The UI shows an informative error message when the button is disabled.
- The message appears near the button or in a modal dialog.
- The error text is localized and accessible (screen reader friendly).
- Clicking the button when enabled performs the expected action without error.

## Notes
Consider using a tooltip or inline alert that fades after a few seconds. Ensure the message is consistent with other error handling patterns in the app.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and added an inline, accessible disabled-state explanation near the LM Studio task action so users can see exactly why it is unavailable.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
