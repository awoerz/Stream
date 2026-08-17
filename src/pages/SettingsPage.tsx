import type { GitignoreMode, WorkflowState } from "../features/workflow/types";
import styles from "./SettingsPage.module.scss";

type SettingsPageProps = {
  selectedFolder: string | null;
  isPickingFolder: boolean;
  isInitializingWorkflow: boolean;
  hasSelectedFolder: boolean;
  workflowExists: boolean;
  workflowState: WorkflowState;
  generatedFilesSummary: string;
  gitignoreMode: GitignoreMode;
  gitignoreSummary: string;
  lmStudioUrlDraft: string;
  lmStudioMessage: string;
  lmStudioUrlError: string;
  lmStudioVerifiedModel: string;
  isTestingLmStudioUrl: boolean;
  onSelectFolder: () => void;
  onInitializeWorkflow: () => void;
  onGitignoreModeChange: (mode: GitignoreMode) => void;
  onLmStudioUrlChange: (value: string) => void;
  onClearLmStudioUrl: () => void;
  onSaveLmStudioUrl: () => void;
  onTestLmStudioUrl: () => void;
};

export function SettingsPage({
  selectedFolder,
  isPickingFolder,
  isInitializingWorkflow,
  hasSelectedFolder,
  workflowExists,
  workflowState,
  generatedFilesSummary,
  gitignoreMode,
  gitignoreSummary,
  lmStudioUrlDraft,
  lmStudioMessage,
  lmStudioUrlError,
  lmStudioVerifiedModel,
  isTestingLmStudioUrl,
  onSelectFolder,
  onInitializeWorkflow,
  onGitignoreModeChange,
  onLmStudioUrlChange,
  onClearLmStudioUrl,
  onSaveLmStudioUrl,
  onTestLmStudioUrl
}: SettingsPageProps) {
  const trackCardClassName = `${styles.choiceCard} ${
    gitignoreMode === "track" ? styles.choiceCardSelected : ""
  }`.trim();
  const ignoreCardClassName = `${styles.choiceCard} ${
    gitignoreMode === "ignore" ? styles.choiceCardSelected : ""
  }`.trim();
  const lmStudioInputClassName = `${styles.fieldInput} ${
    lmStudioUrlError ? styles.invalid : ""
  }`.trim();

  return (
    <section className={styles.pageShell}>
      <div className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>Settings</p>
          <h2 className={styles.title}>Manage project and LM Studio configuration</h2>
        </div>
      </div>

      <section className={styles.sections}>
        <div className={styles.card}>
          <p className={styles.sectionLabel}>Project</p>
          <h3 className={styles.cardTitle}>Project Selection</h3>
          <p className={styles.copy}>Choose the active project folder Stream should work against.</p>

          <div className={styles.buttonRow}>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={onSelectFolder}
              disabled={isPickingFolder}
            >
              {isPickingFolder ? "Choosing folder..." : "Choose project folder"}
            </button>
          </div>

          <div className={styles.pathPanel} aria-live="polite">
            <p className={styles.pathLabel}>Current project</p>
            <p className={styles.pathValue}>{selectedFolder ?? "No folder selected yet"}</p>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionLabel}>Workflow</p>
          <h3 className={styles.cardTitle}>Initialization</h3>
          <p className={styles.copy}>
            Set how `1-Stream` should behave in Git, then initialize or re-run setup.
          </p>

          <div className={styles.buttonRow}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onInitializeWorkflow}
              disabled={!hasSelectedFolder || isInitializingWorkflow}
            >
              {isInitializingWorkflow
                ? "Initializing..."
                : workflowExists
                  ? "Re-run initialization"
                  : "Initialize workflow"}
            </button>
          </div>

          <div
            className={styles.gitignoreChoice}
            role="radiogroup"
            aria-label="Workflow Git behavior"
          >
            <label className={trackCardClassName}>
              <input
                type="radio"
                name="gitignore-mode"
                value="track"
                checked={gitignoreMode === "track"}
                onChange={() => onGitignoreModeChange("track")}
              />
              <span className={styles.choiceTitle}>Track 1-Stream in Git</span>
              <span className={styles.choiceCopy}>
                Keep workflow files visible to version control and remove any existing
                `1-Stream` ignore entry from `.gitignore`.
              </span>
            </label>

            <label className={ignoreCardClassName}>
              <input
                type="radio"
                name="gitignore-mode"
                value="ignore"
                checked={gitignoreMode === "ignore"}
                onChange={() => onGitignoreModeChange("ignore")}
              />
              <span className={styles.choiceTitle}>Ignore 1-Stream via .gitignore</span>
              <span className={styles.choiceCopy}>
                Create or update `.gitignore` so `1-Stream/` stays out of commits.
              </span>
            </label>
          </div>

          <div className={`${styles.pathPanel} ${styles.subtlePanel}`} aria-live="polite">
            <p className={styles.pathLabel}>Workflow status</p>
            <p className={styles.pathValue}>
              {!hasSelectedFolder
                ? "Select a project to check for an existing 1-Stream folder."
                : workflowExists
                  ? `Ready at ${workflowState?.workflowRoot}`
                : "1-Stream has not been created in this project yet."}
            </p>
          </div>

          <p className={styles.summaryCopy}>{generatedFilesSummary}</p>
          <p className={styles.summaryCopy}>{gitignoreSummary}</p>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionLabel}>LM Studio</p>
          <h3 className={styles.cardTitle}>Connection</h3>
          <p className={styles.copy}>
            Save the LM Studio URL for the current app session only. Nothing is written
            into the repository, workflow files, or persisted local app storage.
          </p>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Server URL</span>
            <input
              className={lmStudioInputClassName}
              type="url"
              value={lmStudioUrlDraft}
              onChange={(event) => onLmStudioUrlChange(event.target.value)}
              placeholder="http://127.0.0.1:1234"
              spellCheck={false}
            />
            {lmStudioUrlError ? (
              <span className={styles.fieldError}>{lmStudioUrlError}</span>
            ) : (
              <span className={styles.fieldHint}>
                Held in memory for this session only. It will be cleared when Stream closes.
              </span>
            )}
          </label>

          <p className={styles.summaryCopy}>{lmStudioMessage}</p>
          {lmStudioVerifiedModel ? (
            <p className={styles.summaryCopy}>Verified model: {lmStudioVerifiedModel}</p>
          ) : null}

          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton} type="button" onClick={onSaveLmStudioUrl}>
              Save
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onTestLmStudioUrl}
              disabled={isTestingLmStudioUrl}
            >
              {isTestingLmStudioUrl ? "Testing..." : "Test URL"}
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onClearLmStudioUrl}
              disabled={!lmStudioUrlDraft}
            >
              Clear
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
