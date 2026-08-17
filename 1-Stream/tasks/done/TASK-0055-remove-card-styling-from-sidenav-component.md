---
id: TASK-0055
title: Remove card styling from sidenav component
type: task
priority: high
rank: 1
created: 2024-02-29
updated: 2026-03-31
---

## Summary
Remove the card styling applied to the sidenav component, reverting it to a standard sidenav appearance.## Acceptance Criteria
- The sidenav component no longer has the card styling applied.
- The sidenav visually matches the expected design without any visual cues indicating it should be a card.
- The change does not introduce regressions in other areas of the application that rely on the sidenav component.

## Notes
This change is necessary to align with the updated design specifications for the sidenav component.  Ensure that any existing CSS rules related to card styling are removed or updated accordingly.## Acceptance Criteria
- The sidenav component no longer has the card styling applied.
- The sidenav visually matches the expected design without any visual cues indicating it should be a card.
- The change does not introduce regressions in other areas of the application that rely on the sidenav component.

## Activity Log
- 2026-03-31: Removed the shared card treatment from the sidebar and restyled it as structural navigation with a simple divider instead of rounded card chrome.
- 2026-03-31: Verified that the sidenav changes did not break the shared app shell by running `npm run typecheck` and `npm run build`.
