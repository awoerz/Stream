---
id: TASK-0059
title: Improve sidebar icon appearance and snapping
type: bug
priority: medium
rank: 1
created: 2024-02-29
updated: 2026-03-31
---

## Summary
Improve the visual appearance of the sidebar by removing icons from pill containers and instead making them look like a modern menu similar to YouTube and the sidebar still is snapping along with redesigning the x/hamburger button to not be in a freaking pill.

## Acceptance Criteria
- Sidebar icons are removed from pills and replaced with rectangles for a cleaner look.
- The sidebar menu snaps to the correct position on different screen sizes and resolutions.
- The x/hamburger button is redesigned for improved usability (e.g., clearer visual cues, more intuitive interaction).

## Notes
Consider using CSS to manage the icon changes and snapping behavior. Test thoroughly on various devices and screen sizes.

## Activity Log
- 2026-03-31: Updated the collapsed desktop sidebar to use a narrower icon rail with rectangular icon targets instead of inherited pill buttons.
- 2026-03-31: Restyled the hamburger/close toggle as a flatter icon button and tightened the collapsed shell width so the rail snaps more cleanly.
- 2026-03-31: Verified the sidebar styling changes with `npm run typecheck` and `npm run build`.
- 2026-03-31: Reworked the sidenav items from button-style controls into link-like navigation rows with icon-plus-label alignment, then collapsed those rows by animating the labels out instead of swapping to mini button pills.
- 2026-03-31: Simplified the sidebar header to a toggle followed by the `Stream` wordmark and collapsed that branding down to `S` so the rail now shrinks more naturally.
- 2026-03-31: Moved the collapse control to the top-right above the `Stream` wordmark and slowed the shell transitions so the sidenav grows and shrinks more gently instead of popping between states.
- 2026-03-31: Tuned the header layout again so the toggle sits on its own row at the top-right with `Stream` beneath it, matching the requested visual hierarchy more closely.
- 2026-03-31: Flattened the remaining boxed-up sidebar pieces by replacing the large active pill with a subtle marker, stripping the theme toggle pill styling, and simplifying the status block.
- 2026-03-31: Tightened the collapsed rail width and centered the icon-only state so the `S` and nav icons share the same visual column without the extra right-side dead space.
- 2026-03-31: Moved the shell layout and sidebar styles into `src/App.module.css` and `src/components/Sidebar.module.css`, removed the old sidebar globals from `src/styles.css`, and locked the nav icon sizing in the module so the sidebar is isolated and easier to tune.
