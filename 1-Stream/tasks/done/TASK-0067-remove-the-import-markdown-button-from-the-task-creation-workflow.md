---
id: TASK-0067
title: Remove the import markdown button from the task creation workflow.
type: task
priority: medium
rank: 1
created: 2026-04-08
updated: 2026-04-09
---

## Summary
Eliminate the “Import Markdown” button from the task creation interface to streamline the workflow and reduce confusion.

## Acceptance Criteria
- The “Import Markdown” button is no longer rendered in the task creation modal or page.
- No import markdown functionality remains accessible through any other UI element.
- Existing tasks created without the button still function correctly and can be edited or viewed as before.

## Notes
- Update any related documentation or tooltips that reference the import markdown feature.
- Verify that keyboard shortcuts or hidden commands do not trigger the import action.

## Activity Log
- 2026-04-08: Removed the `Import markdown` board action and the hidden file-input path from the task board so the import flow is no longer reachable from the UI.
- 2026-04-08: Removed the renderer bridge exposure and app-level import handler wiring for `importTaskMarkdown`, along with the unused task-board styling tied only to that flow.
- 2026-04-08: Removed the now-unused main-process IPC registration and dead import-only handler so the feature is not reachable through the previous renderer command path.
