---
id: TASK-0010
title: Add AI prompt generator for structured markdown task creation
type: task
status: done
priority: high
owner: adam
agent: gary
created: 2026-03-21
updated: 2026-03-21
tags: [tasks, prompting, ux, ai-assisted]
related: [TASK-0008]
---

## Summary
Add a prompt generator that produces a fully self-contained instruction block for any AI (e.g., ChatGPT) to generate a properly formatted markdown task file that matches the Stream workflow.

## Why
Users should be able to describe work in plain language and generate structured task files without manually formatting markdown or relying on prior chat context. The generated prompt must work in a fresh AI session and produce consistent, valid output.

## Acceptance Criteria
- The task creation experience includes a prompt generator section
- The user can enter a plain-language description of the task they want to create
- The app generates a complete, copyable prompt that:
  - works in a fresh AI chat with no prior context
  - clearly defines the required markdown task structure
  - instructs the AI to return a valid markdown file
  - instructs the AI to include all required sections:
    - frontmatter (id, title, type, status, priority, owner, assigned_to, dates, tags, related)
    - summary
    - why
    - acceptance criteria
    - context
    - notes
    - activity log
  - instructs the AI to format the output as a downloadable markdown file
- The generated prompt includes guidance such as:
  - if the task is too large, break it into multiple smaller tasks
  - keep tasks clear, testable, and scoped to a single unit of work
- The generated prompt embeds the user's input as the source description for the task
- The prompt is easy to copy with a single action
- No direct AI integration is required inside the app

## Context
This feature allows Stream to leverage external AI tools for task generation while keeping the application local-first and simple. It ensures consistent task structure across sessions and tools.

## Notes
The prompt must not assume that the task is assigned to an AI agent. Tasks must support both human and agent execution via the `assigned_to` field.

Implemented inside the task-creation modal so users can either fill fields directly or generate a fresh-chat prompt from a plain-language description.

## Activity Log
- 2026-03-21: Task created
- 2026-03-21: Moved to doing and added a prompt generator section to the task creation experience.
- 2026-03-21: Implemented plain-language input, prompt generation, and one-click prompt copying for use in external AI tools.
- 2026-03-21: Verified with `npm run typecheck` and `npm run build`.
