---
id: TASK-0031
title: Implement folder watcher to auto-refresh Kanban board
type: task
status: done
priority: medium
rank: 1
owner: adam
assigned_to: Gary
created: 2026-03-24
updated: 2026-03-24
tags: ["electron", "file-system", "kanban"]
related: []
---

## Summary
Implement a file system watcher that monitors task folders and automatically updates the Kanban board when tasks are added, removed, or moved between folders.

## Why
The current manual "refresh board" action creates friction and breaks flow. Automatically syncing the UI with the file system ensures the board always reflects the true state of tasks without user intervention.

## Acceptance Criteria
- File watcher detects new task files added to any task folder
- File watcher detects task file deletions
- File watcher detects task file moves between folders (status changes)
- Kanban board updates in real-time without manual refresh
- No duplicate rendering or stale data after updates
- Watcher handles nested folders under the main tasks directory
- Performance remains stable (no excessive re-renders or memory leaks)

## Context
Stream uses a folder-based task system where task location determines status (e.g., backlog, in-progress, done). The Kanban board reflects these folders. Currently, users must manually refresh to see updates, which interrupts workflow.

## Notes
- Use a file watching library compatible with Electron (e.g., `chokidar`)
- Watch the root tasks directory recursively
- Debounce updates to avoid rapid re-renders on bulk changes
- Normalize events (add/change/unlink) into a single update pipeline
- Consider rebuilding only affected columns instead of full board refresh
- Ensure cross-platform compatibility (Mac/Windows/Linux)
- Handle edge cases like partial file writes or temp files

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and added an Electron-backed task-folder watcher that subscribes the board to file add, delete, and move activity under `1-Stream/tasks`.
- 2026-03-24: Added a preload subscription API and renderer auto-refresh effect so the Kanban board reloads automatically when the watcher emits changes.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
