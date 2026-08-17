# Stream — Current State

## Overview

Stream is a lightweight desktop application for collaborating with AI coding agents through structured, markdown-based workflow files stored directly in a project under `1-Stream/`.

The app attaches to an existing project and provides a UI for creating, viewing, and managing work items stored as markdown.

## Implemented Features

- The app initializes and uses `1-Stream/` as the active workflow root.
- The current repository has been migrated from `agent-workflow/` to `1-Stream/`.
- The app scaffolds `README.md`, `stream.md`, `project-plan.md`, `current-state.md`, `decisions.md`, task status folders, and `templates/work-item-template.md`.
- The scaffolded work-item template now uses a simplified structure with core metadata plus `Summary`, `Acceptance Criteria`, and `Notes`.
- The product branding has been updated from Agent Sidecar to Stream across the live app UI, Electron window metadata, package metadata, and active workflow documentation.
- The uploaded icon source image has been cropped into a tighter 1024x1024 master and now lives with generated desktop icon assets under `electron/assets/`.
- Electron now sets internal runtime identity metadata to `Stream`, uses a rounded version of the generated icon for desktop window surfaces, and sets the macOS dock icon from the same local asset set instead of the earlier square-canvas treatment.
- The Electron main process now installs an explicit native application menu instead of relying on Electron's default menu template.
- The task board reads work items from `1-Stream/tasks/backlog`, `doing`, `blocked`, and `done`.
- Task cards now focus on item identity and priority without showing owner metadata.
- The task board now uses narrower Trello-style fixed-width kanban columns and scrolls horizontally when the viewport is too narrow for all columns at once.
- The left navigation now behaves as a persistent app-level sidenav that stays on the left across the major app views while the main content scrolls independently.
- The sidenav no longer uses card chrome; it now reads as structural navigation with a simple divider instead of a rounded, elevated panel.
- The renderer now uses colocated SCSS modules for the app shell, pages, modal, task UI, and sidenav, with only theme tokens and reset rules left in `src/globals.scss`.
- Shared SCSS mixins now live in `src/styles/_mixins.scss`, so repeated button, card, and field patterns can be reused without putting component selectors back into a global stylesheet.
- The sidenav uses a standard menu toggle pattern, can collapse into a compact rail on larger screens, and auto-collapses below `768px` before re-expanding when the viewport returns to desktop width.
- On smaller screens, the collapsible sidenav content now slides in and out horizontally instead of only snapping open and closed, and reduced-motion preferences disable those transitions.
- The sidebar navigation now uses link-style nav items with icon-plus-label rows, a full-row rectangular active highlight in the expanded state, and a tighter collapsed rail with the hidden-label spacing removed plus restored right-side gutter so the `S` and icon column align more cleanly.
- The task board can now watch the workflow task folders and auto-refresh when work-item files are added, removed, or moved.
- Backlog tasks can now be opened and edited from the UI, with changes written back to the underlying markdown files.
- The app now supports a persisted light/dark theme toggle, stored locally in the renderer and restored across restarts.
- Dark mode now uses theme-aware colors for navigation, modal controls, helper copy, badges, and preview text so core UI remains legible in both themes.
- The app now has a dedicated Project Plan page that reads `1-Stream/project-plan.md`, renders markdown in-app, and supports saving edits back to disk.
- The home view now contains only the existing Workspace header section and supporting copy; setup, navigation, and actions live elsewhere in the app.
- The home view now also includes a GitHub placeholder card that opens the canonical repository README in production and temporarily uses `https://github.com/awoerz` during local development, with the prompt text `Learn more and give us a star`.
- The board now offers a direct LM Studio task-creation flow: users open a modal, describe the work, and Stream saves the returned markdown directly into `backlog`.
- The board summary card and manual refresh button have been removed; the board now relies on the filesystem watcher plus normal app reload behavior instead of a dedicated in-board refresh control.
- The board now explains why LM Studio task creation is unavailable whenever the action is disabled.
- Clicking the disabled LM Studio action area now shows a dismissible warning banner for unmet prerequisites like invalid or unverified URLs, and that banner auto-hides after a short delay.
- The app now provides native right-click context menus for editable fields and task cards, including task view/edit/delete actions.
- Users can create tasks from the board modal and save them as markdown.
- The task-creation modal now supports pending image attachments, uploads those images immediately after a new task file is created, and preserves image aspect ratio in both create-time previews and task-detail display.
- Task cards open a detail modal that reads the saved markdown file.
- Task cards now show a paperclip indicator with attachment count when the underlying work item has saved images, and selecting that card still opens the existing task-detail attachment surface.
- Task detail now supports uploading multiple task images into `1-Stream/images`, storing image ids on the task, and previewing those images in the detail view.
- Task detail parsing now correctly handles simplified work items where `Notes` is the final section in the file.
- Task detail rendering now preserves multi-line notes and acceptance-criteria formatting instead of collapsing it visually.
- Markdown section parsing now uses a line-based parser so multi-line sections are read more reliably across restarts and simplified work-item files.
- The LM Studio task-creation modal loads the latest TASK and BUG ids, bakes the next available ids into the generated prompt, supports multiple returned task files separated by `---TASK FILE---`, and saves the results directly into `backlog`.
- The LM Studio task-creation flow now first asks the model to break larger requests into up to five one-sentence summaries, then generates and saves those backlog items sequentially so smaller local models can handle the work incrementally.
- LM Studio settings now live on the dedicated Settings page, hold the URL only in memory for the current app session, provide a connectivity test action, and require successful verification before LM Studio task creation is enabled.
- If users try to generate an LM Studio task before saving any LM Studio URL, Stream now first shows a short explanation modal and then sends them to Settings after they acknowledge it.
- Project attachment, workflow initialization, Git ignore mode, and LM Studio settings now live together on a dedicated Settings page instead of the home page or a modal.
- The Settings page now presents project selection, workflow setup, and LM Studio configuration as vertically stacked sections, which keeps spacing and readability consistent across desktop and smaller windows.
- Settings-page button groups now use explicit, consistent spacing so adjacent actions stay visually separated without changing button size or alignment.
- The settings navigation now uses a single settings entry with an embedded cog icon instead of duplicate settings affordances.
- Re-initializing with tracking enabled now removes the `1-Stream` ignore entry from `.gitignore` when present.
- The board now includes a generic `Copy Next Task Prompt` action that copies `Please read stream.md and work on the next task`, with a fallback for environments where the modern clipboard API is unavailable.

