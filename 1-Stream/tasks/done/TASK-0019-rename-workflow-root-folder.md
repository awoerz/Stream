---
id: TASK-0019
title: Rename workflow root folder from 1-Stream to 1-Stream
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [stream, structure, migration]
related: []
---

## Summary
Rename the workflow root folder used by the application from `1-Stream` to `1-Stream` and update all related path references in the app.

## Why
The workflow folder should be immediately visible and easy for both humans and agents to find. `1-Stream` better communicates purpose and keeps the folder near the top of the project structure.

## Acceptance Criteria
- All application logic that currently references `1-Stream` is updated to use `1-Stream`
- The app can detect an existing `1-Stream` folder correctly
- New workflow initialization creates `1-Stream` instead of `1-Stream`
- UI text, status messages, prompts, and helper copy no longer mention `1-Stream`
- The app still builds successfully after the rename

## Context
This is a product-level naming decision for the workflow root. The new folder name should be treated as the source-of-truth location for Stream files going forward.

## Notes
- Physically renamed this repository's workflow root from `1-Stream` to `1-Stream`.
- Updated the application so `1-Stream` is the only live workflow root used for status checks, board reads, save, and import.
- Kept legacy `1-Stream` handling only as an initialization-time migration path rather than a runtime board fallback.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Reopened after discovering the current repository still used `1-Stream` on disk and the app still treated it as a live runtime root.
- 2026-03-22: Renamed the real workflow folder in this repository to `1-Stream` and updated `.gitignore` accordingly.
- 2026-03-22: Removed the live runtime fallback to `1-Stream` so the board now treats `1-Stream` as authoritative.
- 2026-03-22: Verified the rename with `npm run typecheck` and `npm run build`.
