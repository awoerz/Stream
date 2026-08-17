import { marked } from "marked";
import styles from "./ProjectPlanPage.module.scss";

type ProjectPlanPageProps = {
  selectedFolder: string | null;
  workflowExists: boolean;
  projectPlanContents: string;
  projectPlanMessage: string;
  isEditingProjectPlan: boolean;
  editedProjectPlanContents: string;
  isSavingProjectPlan: boolean;
  onToggleEditMode: () => void;
  onEditedProjectPlanChange: (value: string) => void;
  onSaveProjectPlan: () => void;
};

marked.setOptions({
  breaks: true,
  gfm: true
});

export function ProjectPlanPage({
  selectedFolder,
  workflowExists,
  projectPlanContents,
  projectPlanMessage,
  isEditingProjectPlan,
  editedProjectPlanContents,
  isSavingProjectPlan,
  onToggleEditMode,
  onEditedProjectPlanChange,
  onSaveProjectPlan
}: ProjectPlanPageProps) {
  const renderedMarkdown = marked.parse(projectPlanContents) as string;

  return (
    <section className={styles.pageShell}>
      <div className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>Project Plan</p>
          <h2 className={styles.title}>Read and update `1-Stream/project-plan.md`</h2>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onToggleEditMode}
            disabled={!selectedFolder || !workflowExists}
          >
            {isEditingProjectPlan ? "View markdown" : "Edit markdown"}
          </button>
          {isEditingProjectPlan ? (
            <button
              className={styles.primaryButton}
              type="button"
              onClick={onSaveProjectPlan}
              disabled={!selectedFolder || !workflowExists || isSavingProjectPlan}
            >
              {isSavingProjectPlan ? "Saving..." : "Save project plan"}
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.summaryCard}>
        <p className={styles.summaryCopy}>{projectPlanMessage}</p>
      </div>

      <section className={styles.planCard}>
        {isEditingProjectPlan ? (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Markdown editor</span>
            <textarea
              className={`${styles.fieldInput} ${styles.editor}`}
              value={editedProjectPlanContents}
              onChange={(event) => onEditedProjectPlanChange(event.target.value)}
              spellCheck={false}
            />
          </label>
        ) : (
          <article
            className={styles.markdownView}
            dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
          />
        )}
      </section>
    </section>
  );
}
