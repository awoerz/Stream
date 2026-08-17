---
id: TASK-0044
title: Move LM Studio URL setting to sidebar gear icon
type: task
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Relocate the LM Studio URL configuration from the home page setting card to a gear icon in the left sidebar. Clicking the gear should open a settings dialog/modal where users can enter or edit the LM Studio URL.

## Acceptance Criteria
- The gear icon appears in the left sidebar and is clearly labeled or has an appropriate tooltip.
- Clicking the gear opens a modal dialog containing:
  - An input field for the LM Studio URL.
  - A "Save" button to persist changes.
- The previous setting card is removed from the home page.
- The modal closes and updates the application state when "Save" is clicked.

## Notes
Ensure that the modal follows existing design patterns for consistency. Preserve any validation logic currently applied to the URL input.
Saving the URL now uses local app storage only, not repository files or workflow markdown.

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and replaced the home-page LM Studio card with a sidebar gear button that opens a settings modal for local-only URL saving and editing.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
