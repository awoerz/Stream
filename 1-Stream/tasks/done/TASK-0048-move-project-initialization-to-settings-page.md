---
id: TASK-0048
title: Move project initialization to settings page
type: task
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Replace the current modal/dialog for adding a project and re-running initialization with navigation to a dedicated settings page. The settings page should contain controls for adding projects, re-running initialization, the existing LM Studio connection settings, and any related configuration options.

## Acceptance Criteria
- The settings cog icon navigates to a new settings page instead of opening a modal.
- The settings page includes a section for adding a new project with necessary input fields and validation.
- A button or control is available to re-run initialization, triggering the same logic as before but from the settings page.
- The UI layout is consistent with existing design guidelines and responsive across devices.
- Navigation back to the main interface works correctly after completing actions on the settings page.

## Notes
- Ensure that any state changes (e.g., new project added, initialization status) are reflected immediately in the main UI.
- Update any routing logic to handle the new settings page path.
- Verify that accessibility attributes are applied to all interactive elements on the settings page.

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and converted the gear/settings flow into a dedicated Settings page that now owns project selection, initialization, gitignore mode, and LM Studio connection controls.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
