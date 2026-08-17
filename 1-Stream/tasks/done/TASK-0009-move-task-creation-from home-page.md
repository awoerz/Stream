---
id: TASK-0009
title: Move task creation from home page to popup on task board view
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [ui, tasks, modal, workflow]
related: [TASK-0007]
---

## Summary
Move task creation off the home page and into a popup form that is launched from the task board view. Tasks also need to actually load into the task board.

## Why
Task creation belongs closer to the work management experience than the project home page. Moving it into the task board flow will simplify the home page and make task creation feel more natural and focused.

## Acceptance Criteria
- The home page no longer contains the primary task creation form
- The task board view includes a clear button for creating a new task
- Clicking the button opens a popup or modal for task creation
- The popup allows the user to enter the same task data required by the current workflow format
- Submitting the popup creates the task markdown file in the appropriate workflow status folder
- After task creation, the task board reflects the new task in the correct column
- The popup can be closed without creating a task

## Context
This task depends on the task board view being in place first. The goal is to make the home page less crowded and make the task management flow feel more intentional.

## Notes
Use general wording such as `assigned_to` or `owner` rather than product-specific internal names. The field must support either a human or an agent.

Implemented by removing the large task form from the home page and reusing the existing task-save flow inside a board-launched modal.

## Activity Log
- 2026-03-21: Task created
- 2026-03-21: Moved to doing and removed the primary task creation form from the home page.
- 2026-03-21: Added a `Create task` action to the board header that opens a dismissible modal with the same workflow fields.
- 2026-03-21: Hooked modal submission into the existing markdown save path and refreshed the board after successful creation.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
