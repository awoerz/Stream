---
id: BUG-0013
title: Project attachment settings UI layout issue
type: bug
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
The UI for the project attachment section in settings displays all items scrunched together. The layout should separate the section into three distinct parts: project selection, initialization, and LM Studio URL.

## Acceptance Criteria
- The settings page shows three clearly separated sections: Project Selection, Initialization Steps, and Attachment Controls.
- Each section has its own header and adequate spacing to avoid visual clutter.
- The project selection area is independent from the initialization steps, allowing users to choose a project before configuring initialization.
- The layout remains responsive and consistent across supported browsers.

## Notes
Consider reviewing the CSS grid/flexbox implementation for the settings page. Ensure that any dynamic content loading does not collapse sections. Verify changes with both light and dark themes.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and split the settings UI into separate cards for project selection, initialization, and LM Studio connection so the page no longer feels compressed.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
