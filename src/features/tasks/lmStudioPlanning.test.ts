import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTaskBreakdownPrompt,
  createSequentialTaskPlan,
  parseTaskSummaryResponse
} from "./lmStudioPlanning";
import { buildTaskPrompt } from "./prompt";

test("parseTaskSummaryResponse reads JSON arrays", () => {
  const summaries = parseTaskSummaryResponse(
    JSON.stringify([
      "Create the settings redirect modal for missing LM Studio URLs.",
      "Add board messaging for sequential LM Studio generation progress."
    ])
  );

  assert.deepEqual(summaries, [
    "Create the settings redirect modal for missing LM Studio URLs.",
    "Add board messaging for sequential LM Studio generation progress."
  ]);
});

test("parseTaskSummaryResponse handles fenced JSON and deduplicates items", () => {
  const summaries = parseTaskSummaryResponse(`\`\`\`json
[
  "Create a task breakdown prompt for small models.",
  "Create a task breakdown prompt for small models.",
  "Generate each task sequentially through the existing markdown template."
]
\`\`\``);

  assert.deepEqual(summaries, [
    "Create a task breakdown prompt for small models.",
    "Generate each task sequentially through the existing markdown template."
  ]);
});

test("createSequentialTaskPlan falls back to the original request when parsing fails", () => {
  const sourceDescription = "Build the LM Studio task flow for a tiny local model.";
  const summaries = createSequentialTaskPlan(sourceDescription, "");

  assert.deepEqual(summaries, [sourceDescription]);
});

test("buildTaskBreakdownPrompt asks for JSON-only one-sentence summaries", () => {
  const prompt = buildTaskBreakdownPrompt("Break a feature request into smaller tasks.");

  assert.match(prompt, /Return JSON only\./);
  assert.match(prompt, /single-sentence task summar/i);
});

test("buildTaskPrompt can force a single generated file", () => {
  const prompt = buildTaskPrompt(
    "Add a sequential small-model generation step.",
    null,
    { singleTaskOnly: true }
  );

  assert.match(prompt, /Return exactly one work-item file/i);
  assert.match(prompt, /Do not return multiple files/i);
  assert.doesNotMatch(prompt, /---TASK FILE---/);
});
