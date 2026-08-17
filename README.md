# Stream

> **Structure the work. Free the mind.**

Stream is a local-first workflow companion that helps developers collaborate with AI agents through structured, task-based workflows instead of fragile prompt context.

---

## Overview

Stream helps you and your AI agents build software one clear, structured step at a time—without the burden of managing massive context.

Instead of relying on:
- long chat histories
- repeated prompts
- remembering what was done last

Stream gives you:
- structured tasks
- persistent project context
- a shared language between you and your coding agent

All stored directly in your project as markdown.

---

## Why Stream Exists

AI-assisted development works well in short bursts.

But it breaks down when:
- work spans multiple sessions
- context is lost
- prompts become too large
- intent isn’t documented
- you have to re-explain everything repeatedly

Stream solves this by introducing:
- structure over chaos
- files over memory
- tasks over prompts

---

## Core Idea

Stream is not:
- a code generator  
- a replacement for your AI agent  
- a project scaffolding tool  

Stream is:
> **a workflow layer for human + AI collaboration**

It sits alongside your project and:
- organizes work into clear, structured tasks
- stores context in markdown files
- enables continuity across sessions
- reduces cognitive load

---

## Key Principles

### 1. One Task at a Time
Large systems are built from small, clear steps.

Stream encourages:
- focused work
- testable units
- better agent execution

---

### 2. File System as Source of Truth
No database. No hidden state.

Everything lives in your project:
- readable
- versionable
- portable

---

### 3. Human-Guided AI Development
AI is powerful—but it needs structure.

Stream ensures:
- humans define intent
- agents execute clearly scoped work
- both stay aligned

---

### 4. Structure Over Speed
The goal is not maximum speed.

The goal is:
- clarity
- continuity
- reduced mental overhead

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

---

### Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd stream
```

Install dependencies:

```bash
npm install
```

---

### Run the App

Start the development environment:

```bash
npm run dev
```

This will launch the Electron application locally.

---

## How It Works

Stream attaches to an existing project and creates a lightweight workflow structure inside it.

This includes:
- a `1-Stream/` folder
- task files stored as markdown (in `1-Stream/tasks/`)
- project context files (like `project-plan.md`, `current-state.md`, and `decisions.md`)

Tasks move through simple states:
- backlog → doing → blocked → done

Both you and your AI agent can:
- read tasks
- execute work
- update progress

Stream can also generate tasks automatically by connecting to a local LM Studio instance. Configure the LM Studio server URL in Settings, then describe the work in plain language and Stream will ask LM Studio to create the backlog item for you.

---

## Usage Instructions

> 🚧 **Coming Soon**
>
> The workflow and interaction model are still evolving.
> Detailed usage instructions will be added in a future update.

---

## Philosophy

Most tools try to help you manage complexity.

Stream does something different.

> **It removes the need to hold complexity in your head at all.**

---

### The Problem with Context

As projects grow:
- prompts get longer
- context gets heavier
- clarity disappears

Eventually:
- you lose track of what matters
- agents produce worse results
- progress slows down

---

### The Stream Approach

Instead of managing massive context, Stream:

- breaks work into small, structured tasks  
- stores intent in files instead of memory  
- allows agents to operate with precision  
- lets humans stay in control  

---

### What This Means

You don’t:
- juggle giant prompts
- re-explain your system
- rely on chat history

You do:
- define clear work
- execute step by step
- build confidently over time

---

## Vision

Stream is a foundation for a new way of building software:

> **Human-guided AI development, grounded in structure.**

Where:
- work is visible
- intent is preserved
- progress is continuous

---

## Current Status

Stream is actively under development.

Features and workflows are evolving quickly, and this document is subject to change.

Every action taken to build this application can be found in the 1-Stream directory under completed tasks.

---

## License

Copyright 2026 Adam Woerz. Licensed under the Apache License, Version 2.0. See LICENSE for details.