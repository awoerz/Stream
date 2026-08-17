import type { WorkflowStatus } from "../../services/stream";

export function buildAutoAttachMessages(workflowState: WorkflowStatus) {
  return {
    generatedFilesSummary: workflowState.exists
      ? "Workflow folder found. Re-run initialization to safely add any missing starter files."
      : "Starter workflow files have not been generated yet.",
    feedbackMessage: workflowState.exists
      ? "Attached to the current workspace automatically."
      : "Current workspace loaded. Initialize 1-Stream when you're ready.",
    boardMessage: workflowState.exists
      ? "Task board ready to load the current workspace."
      : "Initialize the workflow first, then the task board can load its columns."
  };
}

export function buildSelectedProjectMessages(workflowState: WorkflowStatus) {
  return {
    generatedFilesSummary: workflowState.exists
      ? "Workflow folder found. Re-run initialization to safely add any missing starter files."
      : "Starter workflow files have not been generated yet.",
    feedbackMessage: workflowState.exists
      ? "Existing Stream workflow detected in the selected project."
      : "No 1-Stream folder found yet. Initialize it when you're ready.",
    boardMessage: workflowState.exists
      ? "Open the task board to load workflow items for this project."
      : "Initialize the workflow first, then the task board can load its columns."
  };
}
