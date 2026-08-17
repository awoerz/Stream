---
id: BUG-0002
title: Fix task ordering so new tasks appear at the top of Kanban columns
type: bug
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [kanban, ui, bug]
related: []
---

## Summary
Tasks added to a Kanban column are currently appearing at the bottom instead of the top. Update the ordering logic so new tasks are inserted at the top of the column.

## Why
Users expect newly created or moved tasks to appear at the top for visibility and prioritization. Current behavior makes it harder to track recent work and disrupts workflow expectations.

## Acceptance Criteria
- New tasks appear at the top of the column immediately after creation
- Moving a task into a column places it at the top by default
- Existing task order is preserved unless explicitly changed
- Behavior is consistent across all columns

## Context
Kanban boards typically prioritize newest or highest-priority items at the top. Current implementation likely appends tasks to the end of a list or array.

## Notes
- Review sorting logic or insertion method (e.g., prepend vs append)
- Check if backend or frontend is responsible for ordering
- Consider future support for manual ordering or priority-based sorting

The current fix is implemented in the task-loading layer so new saves and imports surface first without adding extra client-side reordering.

## Activity Log
- 2026-03-21: Task created
- 2026-03-21: Moved to doing and traced the issue to ascending task ID sorting in the board loader.
- 2026-03-21: Updated work-item ordering so higher-numbered tasks render first within each kanban column.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