## Partially Implemented Features

- Work item types support `task`, `bug`, `chore`, and `research`, but ID assignment is still inconsistent: manual creation still uses `TASK-####` for every type while LM Studio-created bug markdown now saves as `BUG-####`.
- The saved task flow still writes fuller work-item markdown than the simplified template, so the template and generated task files are no longer identical.
- The app can migrate a legacy `agent-workflow/` folder during initialization, but it no longer treats that legacy folder as the live runtime root for the board.
- Context files are scaffolded and maintained on disk, but there is still no dedicated UI for viewing or editing them.
- The LM Studio save path is now more tolerant of incomplete model output and can synthesize minimal frontmatter from markdown-like responses, but highly malformed responses can still fail validation.
- The macOS app-icon work is only partially complete: the dock icon now uses the generated Stream artwork at runtime, but Launchpad-level icon verification still depends on a packaged macOS app bundle and a reliable `.icns` build step that the project does not yet have.
- The macOS app-name work is only partially complete: `app.setName("Stream")` now runs early and the app now defines a custom native application menu, but Electron's docs note that `app.setName()` does not change the name the OS uses, so `npm run dev` may still show `Electron` in the macOS menu bar until the app runs from a custom packaged bundle instead of the stock Electron host.

## Broken or Incomplete Areas

- Moving existing work items between statuses from the UI is not implemented.
- In `npm run dev`, macOS still shows `Electron` as the app name in the top-left menu bar, and the closing app can briefly fall back to Electron host identity while the dev runtime exits.

## Technical Debt or Architectural Concerns

- `electron/main.ts` still carries a lot of initialization, parsing, import, and task-loading logic in one file.
- Types are repeated across the main process, preload bridge, and renderer, which increases contract-drift risk.
- Markdown and frontmatter parsing is still regex-based and brittle for more flexible future formats.
- Verification still relies mostly on `npm run typecheck` and `npm run build`; there is only lightweight `npm test` coverage for a few helper modules, and broader automated UI or Electron integration coverage is still missing.
- The project still lacks a real packaging/distribution pipeline, which makes OS-level metadata and bundled app-icon verification much harder than ordinary renderer or main-process changes.
