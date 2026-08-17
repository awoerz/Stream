import type { ChangeEvent, FormEvent } from "react";

import {
  taskPriorityOptions,
  taskStatusOptions,
  taskTypeOptions
} from "./constants";
import styles from "./TaskForm.module.scss";
import type {
  PendingTaskImage,
  TaskFormData,
  TaskFormErrors,
  TaskFormMode
} from "./types";

type TaskFormProps = {
  mode: TaskFormMode;
  taskForm: TaskFormData;
  taskErrors: TaskFormErrors;
  taskFormMessage: string;
  isSavingTask: boolean;
  workflowExists: boolean;
  hasSelectedFolder: boolean;
  pendingTaskImages: PendingTaskImage[];
  onFieldChange: <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => void;
  onPendingImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePendingImage: (imageId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function TaskForm({
  mode,
  taskForm,
  taskErrors,
  taskFormMessage,
  isSavingTask,
  workflowExists,
  hasSelectedFolder,
  pendingTaskImages,
  onFieldChange,
  onPendingImagesChange,
  onRemovePendingImage,
  onSubmit,
  onCancel
}: TaskFormProps) {
  const isEditMode = mode === "edit";
  const titleInputClassName = `${styles.fieldInput} ${taskErrors.title ? styles.invalid : ""}`.trim();
  const ownerInputClassName = `${styles.fieldInput} ${taskErrors.owner ? styles.invalid : ""}`.trim();
  const agentInputClassName = `${styles.fieldInput} ${taskErrors.agent ? styles.invalid : ""}`.trim();
  const summaryInputClassName = `${styles.fieldInput} ${styles.textarea} ${
    taskErrors.summary ? styles.invalid : ""
  }`.trim();
  const whyInputClassName = `${styles.fieldInput} ${styles.textarea} ${
    taskErrors.why ? styles.invalid : ""
  }`.trim();
  const acceptanceInputClassName = `${styles.fieldInput} ${styles.textarea} ${
    taskErrors.acceptanceCriteria ? styles.invalid : ""
  }`.trim();
  const contextInputClassName = `${styles.fieldInput} ${styles.textarea}`.trim();
  const notesInputClassName = `${styles.fieldInput} ${styles.textarea}`.trim();

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Title</span>
          <input
            className={titleInputClassName}
            type="text"
            value={taskForm.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Create project attachment flow"
          />
          {taskErrors.title ? (
            <span className={styles.error}>{taskErrors.title}</span>
          ) : null}
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Type</span>
          <select
            className={styles.fieldInput}
            value={taskForm.type}
            onChange={(event) =>
              onFieldChange("type", event.target.value as TaskFormData["type"])
            }
          >
            {taskTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {!isEditMode ? (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Status</span>
            <select
              className={styles.fieldInput}
              value={taskForm.status}
              onChange={(event) =>
                onFieldChange("status", event.target.value as TaskFormData["status"])
              }
            >
              {taskStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Priority</span>
          <select
            className={styles.fieldInput}
            value={taskForm.priority}
            onChange={(event) =>
              onFieldChange(
                "priority",
                event.target.value as TaskFormData["priority"]
              )
            }
          >
            {taskPriorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Rank</span>
          <input
            className={styles.fieldInput}
            type="number"
            min="1"
            step="1"
            value={taskForm.rank}
            onChange={(event) => onFieldChange("rank", event.target.value)}
            placeholder="1"
          />
          <span className={styles.hint}>
            Optional manual order. Lower ranks appear first.
          </span>
        </label>

        {!isEditMode ? (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Owner</span>
            <input
              className={ownerInputClassName}
              type="text"
              value={taskForm.owner}
              onChange={(event) => onFieldChange("owner", event.target.value)}
              placeholder="adam"
            />
            {taskErrors.owner ? (
              <span className={styles.error}>{taskErrors.owner}</span>
            ) : null}
          </label>
        ) : null}

        {!isEditMode ? (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Agent</span>
            <input
              className={agentInputClassName}
              type="text"
              value={taskForm.agent}
              onChange={(event) => onFieldChange("agent", event.target.value)}
              placeholder="gary"
            />
            {taskErrors.agent ? (
              <span className={styles.error}>{taskErrors.agent}</span>
            ) : null}
          </label>
        ) : null}
      </div>

      {!isEditMode ? (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Tags</span>
          <input
            className={styles.fieldInput}
            type="text"
            value={taskForm.tags}
            onChange={(event) => onFieldChange("tags", event.target.value)}
            placeholder="ui, tasks, workflow"
          />
          <span className={styles.hint}>Use commas to separate tags.</span>
        </label>
      ) : null}

      {!isEditMode ? (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Images</span>
          <p className={styles.hint}>
            Attach PNG, JPEG, WEBP, or GIF files now. Stream will upload them
            immediately after the task is created.
          </p>
          <label className={styles.uploadButton}>
            <input
              className={styles.hiddenFileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={onPendingImagesChange}
            />
            <span>
              {pendingTaskImages.length > 0 ? "Add more images" : "Choose images"}
            </span>
          </label>

          {pendingTaskImages.length > 0 ? (
            <div className={styles.imageGrid}>
              {pendingTaskImages.map((image) => (
                <figure className={styles.imageCard} key={image.id}>
                  <img
                    className={styles.imagePreview}
                    src={image.previewUrl}
                    alt={image.file.name}
                  />
                  <figcaption className={styles.imageCaption}>
                    {image.file.name}
                  </figcaption>
                  <button
                    className={styles.imageAction}
                    type="button"
                    onClick={() => onRemovePendingImage(image.id)}
                  >
                    Remove image
                  </button>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Summary</span>
        <textarea
          className={summaryInputClassName}
          value={taskForm.summary}
          onChange={(event) => onFieldChange("summary", event.target.value)}
          placeholder="Describe the work clearly and briefly."
          rows={3}
        />
        {taskErrors.summary ? (
          <span className={styles.error}>{taskErrors.summary}</span>
        ) : null}
      </label>

      {!isEditMode ? (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Why</span>
          <textarea
            className={whyInputClassName}
            value={taskForm.why}
            onChange={(event) => onFieldChange("why", event.target.value)}
            placeholder="Explain why this task matters."
            rows={3}
          />
          {taskErrors.why ? (
            <span className={styles.error}>{taskErrors.why}</span>
          ) : null}
        </label>
      ) : null}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Acceptance criteria</span>
        <textarea
          className={acceptanceInputClassName}
          value={taskForm.acceptanceCriteria}
          onChange={(event) =>
            onFieldChange("acceptanceCriteria", event.target.value)
          }
          placeholder={
            "One criterion per line\nThe form validates required fields\nThe form can submit structured data"
          }
          rows={5}
        />
        {taskErrors.acceptanceCriteria ? (
          <span className={styles.error}>{taskErrors.acceptanceCriteria}</span>
        ) : null}
      </label>

      {!isEditMode ? (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Context</span>
          <textarea
            className={contextInputClassName}
            value={taskForm.context}
            onChange={(event) => onFieldChange("context", event.target.value)}
            placeholder="Add useful project or feature context here."
            rows={3}
          />
        </label>
      ) : null}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Notes</span>
        <textarea
          className={notesInputClassName}
          value={taskForm.notes}
          onChange={(event) => onFieldChange("notes", event.target.value)}
          placeholder="Add implementation notes, reminders, or observations."
          rows={3}
        />
      </label>

      <div className={styles.actions}>
        <button className={styles.secondaryButton} type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className={styles.primaryButton}
          type="submit"
          disabled={isSavingTask || !workflowExists || !hasSelectedFolder}
        >
          {isSavingTask
            ? isEditMode
              ? "Saving changes..."
              : "Saving task..."
            : isEditMode
              ? "Save changes"
              : "Save task markdown"}
        </button>
      </div>
      <p className={styles.message}>{taskFormMessage}</p>
    </form>
  );
}
