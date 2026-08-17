---
id: TASK-0051
title: Remove all elements from the home page except the header, keeping its current text.
type: task
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Delete all non-header elements from the home page while preserving the "Workspace" header’s current text and styling.## Acceptance Criteria
- The header remains visible with its original content and CSS styles intact.
- All other page elements (body, footer, sidebars, widgets) are removed from the DOM.
- The resulting page loads without errors and displays only the header.

## Notes
Check for any JavaScript or CSS that references removed elements to avoid runtime errors. Ensure the header’s responsive behavior remains unchanged.## Acceptance Criteria
- The header remains visible with its original content and CSS styles intact , this is the workspace section at the top.
- All other page elements that are not the sidebar are removed from the DOM.
- The resulting page loads without errors and displays only the header.

## Activity Log
- 2026-03-24: Removed all non-header content from the home page component, leaving only the existing Workspace hero section and its current text/styling.
- 2026-03-24: Simplified the app shell usage so the home page no longer receives or depends on actions tied to the removed cards and buttons.
- 2026-03-24: Verified the simplified home page with `npm run typecheck` and `npm run build`.
