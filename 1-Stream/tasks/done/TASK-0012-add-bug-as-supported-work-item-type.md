---
id: TASK-0012
title: Add bug as a supported work item type
type: task
status: done
priority: high
rank: 2
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [workflow, tasks, bugs, ui]
related: [BUG-0001]
---

## Summary
Add support for `bug` as a first-class work item type in the workflow format and application UI.

## Why
Broken behavior should be tracked differently from planned feature work. Supporting a dedicated bug type will make prioritization clearer for both humans and AI agents.

## Acceptance Criteria
- The task format supports `type: bug`
- Existing parsing and rendering logic handles bug items correctly
- Bug items can be displayed in the task board and any relevant task lists
- Task creation logic supports creating items with type `bug`
- Bug items are visually understandable and not mistaken for normal tasks
- No regressions are introduced for existing task items

## Context
A real bug has already been identified with the task board not loading tasks. This exposed the need to represent bugs explicitly instead of treating everything as a normal task.

## Notes
Keep implementation simple. This task is about supporting the type, not inventing a full bug management system.

Implemented across form state, saved markdown, prompt generation, task parsing, and board card rendering so bug items behave like first-class workflow entries.

## Activity Log
- 2026-03-21: Task created after identifying the need for bug-specific work items
- 2026-03-22: Moved to doing and confirmed `bug` support across save, import, and board rendering paths.
- 2026-03-22: Added visual bug badges so bug items are distinguishable from normal tasks on the board.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
