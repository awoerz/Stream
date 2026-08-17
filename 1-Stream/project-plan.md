# Epic: Stream

## Vision

Create a lightweight desktop application that helps developers collaborate with AI coding agents through structured, markdown-based workflow files stored directly in a project repository.

Stream acts as a workflow companion that attaches to an existing project, providing a shared layer of structured work that both humans and agents can understand.

## Problem

Current AI-assisted development often relies on:
- ad-hoc prompting
- chat history
- manual use of `git diff`
- human memory of project intent

This works for short bursts, but it breaks down when:
- work spans multiple sessions
- context is lost
- project intent is not documented
- a human wants to continue work without re-prompting from scratch

## Solution

Stream provides a local-first desktop UI that:
- opens against an existing project folder
- initializes a `1-Stream` structure inside that folder
- allows users to create and manage project context and work-item files
- writes markdown files that are readable by both humans and AI agents
- optionally integrates with `.gitignore` to control whether workflow files are tracked

## Core Principles

- Local-first
- Git-friendly
- Human-readable
- Agent-compatible
- Calm and minimal UI
- Non-invasive to existing projects

## MVP Features

### Project Attachment
- Select an existing project folder
- Detect whether `1-Stream/` exists
- Initialize `1-Stream/` if missing

### Workflow Initialization
- Generate base folder structure
- Generate `README.md`
- Generate `stream.md`
- Generate `project-plan.md`
- Generate `current-state.md`
- Generate `decisions.md`
- Generate work item templates
- Optionally update `.gitignore` to ignore `1-Stream/`

### Task Management
- Create tasks from a simple form
- Edit tasks
- View tasks by status
- Store tasks in status-based folders

### Context Viewing
- View project plan
- View current state
- View agent instructions
- View decisions

## Non-Goals

- No Git repository initialization
- No Git UI
- No built-in AI chat
- No cloud sync
- No multi-user collaboration
- No database as source of truth

## Success Criteria

- A developer can attach Stream to any project in under a minute
- A developer can create meaningful tasks without editing markdown directly
- An AI agent can understand and act on tasks without additional prompting
- The system reduces cognitive load instead of adding process overhead
