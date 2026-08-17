---
id: TASK-0025
title: Update generate prompt to request downloadable markdown output
type: task
status: done
priority: medium
rank: 2
owner: owner-name
assigned_to: assigned-person-or-agent
created: 2026-03-22
updated: 2026-03-22
tags: ["prompt-generation", "ux"]
related: ["TASK-0022"]
---

## Summary
Modify the generate prompt logic so it instructs the AI to return markdown files as downloadable files instead of browser-editable content.

## Why
Downloadable files improve usability by allowing users to save and use task files directly without manual copying.

## Acceptance Criteria
- Generated prompts explicitly instruct AI to return downloadable markdown files
- Output from AI is provided in a downloadable format
- No browser-editable markdown is returned when using the generate prompt button

## Context
The current system returns markdown that must be manually copied, which slows down workflow and introduces friction.

## Notes
- Ensure compatibility with how the app handles file downloads
- Consider fallback behavior if download is not supported
- Keep prompt instructions clear and consistent
- Updated the generated prompt to explicitly request downloadable `.md` files and to avoid browser-editable output.
- Added fallback wording so the external AI returns raw markdown only if downloadable files are not supported in that chat UI.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Corrected the task metadata to `TASK-0025` after finding a frontmatter id mismatch.
- 2026-03-22: Updated the generate-prompt instructions to request downloadable markdown output with a raw-markdown fallback.
- 2026-03-22: Verified the change with `npm run typecheck` and `npm run build`.
