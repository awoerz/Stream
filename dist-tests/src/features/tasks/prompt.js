"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTaskPrompt = buildTaskPrompt;
function buildTaskPrompt(sourceDescription, workItemIds, options) {
    const nextTaskId = workItemIds?.nextTaskId ?? "TASK-0000";
    const nextBugId = workItemIds?.nextBugId ?? "BUG-0000";
    const latestTaskId = workItemIds?.latestTaskId ?? "none yet";
    const latestBugId = workItemIds?.latestBugId ?? "none yet";
    const singleTaskOnly = options?.singleTaskOnly ?? false;
    return `You are generating markdown work-item files for a local workflow system.

Return raw markdown only.
Do not add commentary before or after the markdown.
Do not wrap the output in explanations.
Prefer not to use code fences.

Rules:
- ${singleTaskOnly
        ? "Return exactly one work-item file for this single summary."
        : "If the work is too large, break it into 2-5 smaller tasks instead of one oversized task."}
- Keep tasks clear, testable, and scoped to a single unit of work.
- Use practical, human-readable wording.
- Use \`${nextTaskId}\` as the next id for non-bug work items (\`task\`, \`chore\`, or \`research\`).
- Use \`${nextBugId}\` as the next id for bug work items.
- If multiple files are needed, increment sequentially from those starting ids.
- Do not include deprecated fields such as \`status\`, \`owner\`, \`assigned_to\`, \`agent\`, \`tags\`, \`related\`, \`Why\`, \`Context\`, or \`Activity Log\`.
- Match the simplified work-item template exactly.
- Output valid markdown task file content.

Latest existing ids:
- Latest task-like id: ${latestTaskId}
- Latest bug id: ${latestBugId}

Required structure:

\`\`\`md
---
id: ${nextTaskId}
title: Clear task title
type: task
priority: medium
rank: 1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

## Summary
Describe the work clearly and briefly.

## Acceptance Criteria
- Criterion 1
- Criterion 2
- Criterion 3

## Notes
Add implementation notes, reminders, or observations here.
\`\`\`

${singleTaskOnly
        ? "Do not return multiple files for this request."
        : `If multiple tasks are needed, return multiple complete markdown files separated by this divider:
\`\`\`
---TASK FILE---
\`\`\``}

Source task description:
"""
${sourceDescription.trim()}
"""

Now generate the markdown work-item file output.`;
}
