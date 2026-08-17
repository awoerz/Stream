---
id: TASK-0024
title: Display latest task/bug ID in generate prompt button
type: task
status: done
priority: medium
rank: 1
owner: owner-name
assigned_to: assigned-person-or-agent
created: 2026-03-22
updated: 2026-03-22
tags: ["ui", "tasks", "prompt-generation"]
related: []
---

## Summary
Update the generate prompt button to include the latest task or bug ID so newly generated markdown files use the correct next ID.

## Why
Ensuring the correct task or bug ID prevents duplication and keeps the workflow system organized and consistent.

## Acceptance Criteria
- The system identifies the latest existing task and bug IDs
- The generate prompt button displays or uses the next available ID
- Generated markdown includes the correct incremented ID

## Context
Currently, generated task markdown may use placeholder or incorrect IDs. This creates confusion and requires manual correction.

## Notes
- Consider scanning existing task files to determine the highest ID
- Support both TASK and BUG prefixes if applicable
- Ensure performance is acceptable when scanning files
- Added a main-process lookup that scans existing work-item ids and returns the latest and next TASK and BUG ids.
- The prompt modal now displays latest ids and includes the next available ids in the generate button label and generated prompt content.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Added latest/next TASK and BUG id lookup and surfaced it in the prompt-generation UI.
- 2026-03-22: Verified the change with `npm run typecheck` and `npm run build`.
