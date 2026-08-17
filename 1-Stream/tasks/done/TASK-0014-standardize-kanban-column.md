---
id: TASK-0014
title: Standardize Kanban column and card heights for consistent layout
type: task
status: done
priority: medium
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [kanban, ui, layout]
related: []
---

## Summary
Adjust the Kanban board layout so columns and cards have consistent and predictable sizing. Cards should have a standard height, and columns should not stretch unevenly.

## Why
Inconsistent heights make the UI feel unpolished and harder to scan. Standardized sizing improves readability, usability, and overall visual quality.

## Acceptance Criteria
- Task cards have a consistent default height
- Columns do not stretch unevenly due to content differences
- Overflow behavior (scrolling) works correctly within columns
- Layout remains responsive across screen sizes

## Context
Current layout results in all columns appearing the same height, likely due to flex or grid settings. Cards may be dynamically resizing based on content.

## Notes
- Review CSS layout (flexbox/grid) settings for columns
- Consider setting max-height with scroll for columns
- Use consistent padding and truncation for card content

Implemented with fixed-height columns, scrollable column bodies, consistent card minimum heights, and title truncation for cleaner scanning.

## Activity Log
- 2026-03-21: Task created
- 2026-03-22: Moved to doing and standardized kanban column sizing with consistent min/max heights and internal scrolling.
- 2026-03-22: Added default card heights and content truncation so columns stay visually balanced across different task lengths.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
