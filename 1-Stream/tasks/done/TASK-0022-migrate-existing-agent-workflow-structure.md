---
id: TASK-0022
title: Migrate existing 1-Stream structure to 1-Stream v1 structure
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [stream, migration, refactor]
related: [TASK-0001, TASK-0002, TASK-0003]
---

## Summary
Migrate any existing `1-Stream` folder in a project to the new `1-Stream` v1 structure, including renaming files, moving directories, and removing deprecated files.

## Why
Initialization now creates the correct structure, but existing projects still use the old layout. Without a migration step, the app will have inconsistent behavior across projects and agents may read outdated or conflicting files.

## Acceptance Criteria
- If `1-Stream/` exists, it is renamed or migrated to `1-Stream/`
- All existing files are preserved and moved to their correct locations in the new structure
- `project-plan.md` is renamed to `project-plan.md`
- Any references to `project-plan.md` in migrated files are updated if necessary
- `work-item-template.md` is renamed to `work-item-template.md`
- Existing task folders are mapped correctly:
  - `tasks/backlog/` → unchanged
  - `tasks/doing/` → unchanged
  - `tasks/blocked/` → unchanged
  - `tasks/done/` → unchanged
- Any deprecated or unused files from the old structure are removed or ignored
- A new `stream.md` file is created if it does not already exist
- Existing task files remain valid and readable by the app after migration
- The app correctly loads and displays tasks after migration
- The app builds successfully after the migration logic is implemented

## Context
This is a one-time migration step to bring older projects in line with the new Stream v1 structure. It should be safe, predictable, and avoid data loss.

## Notes
- Prefer a safe migration approach: move and rename files rather than delete and recreate
- Do not overwrite existing files unless necessary
- If both old and new files exist, prefer the new structure and preserve data from the old one
- Log or surface migration actions if helpful for debugging
- Do not introduce new prioritization systems during migration
- Implemented migration during workflow initialization by renaming a legacy `1-Stream` root to `1-Stream` when needed.
- Completed the migration for this repository's actual workflow files instead of leaving it as a theoretical code path.
- Preserved decision and conventions content by folding it into top-level `decisions.md` and `README.md` before removing deprecated directories.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Corrected the task metadata to `TASK-0022` after finding the file saved with a filename/frontmatter mismatch.
- 2026-03-22: Reopened after discovering the repository itself had not actually been migrated and the board could still read the legacy root.
- 2026-03-22: Migrated the current repository from `1-Stream` to `1-Stream`, cleaned the file layout, and removed legacy runtime-root behavior.
- 2026-03-22: Verified the migration behavior with `npm run typecheck` and `npm run build`.
