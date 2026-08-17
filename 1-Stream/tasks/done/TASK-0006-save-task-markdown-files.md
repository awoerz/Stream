---
id: TASK-0006
title: Save task markdown files
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-20
updated: 2026-03-21
tags: [filesystem, markdown, tasks]
related: [TASK-0005]
---

## Summary
Implement logic to convert form data into structured markdown and save new task files into the correct status folder.

## Why
Task creation only becomes useful when the data is persisted as readable files in the repository.

## Acceptance Criteria
- Task form data is transformed into markdown using the expected structure
- New tasks are saved into the correct status folder
- Task filenames are readable and consistent
- Task IDs are generated reliably
- Saved markdown is easy for both humans and agents to read

## Context
This task completes the basic task creation loop.

## Notes
Use markdown as the source of truth, not a separate database.

Implemented with an Electron save handler that generates the next task ID, creates a readable filename, writes markdown into the selected status folder, and returns the saved file details to the UI.

## Activity Log
- 2026-03-20: Task created
- 2026-03-21: Moved to doing and added task-save IPC support with reliable task ID generation across existing workflow folders.
- 2026-03-21: Connected the task form to real markdown persistence and surfaced saved file details in the UI.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
