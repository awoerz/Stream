import type { WorkflowInitializationResult } from "../../services/stream";

export function buildInitializationMessages(result: WorkflowInitializationResult) {
  const createdFiles = result.files
    .filter((file) => file.status === "created")
    .map((file) => file.relativePath);
  const skippedFiles = result.files
    .filter((file) => file.status === "skipped")
    .map((file) => file.relativePath);

  const generatedFilesSummary =
    createdFiles.length > 0
      ? `Created: ${createdFiles.join(", ")}${skippedFiles.length > 0 ? `. Kept existing: ${skippedFiles.join(", ")}.` : "."}`
      : `All starter files already existed and were left untouched: ${skippedFiles.join(", ")}.`;

  const gitignoreSummary = result.gitignore
    ? result.gitignore.status === "created"
      ? `.gitignore was created and now ignores 1-Stream/ at ${result.gitignore.path}.`
      : result.gitignore.status === "updated"
        ? `1-Stream/ was added to the existing .gitignore at ${result.gitignore.path}.`
        : result.gitignore.status === "removed"
          ? `1-Stream/ was removed from ${result.gitignore.path}, so workflow files are tracked again.`
        : `1-Stream/ was already present in ${result.gitignore.path}, so no .gitignore changes were needed.`
    : "Workflow files remain tracked because the Git option was left on track.";

  const boardMessage =
    "Workflow is ready. Open the task board to review the current backlog and progress.";

  const feedbackMessage = result.existedBefore
    ? "An existing Stream workspace was found, so initialization safely confirmed folders and preserved existing starter files."
    : "1-Stream, its required folders, and starter workflow files were created successfully.";

  return {
    boardMessage,
    feedbackMessage,
    generatedFilesSummary,
    gitignoreSummary
  };
}
