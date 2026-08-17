---
id: TASK-0061
title: Sidebar alignment and active row polish
type: task
priority: high
rank: 1
created: 2026-04-01
updated: 2026-04-01
---

## Summary
Make a narrow visual pass on the sidebar so the collapsed rail aligns cleanly and the expanded navigation uses a full-row rectangular active treatment instead of the current side-marker emphasis.

## Acceptance Criteria
- The collapsed sidebar rail centers the `S`/brand and nav icons more cleanly without the current extra right-side feel.
- The collapse toggle looks more like a deliberate navigation control and does not determine the alignment of the brand or nav items.
- Expanded nav items use a full-row rectangular highlight for the active state instead of the side marker.

## Notes
Keep the work tightly scoped to sidebar alignment, toggle treatment, and active-row styling only.

## Activity Log
- 2026-04-01: Reworked the sidebar header so the toggle is positioned independently from the brand layout, then switched the collapse iconography to a simpler chevron control.
- 2026-04-01: Tightened the collapsed rail width and icon target sizing so the `S` and icon-only nav state sit more centrally without the previous extra right-side feel.
- 2026-04-01: Replaced the expanded-state side marker with a full-row rectangular active highlight so the nav row itself is the selected surface.
- 2026-04-01: Verified the narrow sidebar pass with `npm run typecheck` and `npm run build`.
- 2026-04-01: Removed the leftover collapsed-state flex gap between the icon and hidden label so the icon-only nav buttons no longer render visually left-shifted.
- 2026-04-01: Restored the collapsed sidebar's right-side padding to match the expanded gutter and added a little more space above the `S` wordmark so the collapsed rail sits more evenly in the column.
