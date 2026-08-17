---
id: TASK-0008
title: Add primary navigation and kanban task board view
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [navigation, ui, kanban, tasks]
related: [TASK-0001, TASK-0006]
---

## Summary
Add primary navigation from the home page to a dedicated task board view and implement a kanban-style layout that displays tasks grouped by status.

## Why
The current home page is overloaded and does not provide a focused place to view work in progress. A dedicated task board will make the workflow easier to understand and will better support the one-task-at-a-time execution model.

## Acceptance Criteria
- The application includes primary navigation that allows the user to move from the home page to a task board view
- The task board view displays four columns:
  - backlog
  - doing
  - blocked
  - done
- Each column lists the tasks currently stored in the corresponding workflow status folder
- Task cards display enough information to quickly identify the work item, such as:
  - title
  - id
  - priority
  - assigned_to
- The task board is readable and calm in presentation
- The implementation leaves room for future automatic refresh or file watching without overcomplicating the initial version

## Context
This task should be completed before moving task creation out of the home page. The board view becomes the main place where work is reviewed and managed.

## Notes
For this first implementation, it is acceptable to load tasks when the view opens or when the user refreshes the view manually. Real-time updates can be explored later if needed.

Implemented with a two-view shell (`Home` and `Task Board`), a manual refresh flow, and a kanban board that loads task cards from the workflow status folders.

## Activity Log
- 2026-03-21: Task created
- 2026-03-21: Moved to doing and added primary navigation between the home screen and a dedicated task board view.
- 2026-03-21: Implemented a kanban board with backlog, doing, blocked, and done columns populated from workflow task files.
- 2026-03-21: Added a manual board refresh flow and verified with `npm run typecheck` and `npm run build`.
