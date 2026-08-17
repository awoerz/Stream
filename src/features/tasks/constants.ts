export const taskTypeOptions = ["task", "bug", "chore", "research"] as const;
export const taskStatusOptions = ["backlog", "doing", "blocked", "done"] as const;
export const taskPriorityOptions = ["low", "medium", "high"] as const;
export const boardStatuses = ["backlog", "doing", "blocked", "done"] as const;

export function formatStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
