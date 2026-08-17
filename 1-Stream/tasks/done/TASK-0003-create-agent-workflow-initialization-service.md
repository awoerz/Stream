---
id: TASK-0003
title: Create 1-Stream initialization service
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-20
updated: 2026-03-21
tags: [filesystem, initialization, workflow]
related: [TASK-0002]
---

## Summary
Implement logic that initializes the `1-Stream` folder and required subdirectories inside the selected project folder.

## Why
The primary value of Agent Sidecar is the ability to create a consistent workflow structure that humans and AI agents can share.

## Acceptance Criteria
- The app can detect whether `1-Stream/` already exists
- The app can create `1-Stream/` if missing
- The app creates required subdirectories:
  - `tasks/backlog`
  - `tasks/doing`
  - `tasks/blocked`
  - `tasks/done`
  - `decisions`
  - `project-memory`
  - `templates`
- The app handles re-running initialization safely

## Context
This is one of the core MVP capabilities.

## Notes
Initialization should be idempotent.

Implemented in the Electron main process with renderer controls to detect and initialize the workflow structure for the attached project.

## Activity Log
- 2026-03-20: Task created
- 2026-03-21: Moved to doing and added workflow status and initialization IPC handlers in the Electron main process.
- 2026-03-21: Added UI controls to detect whether `1-Stream` exists and initialize the required folder structure from the attached project view.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
