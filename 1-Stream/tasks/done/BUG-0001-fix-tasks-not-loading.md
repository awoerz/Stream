---
id: BUG-0001
title: Fix tasks not loading on task board
type: bug
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [bug, task-board, loading]
related: [TASK-0008]
---

## Summary
Fix the task board so workflow tasks load reliably when the app opens against the current project.

## Why
The board looked empty unless the user manually reattached the project, which made existing tasks appear missing.

## Acceptance Criteria
- The current workspace is attached automatically on launch
- The task board can load workflow tasks without requiring the user to reselect the same project first
- Board loading failures surface a useful message instead of silently appearing empty

## Context
The task loader itself could read markdown files correctly, but the renderer often started with no selected project path.

## Notes
Kept the existing manual folder selection flow and added a default-project fallback for the current workspace.

## Activity Log
- 2026-03-21: Bug file created.
- 2026-03-21: Moved to doing and confirmed the task loader could read workflow files from disk.
- 2026-03-21: Added automatic attachment to the current workspace on launch and explicit task-board load error messaging.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
