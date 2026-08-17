# Decisions

## 2026-03-20 - Filesystem-First Workflow

- Status: Accepted
- Context:
  The product needs a durable, local-first source of truth for workflow data that humans and agents can both inspect directly.
- Decision:
  Stream will treat the local filesystem and markdown files as the source of truth for workflow data.
- Why:
  This keeps the product Git-friendly, portable, easy for AI agents to read, easy for humans to inspect and edit, and local-first by default.
- Consequences:
  The UI must read from and write to files, markdown structure should remain stable and human-readable, and any future indexing or database layer must remain secondary to the files.

## 2026-03-21 - Electron + Vite + React + TypeScript Desktop Shell

- Status: Accepted
- Context:
  The project needed an initial desktop shell that was practical for filesystem-heavy local workflows and easy for future contributors to understand.
- Decision:
  Use Electron for the desktop container, Vite for renderer tooling, and React with TypeScript for the UI layer.
- Why:
  Electron provides straightforward desktop windowing and filesystem integration, Vite keeps the frontend feedback loop lightweight, and React with TypeScript provides readable structure for future UI work.
- Consequences:
  The app stack is web-based inside a desktop shell, and future work can add renderer UI and main-process filesystem features without changing foundations.

## 2026-03-24 - LM Studio URL Is Session-Only

- Status: Accepted
- Context:
  The LM Studio URL can be user-specific and potentially sensitive, and recent prompts explicitly required that Stream not persist it after the app closes.
- Decision:
  Store the LM Studio URL and verification state in memory for the current app session only instead of persisting them in local storage or workflow files.
- Why:
  This keeps the integration aligned with the privacy expectation that local model connection details should not survive a full app restart unless the product later introduces an explicit secure settings model.
- Consequences:
  Users must re-enter and re-verify the LM Studio URL after restarting Stream, and any future persistence solution should be treated as a deliberate product/security decision rather than a convenience default.

## 2026-03-24 - Missing LM Studio Configuration Uses Guided Redirects

- Status: Accepted
- Context:
  The board previously left users confused when LM Studio task generation was unavailable, especially when no LM Studio URL had been configured yet.
- Decision:
  Use two different disabled-state behaviors:
  missing LM Studio URL shows an explanation modal and then redirects to Settings after acknowledgment;
  other unmet prerequisites such as invalid or unverified URLs continue to use inline board warnings.
- Why:
  Missing configuration requires a clear next step, while validation and verification issues are better handled in-place without forcing navigation for every disabled-state reason.
- Consequences:
  The disabled LM Studio action now has product-specific branching behavior, and future changes to LM Studio readiness rules should preserve that distinction unless the UX model is intentionally redesigned.

## 2026-03-24 - Replace Agent-Specific Next-Task UI With Generic Prompt Copy

- Status: Accepted
- Context:
  The earlier agent helper introduced agent-specific language and modal workflow that no longer matched the desired product direction.
- Decision:
  Remove the agent-helper flow from the live UI and replace it with a simple board action that copies the generic prompt `Please read stream.md and work on the next task`.
- Why:
  The generic prompt works across different LLMs and tools without implying deeper integration, setup, or agent-specific behavior that the app does not actually provide.
- Consequences:
  Stream no longer presents agent-specific execution affordances in the home or board UI, and any future richer agent integration should be reintroduced as a separate explicit feature rather than inferred from the old helper.

## 2026-03-24 - Small-Model LM Studio Generation Uses Planning Then Sequential Requests

- Status: Accepted
- Context:
  Small local models struggle with large multi-task prompts and can fail when asked to produce several complete work items in one pass.
- Decision:
  First ask LM Studio to break the source request into up to five one-sentence summaries, then generate and save each work item sequentially using the existing markdown generation flow.
- Why:
  Sequential smaller requests are more reliable for constrained local models and keep each generation closer to the existing save pipeline rather than introducing a separate multi-item protocol.
- Consequences:
  The feature now behaves like incremental generation rather than a single large request, progress messaging reflects that sequence, and any future true token-streaming support would build on top of this rather than replace the planning concept outright.

## 2026-03-24 - Task Images Live Under 1-Stream And Are Referenced By ID

- Status: Accepted
- Context:
  Task image uploads needed a filesystem-first storage model that stayed consistent with Stream's markdown-centric workflow.
- Decision:
  Store uploaded task images under `1-Stream/images`, generate image ids in the form `img-task-<taskId>-<sequence>`, and persist those ids on the task so detail views can resolve and display the corresponding files.
- Why:
  This keeps attachments inside the same local workflow root, avoids hidden external state, and preserves a simple naming scheme that humans and code can both reason about.
