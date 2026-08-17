# Stream Guide

This repository now uses `1-Stream/` as its workflow root.

The folder is the shared, filesystem-first coordination layer for humans and AI coding agents working on Stream.

## Key Files

- `stream.md`
  Agent execution instructions.

- `project-plan.md`
  The living project plan for the app.

- `current-state.md`
  A concrete snapshot of what is implemented, partial, broken, or still uncertain.

- `decisions.md`
  A running record of meaningful product and technical decisions.

- `tasks/`
  Work items grouped by status.

- `templates/work-item-template.md`
  The reusable template for new work items.

## Folder Structure

- `tasks/backlog/`
  Not started yet.

- `tasks/doing/`
  In progress.

- `tasks/blocked/`
  Waiting on something.

- `tasks/done/`
  Completed history.

## Working In This Repo

Humans usually maintain:
- `project-plan.md`
- `current-state.md`
- `decisions.md`
- task files under `tasks/`

Agents should follow `stream.md`.

## Project Conventions

### Product Direction

Stream is a focused desktop utility for managing markdown-based workflow files used by humans and AI agents.

It is not a general project management suite.

### UX Direction

The UI should feel:
- calm
- simple
- clean
- readable
- minimal without feeling empty

Avoid making the product feel like Jira or a heavy enterprise tool.

### Visual Direction

Preferred visual tone:
- soft, grounded, calming
- likely green/beige inspired accents
- spacious cards
- clear typography
- strong readability

### Technical Direction

The application should be:
- local-first
- filesystem-first
- markdown as source of truth
- simple to run and understand

### Development Expectations

- Prefer clear folder structure over clever abstractions
- Keep components understandable without AI assistance
- Avoid over-engineering v1
- Favor practical implementation over excessive scaffolding
