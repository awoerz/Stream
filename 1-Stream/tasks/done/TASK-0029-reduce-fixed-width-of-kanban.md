---
id: TASK-0029
title: Reduce fixed width of Kanban columns
type: task
status: done
priority: medium
rank: 1
owner: owner-name
assigned_to: developer
created: 2026-03-23
updated: 2026-03-23
tags: ["ui", "kanban", "layout"]
related: []
---

## Summary
Update the fixed width of Kanban columns to be smaller so more columns can fit within the viewport without excessive horizontal scrolling.

## Why
The current column width is too large, making it difficult to view multiple columns at once and reducing usability of the board. A more compact layout will improve visibility and workflow efficiency.

## Acceptance Criteria
- Column width is reduced from its current fixed size.
- At least one additional column can fit within a standard viewport (e.g., 1440px width) without horizontal scrolling.
- Column contents (cards, headers) remain readable and properly aligned.
- No layout breaking or overflow issues occur after resizing.
- Styling changes are consistent across all Kanban boards.

## Context
The Kanban board currently uses fixed-width columns, which is good for consistency, but the size is too large. This change should preserve the fixed-width approach while adjusting the value to something more compact.

## Notes
- Locate where column width is defined (CSS, styled components, or inline styles).
- Consider testing multiple widths (e.g., 280px, 300px, 320px).
- Ensure drag-and-drop behavior is unaffected.
- Verify responsiveness on smaller screens.

## Activity Log
- 2026-03-23: Task created
- 2026-03-23: Moved task to doing and reduced the fixed kanban column widths so more columns fit before horizontal scrolling is needed, while preserving board readability and alignment.
- 2026-03-23: Verified with `npm run typecheck` and `npm run build`.
