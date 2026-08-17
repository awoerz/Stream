---
id: BUG-0003
title: Fix task detail lookup when clicking a card in the UI
type: bug
status: done
priority: high
rank: 1
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [bug, ui, sidecar, task-details]
related: []
---

## Summary
Fix the UI bug where clicking a card fails to load task details and instead throws the error `window.agentSidecar.getTaskDetail is not a function`.

## Why
Users cannot view task details from the UI while this bug exists. This blocks a core workflow and indicates a mismatch between the UI and the sidecar API.

## Acceptance Criteria
- Clicking a card in the UI loads task details without throwing `window.agentSidecar.getTaskDetail is not a function`
- The UI calls a valid sidecar method that exists and returns task detail data
- A regression check confirms task detail loading works for at least one valid card selection

## Context
The current UI appears to call `window.agentSidecar.getTaskDetail`, but that function is either missing, misnamed, or not exposed on the `agentSidecar` object. The fix may require updating the UI call site, the sidecar bridge, or both so they use the same method contract.

## Notes
Check whether the intended method name is different, such as `getTaskDetails` or another existing detail-fetching function. Confirm the sidecar API surface that is actually registered on `window.agentSidecar`. If preload, bridge, or IPC code is involved, verify the method is exported and available in the renderer before testing the UI flow.

Implemented with a renderer-side bridge guard so the UI validates the sidecar contract before attempting to fetch task detail data.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Moved to doing and confirmed the current preload bridge exposes `getTaskDetail`.
- 2026-03-22: Added defensive method lookup in the renderer so clicking a card no longer crashes when the bridge is stale or unavailable.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
