---
id: TASK-0021
title: Add stream.md scaffolding and support it as the agent instruction file
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [stream, agent, instructions]
related: [TASK-0001, TASK-0002]
---

## Summary
Add support for `1-Stream/stream.md` as the dedicated agent instruction file and scaffold it during initialization with the agreed Stream execution rules.

## Why
Stream needs a single stable instruction document that a repeatable prompt can target. This allows the human to manage work in Stream while the agent reads one file, selects the next work item, performs the work, updates documentation, and reports back.

## Acceptance Criteria
- Workflow initialization creates `1-Stream/stream.md`
- `stream.md` is scaffolded with default agent instructions for task selection, execution, status updates, and reporting
- The instructions tell the agent to select work based on status, `rank`, and `priority`
- The instructions tell the agent to update `current-state.md` after implementation changes
- The instructions tell the agent to update `decisions.md` when meaningful decisions are made
- The instructions clearly separate agent guidance from the human-facing `README.md`
- The app still builds successfully after adding `stream.md` support

## Context
`stream.md` is intended to become the single file a repeatable Codex prompt can target. It should define how the agent behaves inside a Stream-enabled project without mixing those rules into `README.md`.

## Notes
The agent instruction file should support this workflow:
1. Read `stream.md`
2. Find the next eligible work item
3. Execute the work
4. Update the work item
5. Update `current-state.md`
6. Update `decisions.md` if needed
7. Report back

Implementation notes:
- Added `stream.md` to the generated starter files for new Stream workspaces.
- Added a real `1-Stream/stream.md` file to this repository as part of the migration.
- Kept `stream.md` separate from the human-facing `README.md`.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Reopened after discovering the current repository had not actually gained a `stream.md` file yet.
- 2026-03-22: Added `1-Stream/stream.md` to the current repository with task-selection, execution, documentation-update, and reporting guidance.
- 2026-03-22: Verified the new agent instruction scaffold with `npm run typecheck` and `npm run build`.
