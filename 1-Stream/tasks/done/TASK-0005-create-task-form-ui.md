---
id: TASK-0005
title: Create task form UI
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-20
updated: 2026-03-21
tags: [ui, forms, tasks]
related: [TASK-0001, TASK-0003]
---

## Summary
Create a simple form-based UI for creating new task files inside the selected project's `1-Stream` folder.

## Why
Users should be able to create structured tasks without manually writing markdown.

## Acceptance Criteria
- The UI includes fields for:
  - title
  - type
  - status
  - priority
  - owner
  - agent
  - tags
  - summary
  - why
  - acceptance criteria
  - context
  - notes
- The form validates required fields
- The form is readable and calm in presentation
- The form can submit task data for markdown generation

## Context
This is a central feature of the MVP.

## Notes
Keep the form practical. Avoid excessive field complexity.

Implemented as a single structured form in the main UI, with validation and a submitted preview that prepares task data for the markdown-saving step.

## Activity Log
- 2026-03-20: Task created
- 2026-03-21: Moved to doing and added a calm task creation form covering all required workflow fields.
- 2026-03-21: Added lightweight validation for required fields and a prepared-output preview to confirm submitted task data.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
