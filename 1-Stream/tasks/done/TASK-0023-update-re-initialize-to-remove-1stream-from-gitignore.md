---
id: TASK-0023
title: Update re-initialize to remove 1-stream from .gitignore
type: task
status: done
priority: medium
rank: 1
owner: adam
assigned_to: gary
created: 2026-03-22
updated: 2026-03-22
tags: ["git", "initialization", "workflow"]
related: []
---

## Summary
Update the re-initialize process so that when 1-stream tracking is enabled, the `1-stream` entry is removed from the `.gitignore` file.

## Why
Re-initializing the project to track 1-stream should ensure that the folder is no longer ignored by Git. Without this change, the system behavior is inconsistent and prevents proper tracking of 1-stream data.

## Acceptance Criteria
- When re-initialize is run with 1-stream tracking enabled, `.gitignore` no longer contains `1-stream`
- If `1-stream` is not present in `.gitignore`, the process does not fail
- Changes to `.gitignore` are persisted correctly after re-initialize completes

## Context
The project currently ignores the `1-stream` folder via `.gitignore`. Re-initialize is intended to reconfigure the project for active tracking, but it does not currently update `.gitignore` accordingly.

## Notes
- Ensure only the `1-stream` entry is removed without affecting other `.gitignore` entries
- Consider handling edge cases such as whitespace or commented lines
- Validate behavior across different OS environments (line endings)
- Implemented `.gitignore` cleanup for tracking mode during re-initialize.
- Removal now handles `1-Stream`, `1-Stream/`, `1-stream`, and `1-stream/` entries without touching unrelated lines.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Updated re-initialize so tracking mode removes the `1-Stream` ignore entry from `.gitignore` when present.
- 2026-03-22: Verified the change with `npm run typecheck` and `npm run build`.