- Consequences:
  Task files now carry image references as ids rather than richer attachment objects, and future capabilities like captions, ordering, or deletion will need to extend that minimal attachment model carefully.

## 2026-03-31 - Use A Structural Persistent Sidenav With Auto-Collapse At 768px

- Status: Accepted
- Context:
  Recent navigation work needed to remove the card-like treatment from the left rail, keep navigation persistent across app views, and make the layout behave predictably on smaller screens.
- Decision:
  Treat the left rail as structural application navigation rather than a content card, keep it persistent in the shared app shell, use a standard menu-toggle pattern for collapse/expand, and automatically collapse it below `768px` while restoring the expanded state again at larger widths.
- Why:
  This keeps navigation visually distinct from content, matches the expected desktop-app sidenav pattern more closely, and gives smaller screens a usable default without forcing the user to manually reset the navigation state when resizing back to desktop widths.
- Consequences:
  The app shell now owns responsive sidenav state, the sidebar styling is intentionally flatter than the content cards, and future navigation changes should preserve the `768px` auto-collapse rule unless the layout model is deliberately revisited.

## 2026-03-31 - Small-Screen Sidenav Motion Uses Transform-Based Slide Animation

- Status: Accepted
- Context:
  The first responsive sidenav pass handled collapse state correctly, but the visual behavior on smaller screens still felt abrupt because the content mostly faded/collapsed rather than sliding like a menu drawer.
- Decision:
  Animate the collapsible sidenav body on small screens with horizontal `transform`-based motion plus opacity/height transitions, and disable those transitions when the user prefers reduced motion.
- Why:
  Transform-based motion gives the mobile-width menu a clearer slide-in/slide-out feel without changing the broader shell structure, and a reduced-motion fallback keeps the interaction accessible.
- Consequences:
  The mobile sidenav now feels more like a deliberate menu interaction, the animation logic is concentrated in CSS rather than extra renderer state, and future shell changes should preserve the reduced-motion behavior.

## 2026-03-31 - Collapsed Desktop Navigation Uses A Compact Icon Rail Instead Of Mini Pills

- Status: Accepted
- Context:
  The first collapsed desktop sidebar pass technically worked, but the visual result still looked like full navigation pills squeezed into a narrow rail, and the toggle control carried the same problem.
- Decision:
  Use a narrower collapsed shell width with icon-first rectangular targets and a flatter icon-button toggle instead of preserving the full pill-button treatment in collapsed mode.
- Why:
  A compact rail reads more like modern app navigation and avoids the awkward “shrunk desktop button” look that made the sidenav feel unfinished.
- Consequences:
  The collapsed desktop sidebar now has mode-specific styling rather than inheriting the expanded nav button treatment, and future sidebar updates should preserve that distinction between expanded and collapsed states.

## 2026-03-31 - Sidebar Navigation Uses Link-Like Rows Instead Of Button Chrome

- Status: Accepted
- Context:
  The sidebar still felt visually inconsistent because the navigation items were structured and styled like buttons even after several layout cleanups, which clashed with the intended modern sidenav pattern.
- Decision:
  Use link-style navigation rows with icon-plus-label alignment in the expanded state, then collapse those same rows down to icon-only rail items by animating the label out instead of swapping to a different button treatment.
- Why:
  This better matches common modern sidenav patterns, keeps the navigation visually calmer, and avoids the robotic “everything is a button in a box” feel.
- Consequences:
  The sidebar now has a clearer structural distinction between navigation and action controls, uses a lighter active-state indicator instead of a filled pill, and future navigation styling should preserve the link-like treatment rather than reintroducing boxed button chrome.

## 2026-03-31 - Sidebar Header Uses A Top-Right Toggle Above The Stream Wordmark

- Status: Accepted
- Context:
  The previous sidebar header still carried too much decorative structure and made the collapse feel jarring because the branding area disappeared as a block instead of compressing naturally with the rail.
- Decision:
  Use a simple header with the collapse toggle anchored at the top-right and the `Stream` wordmark on its own line beneath it, then collapse that wordmark down to just `S` when the desktop rail shrinks, with slightly slower shell and label transitions so the motion reads as a shrink rather than a pop.
- Why:
  This keeps the header visually lighter, matches the user’s preferred sidenav pattern more closely, and makes the collapse feel like the rail is shrinking rather than pieces popping in and out.
- Consequences:
  The sidebar header no longer contains the earlier marketing copy, and future branding changes in the sidenav should preserve the simple top-right-toggle plus wordmark structure unless the shell is deliberately redesigned again.

## 2026-03-31 - App Shell And Sidebar Styles Use CSS Modules

- Status: Accepted
- Context:
  Repeated sidebar visual fixes had become hard to reason about because shell and navigation rules were spread through the global stylesheet alongside unrelated page and component styles.
