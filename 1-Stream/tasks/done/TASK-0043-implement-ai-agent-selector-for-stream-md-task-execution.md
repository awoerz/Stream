---
id: TASK-0043
title: Implement AI Agent Selector for Stream.md Task Execution
type: task
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Add a button that allows any AI agent to read the `stream.md` folder and execute the next task. Include an optional selector so the app can tailor the message to a specific agent.

## Acceptance Criteria
- A UI button is added that triggers an AI agent to scan the `stream.md` folder.
- The system can optionally select a specific AI agent; if none is selected, the default agent handles the task.
- The chosen agent receives a clear instruction to identify and carry out the next pending task.
- If the feature cannot be implemented, the task is marked as blocked.

## Notes
Implemented the practical version available in-app today: users can open an agent helper, choose a target agent, resolve the next actionable task from `doing` or `backlog`, and copy a tailored execution instruction that points the agent at `stream.md` and the selected work item.

## Activity Log
- 2026-03-24: Task created
- 2026-03-24: Moved task to doing and added an agent helper with selectable agent presets, next-task resolution, and copyable execution instructions grounded in `stream.md`.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
