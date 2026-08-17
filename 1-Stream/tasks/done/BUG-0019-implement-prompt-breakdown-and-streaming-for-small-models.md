---
id: BUG-0019
title: Implement prompt breakdown and streaming for small models
type: bug
priority: medium
rank: 1
created: 2026-03-24
updated: 2026-03-24
---

## Summary
Add functionality to first send a user prompt to generate a task to the local LLM to parse the prompt into an array of one‑sentence task summaries when multiple tasks are detected. Stream each summary back to the LLM using the existing task/bug template so that small models can handle the workload incrementally and generate each task.

## Acceptance Criteria
- The system detects when a user prompt contains more than one distinct task and splits it into separate one‑sentence summaries.
- Each summary is streamed to the LLM sequentially, using the standard task/bug template format.
- The implementation works with 4B models and does not exceed their token limits per request.
- Unit tests cover prompt parsing, summary generation, and streaming logic.

## Notes

## Activity Log
- 2026-03-24: Added a planning step that asks LM Studio for one-sentence task summaries before full markdown generation, then processes each summary sequentially through the existing save flow.
- 2026-03-24: Added lightweight unit tests for the planning prompt, summary parsing, fallback planning behavior, and single-file generation prompt mode.
- 2026-03-24: Verified the change with `npm run test`, `npm run typecheck`, and `npm run build`.
