---
id: BUG-0014
title: Error invoking remote method 'task:save-generated-markdown' when creating a task with LM Studio
type: bug
status: done
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
When creating a new task in LM Studio, the first attempt often fails with the error:  
`Error invoking remote method 'task:save-generated-markdown': Error: The markdown file must start with frontmatter.`  
The user must click the create button twice for the task to be saved correctly.

## Acceptance Criteria
- The error message no longer appears on the first attempt to create a task.
- A single click on the "Create Task" button successfully saves the markdown file with proper frontmatter.
- The system logs should not contain any related error entries after the fix.

## Notes
Investigate the frontmatter validation logic in the `task:save-generated-markdown` method. Ensure that the markdown content is correctly prefixed with frontmatter before validation, and handle cases where the user input may be empty or malformed. Consider adding a retry mechanism or clearer error handling to improve UX.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and hardened LM Studio markdown import so frontmatter can be synthesized from markdown-like responses that omit it on the first attempt.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
