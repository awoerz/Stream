---
id: TASK-000X
title: Add optional .gitignore support during workflow initialization
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [git, initialization, workflow]
related: [TASK-0003]
---

## Summary
Add functionality to optionally update the selected project’s `.gitignore` file to include the `1-Stream/` directory during initialization.

## Why
Users may want to keep workflow files private and avoid committing them to version control, while others may want them tracked. This behavior should be configurable.

## Acceptance Criteria
- During workflow initialization, the user is presented with an option:
  - "Track 1-Stream in Git"
  - "Ignore 1-Stream via .gitignore"
- If "ignore" is selected:
  - `.gitignore` is created if it does not exist
  - `1-Stream/` is added if not already present
- If "track" is selected:
  - no changes are made to `.gitignore`
- Existing `.gitignore` contents are preserved
- Duplicate entries are not added
- Behavior is safe and idempotent

## Context
Agent Sidecar attaches to existing projects and must not assume how users want to manage version control.

## Notes
Do not initialize a Git repository. Only modify `.gitignore` if it exists or if the user chooses to create one.

Implemented as an initialization option in the UI, with safe `.gitignore` creation or update only when the user chooses to ignore `1-Stream/`.

## Activity Log
- 2026-03-21: Task created
- 2026-03-21: Moved to doing and added a track-versus-ignore choice to workflow initialization.
- 2026-03-21: Implemented safe `.gitignore` creation and update behavior that preserves existing contents and avoids duplicate `1-Stream/` entries.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
