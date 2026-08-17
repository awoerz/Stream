---
id: TASK-0052
title: Add placeholder box linking to GitHub repo and README
type: task
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Create a placeholder box on the landing page that links to the project's GitHub repository and its README, displaying the text “Learn more and give us a star”.

## Acceptance Criteria
- The placeholder box is visible on the landing page.
- Clicking the box navigates to the GitHub repository’s README page.
- The box displays the exact text “Learn more and give us a star”.
- The link opens in a new browser tab.

## Notes
- Use the repository URL from the project settings.
- Ensure the box is styled consistently with existing UI components.
- Add alt text for accessibility.

## Activity Log
- 2026-03-24: Added a clickable placeholder card to the home page with the required `Learn more and give us a star` copy and consistent card styling.
- 2026-03-24: Wired the card through Electron so the README target opens externally instead of taking over the app window.
- 2026-03-24: Verified the card and external-link plumbing with `npm run typecheck` and `npm run build`.
