---
id: BUG-0011
title: Resolve conflicting settings icon in side navigation
type: bug
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
The settings side navigation currently displays both a side nav item and an unrelated cog icon. The UI should show only one consistent icon for settings, preferably a better-looking cog.

## Acceptance Criteria
- The side navigation displays only one icon for the settings page.
- The chosen icon is a clear, modern cog or an alternative that better represents settings.
- No duplicate or conflicting icons appear in the UI.
- The change is reflected across all relevant views and devices.

## Notes
* Review current icon assets for a suitable replacement.
* Update the navigation component to conditionally render only the selected icon.
* Verify that keyboard navigation and accessibility labels remain correct.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and removed the standalone sidebar gear button, keeping a single settings navigation item with an embedded cog icon.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
