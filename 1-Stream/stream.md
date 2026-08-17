# Stream Agent Instructions

## Read First

Before making changes, read:
- `project-plan.md`
- `current-state.md`
- `decisions.md`

## Task Selection

Choose work in this order:
1. Continue an already-started item in `tasks/doing/` if one is clearly the active next step.
2. Otherwise choose from `tasks/backlog/`.
3. Prefer lower `rank` values first when they exist.
4. If rank is tied or missing, prefer higher `priority`.
5. If still tied, prefer the earliest actionable work item.

## Execution Rules

- Move the selected work item to `doing` when meaningful implementation begins.
- Keep changes aligned to the task summary and acceptance criteria.
- Do not widen scope silently.
- Preserve human changes unless explicitly asked to replace them.

## Documentation Updates

After implementation changes:
- update the work item notes or activity log
- update `current-state.md` so it reflects reality
- update `decisions.md` when a meaningful project or architecture decision is made

## Completion

When the work is complete:
- verify the result as far as practical
- update the work item activity log
- move the work item to `tasks/done/`

## Reporting Back

When reporting back, summarize:
- what changed
- what was verified
- any known limitations or follow-up risks
