---
id: BUG-0004
title: Fix prompt import failure caused by missing agent sidecar function
type: bug
status: done
priority: high
rank: 1
owner: adam
agent: gary
created: 2026-03-22
updated: 2026-03-22
tags: [bug, import, prompt]
related: []
---

## Summary
Fix the prompt import flow that fails with the error `window.agentSidecar.importTaskMarkdown is not a function` when a user tries to import a prompt.

## Why
Prompt import is currently broken, which prevents users from loading markdown workflow content into the app. This blocks a core workflow and should be treated as a bug.

## Acceptance Criteria
- Importing a prompt no longer throws `window.agentSidecar.importTaskMarkdown is not a function`
- The app either calls the correct import API or safely handles the sidecar being unavailable
- A user can successfully import valid markdown without the UI failing
- An invalid or unavailable import path shows a clear user-facing error instead of a runtime crash

## Context
The current implementation is attempting to call `window.agentSidecar.importTaskMarkdown`, but that function is not available at runtime. The issue may be caused by an incorrect function name, a missing preload bridge, an outdated sidecar contract, or missing defensive checks before calling the import method.

## Notes
Verify the expected sidecar API surface and confirm whether `importTaskMarkdown` should exist or whether another function should be used instead.
Add a guard before calling into `window.agentSidecar` so the UI can fail gracefully if the bridge is missing.
Update any related import wiring, typings, or integration tests to reflect the correct contract.

Implemented with the same guarded bridge lookup used for task details so import now either uses the exposed method safely or shows a clear recovery message.

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Moved to doing and confirmed the preload bridge exposes `importTaskMarkdown`.
- 2026-03-22: Added defensive import bridge lookup so missing sidecar methods produce a user-facing error instead of a runtime crash.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
