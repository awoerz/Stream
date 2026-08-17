---
id: TASK-0020
title: Update workflow initialization to scaffold the Stream v1 folder structure
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [stream, scaffolding, initialization]
related: [TASK-0001]
---

## Summary
Update workflow initialization so the app scaffolds the new v1 Stream folder and file structure under `1-Stream`, including renaming `project-plan.md` to `project-plan.md`.

## Why
The current structure is too messy and mixes responsibilities. Stream needs a simpler, more intentional layout so humans and agents can quickly understand what each file is for. The term “epic” also carries agile-specific meaning and suggests completion, while this document is intended to be a living, evolving plan.

## Acceptance Criteria
- New initialization creates this structure under `1-Stream/`:
  - `README.md`
  - `stream.md`
  - `project-plan.md`
  - `current-state.md`
  - `decisions.md`
  - `tasks/backlog/`
  - `tasks/doing/`
  - `tasks/blocked/`
  - `tasks/done/`
  - `templates/work-item-template.md`
- Existing `project-plan.md` is renamed to `project-plan.md`
- All references to `project-plan.md` in the codebase are updated to `project-plan.md`
- The app no longer generates or depends on `project-plan.md`
- Template generation uses `work-item-template.md` instead of `work-item-template.md`
- Work item type continues to be controlled by frontmatter `type`, not separate template types
- The app still reads work items correctly from the status folders after initialization
- The app still builds successfully after the scaffold update

## Context
This task defines the new Stream v1 structure and removes ambiguity around the role of the former `project-plan.md` file by replacing it with a clearer, continuously evolving `project-plan.md`.

## Notes
- Updated initialization to scaffold the Stream v1 structure under `1-Stream/` with `README.md`, `stream.md`, `project-plan.md`, `current-state.md`, `decisions.md`, task status folders, and `templates/work-item-template.md`.
- Updated the current repository's existing workflow files to that same structure by renaming `project-plan.md` to `project-plan.md`, `curernt-state.md` to `current-state.md`, and `templates/work-item-template.md` to `templates/work-item-template.md`.
- Removed deprecated `project-memory/` and `decisions/` directories from the migrated repository after preserving their contents in the new top-level files.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Reopened after discovering the current repository still had the pre-migration workflow file layout.
- 2026-03-22: Brought the repository's actual workflow files into the Stream v1 top-level structure.
- 2026-03-22: Verified the scaffold update with `npm run typecheck` and `npm run build`.
