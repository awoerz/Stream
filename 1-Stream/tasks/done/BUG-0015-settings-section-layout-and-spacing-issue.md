---
id: BUG-0015
title: Settings section layout and spacing issue
type: bug
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
The settings section is currently displayed as three horizontally aligned cards with no margin or spacing between items. This layout is not user-friendly and does not match the traditional vertical section design.

## Acceptance Criteria
- The settings section is restructured into three vertically stacked sections.
- Each card has appropriate margin and padding to separate items visually.
- The layout is responsive and maintains usability on various screen sizes.

## Notes
Review the CSS grid/flexbox implementation for the settings container and adjust spacing properties. Ensure that any dynamic content within the cards remains accessible after layout changes.

## Activity Log
- 2026-03-24: Confirmed the settings page was still forcing a three-column desktop grid via `.settings-grid`, which caused the cramped horizontal layout described in the bug.
- 2026-03-24: Updated the settings layout to a single-column stack with explicit vertical spacing so Project, Workflow, and LM Studio settings read as distinct sections across window sizes.
- 2026-03-24: Verified the change with `npm run typecheck` and `npm run build`.
