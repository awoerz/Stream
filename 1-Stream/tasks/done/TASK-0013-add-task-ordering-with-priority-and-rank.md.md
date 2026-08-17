---
id: TASK-0013
title: Add task ordering with priority and rank
type: task
status: done
priority: high
rank: 3
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [workflow, priority, sorting, tasks]
related: [TASK-0011]
---

## Summary
Add explicit task ordering support using both `priority` and `rank` so work is not selected or displayed using arbitrary file order.

## Why
The current workflow is underspecified about execution order. Priority alone is not always enough, and relying on file order or “next task” behavior can produce confusing results.

## Acceptance Criteria
- The workflow format supports a numeric `rank` field
- Task parsing logic reads `rank` when present
- Task ordering uses a consistent strategy such as:
  - rank ascending first when available
  - then priority
  - then created or updated date as a fallback
- The ordering logic is documented in the workflow guidance or template comments
- Tasks without rank still work safely
- The board or task list displays tasks in the expected order

## Context
This task follows the discovery that the app currently appears to pull “the next task” without enough explicit instruction about how work should be prioritized or ordered.

## Notes
Keep the ordering model simple:
- priority = importance
- rank = manual execution order

Implemented with `rank` support in task creation, templates, prompt generation, parsing, and board ordering. Ranked items sort first by ascending rank, then by priority, then by newer work item ID.

## Activity Log
- 2026-03-21: Task created after identifying the need for explicit work ordering
- 2026-03-22: Moved to doing and added a numeric `rank` field to the task workflow model and task creation UI.
- 2026-03-22: Updated board ordering to use rank first, then priority, then newer item IDs as fallback.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
