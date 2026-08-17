---
id: TASK-0027
title: Update generate prompt with explicit file output preference rules
type: task
status: done
priority: medium
rank: 1
owner: owner-name
assigned_to: assigned-person-or-agent
created: 2026-03-22
updated: 2026-03-22
tags: ["prompt", "workflow", "output-format"]
related: []
---

## Summary
Update the app’s generate prompt to explicitly enforce preferred output behavior for task file creation, prioritizing downloadable `.md` file attachments over raw markdown.

## Why
The current prompt does not strongly enforce file-based output, leading to inconsistent behavior across different LLMs. Making the preference explicit ensures better compatibility, usability, and consistency in how task files are returned.

## Acceptance Criteria
- The generate prompt includes the exact preferred output format language provided.
- The prompt clearly prioritizes `.md` file attachments over raw markdown.
- The fallback condition (raw markdown only if attachments are unsupported) is explicitly stated.
- The prompt explicitly disallows canvas, artifact, or inline document editor outputs.
- Existing functionality for task generation remains unchanged aside from output formatting behavior.

## Context
This change improves reliability across different LLM environments, ensuring that models default to file downloads when supported while still providing a safe fallback for environments that do not support attachments.

## Notes
- Ensure wording matches exactly as specified to avoid ambiguity.
- Validate behavior in both environments:
  - One that supports file downloads
  - One that does not
- This is a prompt-level change, not a UI or backend file handling change.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Moved task to doing and tightened the generated prompt so it explicitly prefers downloadable `.md` attachments, falls back to raw markdown only when attachments are unsupported, and disallows canvas, artifact, and inline editor output.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
