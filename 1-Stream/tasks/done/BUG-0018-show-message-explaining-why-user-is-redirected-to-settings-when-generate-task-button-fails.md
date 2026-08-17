---
id: BUG-0018
title: Show message explaining why user is redirected to settings when Generate Task button fails
type: bug
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
When the user clicks the Generate Task button and no task window appears, they are redirected to the settings page without any explanation. This causes confusion. The bug requires adding a clear message that explains why the redirect occurs.

## Acceptance Criteria
- A user-facing notification appears before redirection, stating that the task generation failed and why they are being taken to settings.
- The notification includes a brief explanation (e.g., missing configuration, insufficient permissions).
- After the user acknowledges the message, they are redirected to the settings page.
- The notification should be styled consistently with existing UI guidelines.

## Notes
* Investigate the current flow that triggers the redirect to identify missing error handling.
* Ensure the message is localized if the app supports multiple languages.

## Activity Log
- 2026-03-24: Confirmed the missing-URL path redirected directly to Settings with no acknowledgment step, which matched the confusion described in the bug.
- 2026-03-24: Added an in-app explanation modal for the missing-URL case so users see why task generation cannot proceed before they choose to continue to Settings.
- 2026-03-24: Verified the new explanation flow with `npm run typecheck` and `npm run build`.
