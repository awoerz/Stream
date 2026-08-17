---
id: TASK-0045
title: Add LM Studio URL test button and verification requirement
type: task
status: done
priority: medium
rank: 2
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Add a "Test URL" button within the LM Studio settings modal to verify connectivity. Require successful verification before enabling the LM Studio Task Button elsewhere in the app.

## Acceptance Criteria
- A "Test URL" button is present next to the LM Studio URL input.
- Clicking the button sends a connectivity check request and displays success or error feedback to the user.
- The LM Studio Task Button remains disabled until a successful test has been performed and verified.
- Verification status persists across sessions (e.g., stored in local storage or backend).

## Notes
Consider debouncing rapid clicks and handling network errors gracefully. Update any relevant unit tests to cover the new functionality.

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and added LM Studio URL connectivity testing through the main process, persisted verification status in local app storage, and gated LM Studio task creation on successful verification.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
