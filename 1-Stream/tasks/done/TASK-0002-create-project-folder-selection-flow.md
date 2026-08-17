---
id: TASK-0002
title: Create project folder selection flow
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-20
updated: 2026-03-21
tags: [filesystem, setup, ux]
related: [TASK-0001]
---

## Summary
Add a user flow that allows the user to choose an existing project folder for Agent Sidecar to operate against.

## Why
The application is intended to work against existing repositories and should not require the app to create a full project from scratch.

## Acceptance Criteria
- The user can choose an existing folder from the desktop app
- The selected folder path is stored in application state
- The UI clearly indicates which project folder is currently open
- The app handles the case where no folder is selected yet

## Context
This flow is required before workflow initialization can happen inside the selected project.

## Notes
No need to create a new project folder in v1.

Implemented with a native folder picker in Electron and renderer state that surfaces the currently attached project path.

## Activity Log
- 2026-03-20: Task created
- 2026-03-21: Moved to doing and added a native folder selection flow through Electron IPC.
- 2026-03-21: Updated the shell UI to handle empty and selected states and store the chosen path in application state.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