- Decision:
  Move the shared shell layout into `src/App.module.css` and the sidenav-specific styles into `src/components/Sidebar.module.css`, leaving the global stylesheet for shared tokens and non-sidebar component styling.
- Why:
  This makes sidebar spacing, icon sizing, collapse motion, and header alignment much easier to find and edit without accidentally changing unrelated UI.
- Consequences:
  Future sidebar work should happen in the module files instead of `src/styles.css`, and any new shell-specific selectors should stay colocated with the components they style.

## 2026-03-31 - Renderer Styling Uses Colocated SCSS Modules With Globals Limited To Tokens And Reset

- Status: Accepted
- Context:
  Even after the sidebar moved to CSS modules, the rest of the renderer still depended on a large shared stylesheet full of page, modal, form, board, and task-detail selectors that were hard to trace back to the components that owned them.
- Decision:
  Enable Sass in the renderer, move page and component styling into adjacent `.module.scss` files, keep only theme variables and reset rules in `src/globals.scss`, and use a small shared SCSS partial for mixins instead of global component classes.
- Why:
  This keeps styles discoverable next to the code they affect, makes local visual tuning much easier, and still allows repeated visual patterns like buttons and fields to share implementation details without returning to one monolithic stylesheet.
- Consequences:
  Future renderer styling should default to colocated SCSS modules, `src/globals.scss` should stay limited to app-wide tokens and reset behavior, and new shared styling abstractions should be mixins or utilities rather than reintroducing global selector-based component styling.

## 2026-04-02 - Desktop Branding Assets Live In `electron/assets` And Are Applied At Runtime

- Status: Accepted
- Context:
  The app needed to start using the uploaded Stream artwork as a real desktop icon and to present `Stream` as the runtime application name instead of relying only on window titles or workflow copy.
- Decision:
  Store the cropped icon master plus generated desktop icon sizes under `electron/assets/`, set the Electron app name from the main process, and use those generated assets for runtime window and macOS dock identity.
- Why:
  Keeping the branding assets inside the app codebase makes them easy to inspect and update, and applying the identity in the Electron main process ensures the running app uses the same name/icon source everywhere the current un-packaged workflow can influence directly.
- Consequences:
  Stream now has a concrete desktop icon asset set checked into the repo, but full Launchpad or bundled-app icon verification still depends on adding a real packaging pipeline and a reliable `.icns` generation step later.

## 2026-04-02 - macOS Menu-Bar App Name Cannot Be Finished In `npm run dev` Alone

- Status: Accepted
- Context:
  The project wanted the macOS top-left application name to read `Stream` during local development, but the current workflow launches the stock Electron host executable via `npm run dev`.
- Decision:
  Treat the macOS menu-bar app-name change as blocked on running from a custom packaged macOS app bundle or equivalent launcher, rather than marking it complete based only on `app.setName("Stream")`.
- Why:
  Electron's `app.setName()` API only changes the name used internally by Electron and does not change the OS-level application name, while Electron's macOS application-menu docs state that the first menu label always uses the application's OS name.
- Consequences:
  The project should not claim the top-left macOS app name is fixed in the current dev runtime, and any future attempt to finish that work needs packaging/bundle changes rather than more renderer or ordinary main-process tweaks.

## 2026-04-02 - Stream Uses An Explicit Native Application Menu Instead Of Electron's Default Template

- Status: Accepted
- Context:
  The app was still relying on Electron's default application menu, which made it harder to test whether menu structure itself had any effect on the macOS app-menu experience.
- Decision:
  Install an explicit application menu from the main process with Stream-branded app, Edit, View, and Window menus instead of leaving the default Electron template in place.
- Why:
  This gives Stream predictable menu structure, avoids relying on Electron's generic defaults, and lets the project test menu-level macOS behavior separately from packaging-level app identity.
- Consequences:
  Stream now controls its own native menu contents, but menu customization alone should not be treated as proof that the macOS top-left app name is solved in the un-packaged dev runtime.

## 2026-04-08 - New Task Image Attachments Use A Two-Step Create-Then-Upload Flow

- Status: Accepted
- Context:
  Stream already supported image uploads for existing task-detail views, but the new-task flow still needed a way to attach images during creation without inventing task ids on the renderer before the markdown file existed.
- Decision:
  Let the create modal collect pending images locally, save the new task markdown first, then upload the selected images against the newly created task file immediately afterward.
- Why:
  This preserves the existing filesystem-first image model, keeps task image ids derived from real saved task ids, and avoids introducing a speculative pre-save attachment store.
- Consequences:
  New-task image attachments now depend on a successful task save before upload begins, and partial failures can result in a created task whose image upload needs to be retried later from task detail.
