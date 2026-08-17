---
id: TASK-0016
title: Add prompt generation input field and trigger button to UI
type: task
status: done
priority: medium
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [ui, ux, prompt-generation]
related: []
---

## Summary
Introduce a clear input field and button in the UI dedicated to generating prompts, separate from other actions.

## Why
Users need an obvious and intuitive way to generate prompts without confusion. Currently, this functionality is unclear or mixed with other workflows, reducing usability.

## Acceptance Criteria
- A visible input field exists specifically for prompt generation
- A clearly labeled button triggers prompt generation
- The input and button are easy to find and understand
- Prompt generation works independently of task creation

## Context
The application supports generating prompts for tasks or workflows, but the current UI does not clearly separate this functionality.

## Notes
- Consider placing this near the main workflow area or header
- Use clear labeling such as "Generate Prompt"
- Ensure accessibility and keyboard usability

Implemented as its own board action with a dedicated prompt modal containing a visible input field, explicit generate button, and copy action.

## Activity Log
- 2026-03-21: Task created
- 2026-03-22: Moved to doing and added a dedicated `Generate prompt` action to the board header.
- 2026-03-22: Added a clear source-description field and trigger button inside the prompt generation modal.
- 2026-03-22: Verified with `npm run typecheck` and `npm run build`.
