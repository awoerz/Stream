---
id: TASK-0028
title: Add minimum column width and horizontal board scrolling
type: task
status: done
priority: medium
rank: 1
owner: owner-name
assigned_to: assigned-person-or-agent
created: 2026-03-23
updated: 2026-03-23
tags: []
related: []
---

## Summary
Make board columns use a minimum width so they remain readable, and add horizontal scrolling when the total column width exceeds the available viewport.

## Why
Without a minimum width, columns can become too narrow to use effectively. Horizontal scrolling allows the board to preserve usability and layout clarity when more columns are present than can comfortably fit on screen.

## Acceptance Criteria
- Board columns have a defined minimum width and do not shrink below it during normal layout.
- The board container supports horizontal scrolling when the combined column widths exceed the available width.
- The layout remains usable on smaller screens without overlapping or breaking column content.

## Context
This work applies to the board layout and column presentation. The goal is to improve readability and prevent columns from becoming compressed when multiple columns are visible at the same time.

## Notes
Add the minimum width at the column container level rather than relying only on inner content sizing. Ensure the scroll behavior is applied to the correct parent container so drag-and-drop or other board interactions continue to work as expected.

## Activity Log
- 2026-03-23: Task created
- 2026-03-23: Moved task to doing and updated the task board layout so columns keep a minimum width and the board scrolls horizontally when the viewport is narrower than the full board.
- 2026-03-23: Verified with `npm run typecheck` and `npm run build`.
