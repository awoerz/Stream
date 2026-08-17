---
id: TASK-0070
title: Update local development URL for GitHub link
type: task
priority: medium
rank: 1
created: 2026-05-19
updated: 2026-05-19
---

## Summary
Update the hardcoded or configured GitHub repository link to point to `https://github.com/awoerz` temporarily. This ensures local development and testing can proceed even before the project is fully uploaded or deployed to a remote source.## Acceptance Criteria
- The application successfully uses `http://127.0.0.1:1234` as the GitHub link when running in a local development environment.
- The change does not affect the production/live configuration path for the repository link.
- Verification confirms that the correct URL is used locally, and the system remains functional.

## Notes
This change should be temporary. Ensure documentation or code comments clearly mark this URL as a placeholder until the permanent deployment mechanism is in place.## Acceptance Criteria
- The application successfully uses `https://github.com/awoerz` as the GitHub link when running in a local development environment.
- The change does not affect the production/live configuration path for the repository link.
- Verification confirms that the correct URL is used locally, and the system remains functional.

## Activity Log
- 2026-05-19: Moved the task into `doing` and confirmed the GitHub card link was hardcoded in the renderer home page.
- 2026-05-19: Updated the home-page GitHub target so local development uses `https://github.com/awoerz` temporarily while production keeps the canonical repository README URL.
- 2026-05-19: Adjusted the card copy and current-state documentation so the temporary development-only behavior is explicit and easier to reverse later.
