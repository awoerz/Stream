---
id: BUG-0012
title: Remove tags, related, owner, and agent from card preview
type: bug
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
The card preview currently displays metadata fields (`tags`, `related`, `owner`, `agent`) that should not be shown. These fields are only relevant for file metadata and must be hidden from the UI.

## Acceptance Criteria
- The card preview no longer renders `tags`, `related`, `owner`, or `agent` fields.
- Existing card previews continue to display only the intended content (title, description, etc.).
- No regressions occur in other parts of the preview rendering logic.

## Notes
Check the template rendering pipeline for any hard‑coded references to these fields and remove them. Ensure unit tests cover the absence of these properties in the preview output.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and removed owner/agent plus tags/related metadata blocks from the task detail preview so only the intended task content remains visible.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
