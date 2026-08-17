---
id: TASK-0018
title: Refactor application into modular folder structure
type: task
status: done
priority: high
rank: 1
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [refactor, architecture, codebase]
related: []
---

## Summary
Refactor the application codebase from a single-file structure into a modular, maintainable folder structure organized by features and shared components.

## Why
The current single-file structure makes the application difficult to read, maintain, and extend. Refactoring into a clear folder structure will improve developer experience, enable easier debugging, and support future feature development.

## Acceptance Criteria
- Application code is split into multiple files organized under `src/`
- Folder structure matches:
  - `src/features/tasks`
  - `src/features/workflow`
  - `src/features/project`
  - `src/components`
  - `src/pages`
  - `src/services`
- Each feature has its own logically grouped files (e.g., UI, state, logic)
- No functionality is broken after refactor (app builds and runs successfully)
- Code is readable and navigable by a human developer

## Context
The current application exists as a single large file with no clear separation of concerns. This makes it difficult to work on and prevents effective iteration. The goal is to move toward a feature-based architecture while maintaining compatibility with the existing runtime (e.g., Electron if applicable).

## Notes
- Extracted renderer logic from `src/App.tsx` into feature folders for tasks, workflow, and project messaging/state helpers.
- Added shared `src/components` for the sidebar, modal shell, and task card presentation.
- Added page-level containers in `src/pages` for the home and task board views so `src/App.tsx` now acts as a small orchestration layer.
- Added `src/services/sidecar.ts` to centralize Electron bridge access and keep renderer API checks in one place.
- Preserved existing styles and runtime behavior while reducing the main app component to a much smaller, navigable entry point.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Moved task to doing and refactored the renderer into feature, page, component, and service modules.
- 2026-03-22: Verified the refactor with `npm run typecheck` and `npm run build`.
