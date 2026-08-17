---
id: TASK-0011
title: Add markdown task upload flow
type: task
status: done
priority: medium
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [tasks, upload, markdown, ux]
related: [TASK-0009]
---

## Summary
Add an upload flow that allows the user to import a generated markdown task file directly into Stream instead of manually placing it in the 1-Stream folder.

## Why
Users should be able to create and manage tasks through the application without needing to open the file system. This makes the workflow friendlier and reduces friction when using external AI tools to generate task files.

## Acceptance Criteria
- The task view includes a clear way to upload a markdown task file
- The user can select a `.md` file from their computer
- The app validates that the uploaded file appears to match the expected task structure
- If valid, the task file is saved into the correct status folder inside `1-Stream/tasks/`
- The uploaded task appears in the task board after import
- If the file is invalid or missing required structure, the user receives a clear error message
- The upload flow does not require the user to manually browse to the `1-Stream` folder outside the app

## Context
This task works together with the generate-task prompt helper. A user can generate task markdown with ChatGPT and then import it through Stream, keeping the workflow centered in the application.

## Notes
For v1, validation can be simple and pragmatic. The goal is to catch obvious problems without overengineering a full markdown parser or schema engine.

Implemented from the board view with pragmatic validation for frontmatter and required sections, then normalized import into the correct workflow status folder.

## Activity Log
- 2026-03-21: Task created
- 2026-03-21: Moved to doing and added an `Import markdown` flow to the task board.
- 2026-03-21: Implemented markdown validation, status-based import, fresh task ID assignment, and automatic board refresh after successful import.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
