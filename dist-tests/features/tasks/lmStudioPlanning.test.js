"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const lmStudioPlanning_1 = require("./lmStudioPlanning");
const prompt_1 = require("./prompt");
(0, node_test_1.default)("parseTaskSummaryResponse reads JSON arrays", () => {
    const summaries = (0, lmStudioPlanning_1.parseTaskSummaryResponse)(JSON.stringify([
        "Create the settings redirect modal for missing LM Studio URLs.",
        "Add board messaging for sequential LM Studio generation progress."
    ]));
    strict_1.default.deepEqual(summaries, [
        "Create the settings redirect modal for missing LM Studio URLs.",
        "Add board messaging for sequential LM Studio generation progress."
    ]);
});
(0, node_test_1.default)("parseTaskSummaryResponse handles fenced JSON and deduplicates items", () => {
    const summaries = (0, lmStudioPlanning_1.parseTaskSummaryResponse)(`\`\`\`json
[
  "Create a task breakdown prompt for small models.",
  "Create a task breakdown prompt for small models.",
  "Generate each task sequentially through the existing markdown template."
]
\`\`\``);
    strict_1.default.deepEqual(summaries, [
        "Create a task breakdown prompt for small models.",
        "Generate each task sequentially through the existing markdown template."
    ]);
});
(0, node_test_1.default)("createSequentialTaskPlan falls back to the original request when parsing fails", () => {
    const sourceDescription = "Build the LM Studio task flow for a tiny local model.";
    const summaries = (0, lmStudioPlanning_1.createSequentialTaskPlan)(sourceDescription, "");
    strict_1.default.deepEqual(summaries, [sourceDescription]);
});
(0, node_test_1.default)("buildTaskBreakdownPrompt asks for JSON-only one-sentence summaries", () => {
    const prompt = (0, lmStudioPlanning_1.buildTaskBreakdownPrompt)("Break a feature request into smaller tasks.");
    strict_1.default.match(prompt, /Return JSON only\./);
    strict_1.default.match(prompt, /single-sentence task summar/i);
});
(0, node_test_1.default)("buildTaskPrompt can force a single generated file", () => {
    const prompt = (0, prompt_1.buildTaskPrompt)("Add a sequential small-model generation step.", null, { singleTaskOnly: true });
    strict_1.default.match(prompt, /Return exactly one work-item file/i);
    strict_1.default.match(prompt, /Do not return multiple files/i);
    strict_1.default.doesNotMatch(prompt, /---TASK FILE---/);
});
