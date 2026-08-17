---
id: BUG-0009
title: Implement readProjectPlan method and separate Project Plan page with markdown view/editor
type: bug
status: done
priority: high
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Add the missing `readProjectPlan` method to the Stream bridge, create a dedicated Project Plan page that displays markdown like GitHub, and provide an optional toggleable editor for editing the markdown.

## Acceptance Criteria
- The Stream bridge exposes a `readProjectPlan` method that returns the project plan content without errors.
- A new Project Plan page is added to the application, accessible via navigation or URL.
- The page renders the project plan markdown correctly, matching GitHub's styling.
- A toggle button allows switching between a read-only view and an editable markdown editor.
- Switching to the editor preserves existing content and updates the underlying data when saved.

## Notes
- Ensure backward compatibility with existing components that may call `readProjectPlan`.
- Use a lightweight markdown renderer (e.g., marked.js) for consistency with GitHub.
- The editor can be a simple textarea or a richer component like CodeMirror, depending on available resources.
- Update any relevant tests to cover the new method and page functionality.

## Activity Log
- 2026-03-24: Bug created
- 2026-03-24: Moved bug to doing and added `readProjectPlan`/`saveProjectPlan` bridge methods plus a dedicated Project Plan page with markdown rendering and toggleable editing.
- 2026-03-24: Verified with `npm run typecheck` and `npm run build`.
