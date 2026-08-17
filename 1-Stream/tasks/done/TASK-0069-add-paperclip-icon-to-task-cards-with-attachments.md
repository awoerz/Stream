---
id: TASK-0069
title: Add paperclip icon to task cards with attachments
type: task
priority: medium
rank: 1
created: 2024-02-29
updated: 2026-04-10
---

## Summary
Add a visual indicator (paperclip icon) to task cards when one or more attachments are associated with the task.

## Acceptance Criteria
- When a task has at least one attachment, a paperclip icon is displayed in the task card.
- The paperclip icon should be visually consistent with existing UI elements.
- Clicking the paperclip icon should navigate to the task's attachments page (if applicable).

## Notes
Consider using a CSS class or component state to manage the visibility of the paperclip icon.  Ensure this doesn't negatively impact accessibility for users with screen readers.

## Activity Log
- 2026-04-10: Moved the task into `doing` and traced the board-loading path to confirm attachment metadata was being dropped before task cards rendered.
- 2026-04-10: Added `attachmentCount` to the board payload and updated the card UI to show an accessible paperclip indicator with count when saved task images exist.
- 2026-04-10: Kept the existing interaction model, so selecting the card or the paperclip area still opens the task-detail view where attachments are already managed.
