---
id: TASK-0049
title: Redirect user to settings page when URL is missing in settings
type: task
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Implement a redirect that sends users to the settings page when the required URL is not present in the application settings, replacing the current warning display.

## Acceptance Criteria
- When the URL is missing in settings, the user is automatically redirected to the settings page.
- The redirect occurs before any warning message is shown to the user.
- The redirection preserves any necessary query parameters or state required for the settings page to function correctly.
- No warning message is displayed when the redirect takes place.

## Notes
- Ensure that the redirection logic does not create a redirect loop.
- Test both scenarios: URL present and URL missing.

## Activity Log
- 2026-03-24: Updated the disabled LM Studio action handling so the missing-URL case redirects directly to Settings instead of showing a board warning.
- 2026-03-24: Kept the existing board warning path for other unmet prerequisites, such as an invalid or unverified LM Studio URL.
- 2026-03-24: Verified the redirect and warning changes with `npm run typecheck`, `npm run build`, and a source sweep to ensure the old warning path no longer covers the missing-URL case.
