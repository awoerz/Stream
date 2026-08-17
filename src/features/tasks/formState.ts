import type { TaskFormData, TaskFormErrors, TaskFormMode } from "./types";

export const initialTaskForm: TaskFormData = {
  title: "",
  type: "task",
  status: "backlog",
  priority: "medium",
  rank: "",
  owner: "",
  agent: "",
  tags: "",
  summary: "",
  why: "",
  acceptanceCriteria: "",
  context: "",
  notes: ""
};

export function validateTaskForm(data: TaskFormData, mode: TaskFormMode = "create") {
  const errors: TaskFormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Add a task title.";
  }
  if (mode === "create" && !data.owner.trim()) {
    errors.owner = "Add an owner.";
  }
  if (mode === "create" && !data.agent.trim()) {
    errors.agent = "Add an agent.";
  }
  if (!data.summary.trim()) {
    errors.summary = "Add a short summary.";
  }
  if (mode === "create" && !data.why.trim()) {
    errors.why = "Explain why this task matters.";
  }
  if (!data.acceptanceCriteria.trim()) {
    errors.acceptanceCriteria = "List at least one acceptance criterion.";
  }

  return errors;
}
