---
id: TASK-0064
title: Update macOS app name to 'Stream'
type: task
priority: medium
rank: 1
created: 2024-02-29
updated: 2026-04-02
---

## Summary
Change the application's name displayed in the macOS top left corner from the current name to 'Stream'.

## Acceptance Criteria
- The application's name in the macOS top left corner is updated to 'Stream'.
- The change is reflected across all platforms (macOS).

## Notes
This work is not complete in the current `npm run dev` runtime. Electron's `app.setName()` changes Electron's internal name, but Electron's docs note that it does not affect the OS-level app name, so macOS still shows `Electron` until Stream runs from a custom packaged bundle instead of the stock Electron host executable.

## Activity Log
- 2026-04-02: Added `productName: "Stream"` to the package metadata so future tooling can pick up the capitalized app name consistently.
- 2026-04-02: Added main-process application identity configuration so Electron sets the runtime app name and about-panel metadata to `Stream` instead of relying only on window titles.
- 2026-04-02: Verified the app-name changes compile cleanly with `npm run typecheck` and `npm run build`.
- 2026-04-02: Moved `app.setName("Stream")` to the earliest startup path so macOS can pick up the Stream name before Electron finishes bootstrapping the application menu.
- 2026-04-02: Reclassified the task as not done after checking Electron's docs and confirming that `app.setName()` does not change the OS-level app name used by the macOS menu bar in the stock Electron dev host.
- 2026-04-02: Added an explicit native application menu with a Stream-labeled app menu and standard Edit/View/Window menus so the app no longer relies on Electron's default menu template while testing the macOS naming behavior.
