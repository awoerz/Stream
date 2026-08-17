---
id: TASK-0026
title: Rename application from Agent Sidecar to Stream across entire app
type: task
status: done
priority: medium
rank: 1
owner: owner-name
assigned_to: assigned-person-or-agent
created: 2026-03-22
updated: 2026-03-22
tags: ["branding", "refactor"]
related: []
---

## Summary
Update the application name from "Agent Sidecar" to "Stream" everywhere it appears in the codebase, UI, configuration, and documentation.

## Why
Ensures consistent branding across the application and avoids confusion for users and developers.

## Acceptance Criteria
- All visible UI text displays "Stream" instead of "Agent Sidecar"
- All configuration files, metadata, and internal references are updated
- No remaining occurrences of "Agent Sidecar" exist in the codebase (excluding historical logs if applicable)
- Application builds and runs successfully after changes

## Context
The application was previously named "Agent Sidecar" and is being rebranded to "Stream." This change should be applied globally and consistently.

## Notes
- Perform a full-text search across the repository for "Agent Sidecar"
- Check package.json, Electron config, window titles, menus, and any hardcoded strings
- Update README and any documentation files
- Be cautious of case sensitivity and partial matches
- Validate that renaming does not break any integrations or identifiers unintentionally

## Activity Log
- 2026-03-22: Task created
- 2026-03-22: Moved task to doing and updated the live app branding from Agent Sidecar to Stream across the UI, Electron metadata, package metadata, bridge naming, and active workflow docs.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`, and confirmed remaining old-name occurrences are limited to historical work-item records.
