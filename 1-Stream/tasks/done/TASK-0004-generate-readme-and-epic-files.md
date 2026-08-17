---
id: TASK-0004
title: Generate README and epic files
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-20
updated: 2026-03-21
tags: [workflow, templates, markdown]
related: [TASK-0003]
---

## Summary
Add functionality to generate starter `README.md`, `project-plan.md`, and base template files inside the initialized `1-Stream` structure.

## Why
The workflow should be immediately useful after initialization, not just an empty folder tree.

## Acceptance Criteria
- The app generates `1-Stream/README.md`
- The app generates `1-Stream/project-plan.md`
- The app generates a task template file
- Generated files are human-readable and useful as a starting point
- Existing files are not overwritten accidentally

## Context
This task turns initialization into a usable workflow starter kit.

## Notes
Default file contents should be practical and minimal.

Implemented as part of workflow initialization so starter files are created when missing and preserved when already present.

## Activity Log
- 2026-03-20: Task created
- 2026-03-21: Moved to doing and added starter file generation for `README.md`, `project-plan.md`, and `templates/work-item-template.md`.
- 2026-03-21: Ensured initialization does not overwrite existing files and surfaces created versus skipped starter files in the UI.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
