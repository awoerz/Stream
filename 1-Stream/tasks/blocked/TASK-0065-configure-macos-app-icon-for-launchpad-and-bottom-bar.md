---
id: TASK-0065
title: Configure macOS App Icon for Launchpad and Bottom Bar
type: task
priority: medium
rank: 1
created: 2024-02-29
updated: 2026-04-02
---

## Summary
Configure the app icon for macOS launchpad and bottom bar display to ensure proper representation of the application.

## Acceptance Criteria
- The app icon displayed in Launchpad matches the main application icon.
- The app icon displayed in the macOS bottom bar matches the main application icon.
- Icon sizes are appropriately scaled for different display resolutions.

## Notes
The bottom-bar dock icon is now set at runtime from the generated Stream artwork, but Launchpad representation still depends on a packaged macOS `.app` bundle and a reliable `.icns` generation path.

## Activity Log
- 2026-04-02: Generated a reusable macOS-style iconset from the cropped Stream artwork under `electron/assets/stream-icon.iconset`.
- 2026-04-02: Wired the runtime macOS dock icon through Electron's `app.dock.setIcon(...)` so the running app uses the generated Stream asset in the bottom bar.
- 2026-04-02: Left Launchpad-specific verification blocked because the project still has no packaged macOS app pipeline, and the native CLI `.icns` conversion path did not produce a usable artifact in this workspace.
- 2026-04-02: Replaced the earlier square-canvas runtime icon with a rounded masked version of the cropped Stream artwork so the dock icon better matches the intended app-icon silhouette.
