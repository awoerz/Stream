import styles from "./PromptGenerator.module.scss";

type PromptGeneratorProps = {
  lmStudioReady: boolean;
  isRunningLmStudio: boolean;
  promptSourceDescription: string;
  promptMessage: string;
  latestTaskId: string | null;
  latestBugId: string | null;
  nextTaskId: string;
  nextBugId: string;
  onPromptSourceChange: (value: string) => void;
  onCreateTask: () => void;
  onClose: () => void;
};

export function PromptGenerator({
  lmStudioReady,
  isRunningLmStudio,
  promptSourceDescription,
  promptMessage,
  latestTaskId,
  latestBugId,
  nextTaskId,
  nextBugId,
  onPromptSourceChange,
  onCreateTask,
  onClose
}: PromptGeneratorProps) {
  return (
    <div className={styles.root}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Source description</span>
        <textarea
          className={styles.fieldInput}
          value={promptSourceDescription}
          onChange={(event) => onPromptSourceChange(event.target.value)}
          placeholder="Describe the task or workflow you want help turning into markdown."
          rows={8}
        />
      </label>

      <p className={styles.message}>
        Latest IDs: {latestTaskId ?? "none"} / {latestBugId ?? "none"}. Next IDs:{" "}
        {nextTaskId} / {nextBugId}.
      </p>

      <div className={styles.actions}>
        <button className={styles.secondaryButton} type="button" onClick={onClose}>
          Close
        </button>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={onCreateTask}
          disabled={!lmStudioReady || !promptSourceDescription.trim() || isRunningLmStudio}
        >
          {isRunningLmStudio ? "Creating task..." : "Create task"}
        </button>
      </div>

      <p className={styles.message}>{promptMessage}</p>
    </div>
  );
}
