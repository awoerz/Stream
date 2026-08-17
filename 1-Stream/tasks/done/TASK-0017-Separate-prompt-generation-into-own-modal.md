---
id: TASK-0017
title: Separate prompt generation into its own modal
type: task
status: done
priority: medium
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [ui, ux, modal]
related: [TASK-0004]
---

## Summary
Move prompt generation functionality into a dedicated modal, separate from the task creation form modal.

## Why
Combining prompt generation with task creation creates confusion and bloats the UI. Separating them improves clarity, focus, and user experience.

## Acceptance Criteria
- Prompt generation opens in its own modal
- Task creation modal no longer contains prompt generation elements
- Users can access prompt generation independently of creating a task
- Modal is easy to open and close without disrupting workflow

## Context
There are currently overlapping responsibilities between the task creation form and prompt generation. This change enforces separation of concerns.

## Notes
- Reuse modal components if available
- Ensure consistent styling with existing modals
- Consider future expansion (e.g., prompt templates, history)

Implemented by removing prompt generation from the task creation modal and moving it into its own standalone modal with shared visual patterns.

## Activity Log
- 2026-03-21: Task created
- 2026-03-22: Moved to doing and separated prompt generation from task creation into its own modal flow.
- 2026-03-22: Kept modal behavior and styling consistent with the existing task creation experience.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
