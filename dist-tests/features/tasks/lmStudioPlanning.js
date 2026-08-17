"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTaskBreakdownPrompt = buildTaskBreakdownPrompt;
exports.parseTaskSummaryResponse = parseTaskSummaryResponse;
exports.createSequentialTaskPlan = createSequentialTaskPlan;
function buildTaskBreakdownPrompt(sourceDescription) {
    return `You are helping a local workflow app prepare small, sequential work-item generation requests for a limited local model.

Analyze the user's request and decide whether it describes one task or multiple distinct tasks.

Return JSON only.
Do not add markdown fences.
Do not add commentary.

Output rules:
- Return a JSON array of 1 to 5 strings.
- Each string must be a single-sentence task summary.
- Keep each summary concrete, implementation-oriented, and short enough for a small model.
- If the request is really just one task, return an array with one summary.
- Do not number the summaries.
- Do not include surrounding explanation text.

User request:
"""
${sourceDescription.trim()}
"""`;
}
function sanitizePlanningResponse(response) {
    const normalized = response.replace(/\r\n/g, "\n").trim();
    const fencedBlockMatch = normalized.match(/```(?:json|txt|text)?\n([\s\S]*?)\n```/i);
    if (fencedBlockMatch) {
        return fencedBlockMatch[1].trim();
    }
    return normalized
        .replace(/^```(?:json|txt|text)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
}
function normalizeSummary(summary) {
    return summary
        .replace(/^[-*]\s+/, "")
        .replace(/^\d+[.)]\s+/, "")
        .replace(/\s+/g, " ")
        .trim();
}
function parseTaskSummaryResponse(response) {
    const sanitized = sanitizePlanningResponse(response);
    if (!sanitized) {
        return [];
    }
    try {
        const parsed = JSON.parse(sanitized);
        const values = Array.isArray(parsed)
            ? parsed
            : parsed && typeof parsed === "object" && "tasks" in parsed && Array.isArray(parsed.tasks)
                ? parsed.tasks
                : parsed && typeof parsed === "object" && "summaries" in parsed && Array.isArray(parsed.summaries)
                    ? parsed.summaries
                    : [];
        const normalizedValues = values
            .filter((value) => typeof value === "string")
            .map(normalizeSummary)
            .filter(Boolean);
        return Array.from(new Set(normalizedValues)).slice(0, 5);
    }
    catch {
        const fallbackValues = sanitized
            .split("\n")
            .map(normalizeSummary)
            .filter(Boolean);
        return Array.from(new Set(fallbackValues)).slice(0, 5);
    }
}
function createSequentialTaskPlan(sourceDescription, planningResponse) {
    const summaries = parseTaskSummaryResponse(planningResponse);
    if (summaries.length > 0) {
        return summaries;
    }
    const trimmedSource = sourceDescription.trim();
    return trimmedSource ? [trimmedSource] : [];
}
