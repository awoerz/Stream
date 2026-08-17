---
id: TASK-0050
title: Replace "Run the Next Task With an Agent" with a generic clipboard button
type: task
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Remove all references to the phrase “Run the Next Task With an Agent” from the codebase and documentation. Add a new generic button on the Kanban page that, when clicked, copies the text “Please read stream.md and work on the next task” to the clipboard. This button should function regardless of the LLM in use.

## Acceptance Criteria
- All instances of “Run the Next Task With an Agent” are deleted from source files, comments, and documentation.
- A new button labeled “Copy Next Task Prompt” appears on the Kanban page.
- Clicking the button copies the exact string “Please read stream.md and work on the next task” to the clipboard.
- The button works across all supported browsers and devices.
- No functionality is broken by removing the old references.

## Notes
- Search for the phrase in all `.js`, `.ts`, `.md`, and template files.
- Update any tests that reference the old phrase to use the new button or prompt text.
- Ensure clipboard API fallback for older browsers.

## Activity Log
- 2026-03-24: Removed the old agent-helper UI flow from the home screen and app shell so the product no longer references “Run the Next Task With an Agent”.
- 2026-03-24: Added a board-level `Copy Next Task Prompt` action that copies the exact prompt text with a fallback path for clipboard support.
- 2026-03-24: Verified the replacement with `npm run typecheck`, `npm run build`, and a source sweep confirming the removed phrase no longer appears in the live app source or current-state documentation.
