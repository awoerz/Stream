import type { ChangeEvent, FormEvent } from "react";

import { Modal } from "../components/Modal";
import { TaskCard } from "../components/TaskCard";
import { PromptGenerator } from "../features/tasks/PromptGenerator";
import { TaskDetailContent } from "../features/tasks/TaskDetailContent";
import { TaskForm } from "../features/tasks/TaskForm";
import { boardStatuses, formatStatusLabel } from "../features/tasks/constants";
import type {
  PendingTaskImage,
  SavedTaskDetails,
  TaskBoardCard,
  TaskBoardColumn,
  TaskDetail,
  TaskFormData,
  TaskFormErrors,
  TaskFormMode
} from "../features/tasks/types";
import styles from "./TaskBoardPage.module.scss";

type TaskBoardPageProps = {
  selectedFolder: string | null;
  workflowExists: boolean;
  boardColumns: TaskBoardColumn[];
  savedTaskDetails: SavedTaskDetails | null;
  onOpenTaskModal: () => void;
  onOpenPromptModal: () => void;
  onOpenTaskDetail: (task: TaskBoardCard) => void;
  onOpenTaskContextMenu: (
    task: TaskBoardCard,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  isTaskModalOpen: boolean;
  isPromptModalOpen: boolean;
  isTaskDetailOpen: boolean;
  onCloseTaskModal: () => void;
  onClosePromptModal: () => void;
  onCloseTaskDetailModal: () => void;
  taskForm: TaskFormData;
  taskErrors: TaskFormErrors;
  taskFormMode: TaskFormMode;
  taskFormMessage: string;
  isSavingTask: boolean;
  hasSelectedFolder: boolean;
  pendingTaskImages: PendingTaskImage[];
  onTaskFieldChange: <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => void;
  onPendingTaskImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePendingTaskImage: (imageId: string) => void;
  onTaskSubmit: (event: FormEvent<HTMLFormElement>) => void;
  promptSourceDescription: string;
  lmStudioReady: boolean;
  lmStudioDisabledReason: string;
  lmStudioDisabledWarning: string;
  nextTaskPromptMessage: string;
  isRunningLmStudio: boolean;
  promptMessage: string;
  latestTaskId: string | null;
  latestBugId: string | null;
  nextTaskId: string;
  nextBugId: string;
  onPromptSourceChange: (value: string) => void;
  onCreateLmStudioTask: () => void;
  onCopyNextTaskPrompt: () => void;
  onDisabledLmStudioAttempt: () => void;
  onDismissLmStudioWarning: () => void;
  selectedTaskDetail: TaskDetail | null;
  isLoadingTaskDetail: boolean;
  taskDetailMessage: string;
  canEditSelectedTask: boolean;
  isUploadingTaskImages: boolean;
  onEditSelectedTask: () => void;
  onUploadTaskImages: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function TaskBoardPage({
  selectedFolder,
  workflowExists,
  boardColumns,
  savedTaskDetails,
  onOpenTaskModal,
  onOpenPromptModal,
  onOpenTaskDetail,
  onOpenTaskContextMenu,
  isTaskModalOpen,
  isPromptModalOpen,
  isTaskDetailOpen,
  onCloseTaskModal,
  onClosePromptModal,
  onCloseTaskDetailModal,
  taskForm,
  taskErrors,
  taskFormMode,
  taskFormMessage,
  isSavingTask,
  hasSelectedFolder,
  pendingTaskImages,
  onTaskFieldChange,
  onPendingTaskImagesChange,
  onRemovePendingTaskImage,
  onTaskSubmit,
  promptSourceDescription,
  lmStudioReady,
  lmStudioDisabledReason,
  lmStudioDisabledWarning,
  nextTaskPromptMessage,
  isRunningLmStudio,
  promptMessage,
  latestTaskId,
  latestBugId,
  nextTaskId,
  nextBugId,
  onPromptSourceChange,
  onCreateLmStudioTask,
  onCopyNextTaskPrompt,
  onDisabledLmStudioAttempt,
  onDismissLmStudioWarning,
  selectedTaskDetail,
  isLoadingTaskDetail,
  taskDetailMessage,
  canEditSelectedTask,
  isUploadingTaskImages,
  onEditSelectedTask,
  onUploadTaskImages
}: TaskBoardPageProps) {
  return (
    <section className={styles.pageShell}>
      <div className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>Task Board</p>
          <h2 className={styles.title}>Review work by workflow status</h2>
          {!lmStudioReady && lmStudioDisabledReason ? (
            <p className={styles.supportingCopy} aria-live="polite">
              {lmStudioDisabledReason}
            </p>
          ) : null}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={onOpenTaskModal}
            disabled={!selectedFolder || !workflowExists}
          >
            Create task
          </button>
          <div className={styles.disabledActionShell}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onOpenPromptModal}
              disabled={!selectedFolder || !workflowExists || !lmStudioReady}
            >
              Generate LM Studio Task
            </button>
            {!lmStudioReady ? (
              <button
                className={styles.disabledActionHitbox}
                type="button"
                onClick={onDisabledLmStudioAttempt}
                aria-label="Explain why Generate LM Studio Task is unavailable"
                title={lmStudioDisabledReason}
              />
            ) : null}
          </div>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onCopyNextTaskPrompt}
          >
            Copy Next Task Prompt
          </button>
        </div>
      </div>

      {lmStudioDisabledWarning ? (
        <div
          className={`${styles.inlineAlert} ${styles.warningAlert}`}
          role="alert"
          aria-live="assertive"
        >
          <p className={styles.alertCopy}>{lmStudioDisabledWarning}</p>
          <button
            className={styles.compactButton}
            type="button"
            onClick={onDismissLmStudioWarning}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className={styles.utilityRow}>
        {nextTaskPromptMessage ? (
          <p className={styles.supportingCopy} aria-live="polite">
            {nextTaskPromptMessage}
          </p>
        ) : null}
        {savedTaskDetails ? (
          <p className={styles.supportingCopy}>
            Latest save: {savedTaskDetails.taskId} at {savedTaskDetails.filePath}
          </p>
        ) : null}
      </div>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {boardStatuses.map((status) => {
            const column =
              boardColumns.find((currentColumn) => currentColumn.status === status) ?? {
                status,
                tasks: []
              };

            return (
              <section className={styles.column} key={column.status}>
                <div className={styles.columnHeader}>
                  <div>
                    <p className={styles.columnTitle}>
                      {formatStatusLabel(column.status)}
                    </p>
                    <p className={styles.columnCount}>
                      {column.tasks.length} task{column.tasks.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className={styles.columnBody}>
                  {column.tasks.length > 0 ? (
                    column.tasks.map((task) => (
                      <TaskCard
                        key={task.filePath}
                        task={task}
                        onOpen={onOpenTaskDetail}
                        onContextMenu={onOpenTaskContextMenu}
                      />
                    ))
                  ) : (
                    <div className={styles.emptyCard}>
                      <p className={styles.emptyCopy}>No tasks in {column.status} yet.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {isTaskModalOpen ? (
        <Modal
          title={
            taskFormMode === "edit"
              ? "Edit a backlog task"
              : "Create a task from the board"
          }
          subtitle={taskFormMode === "edit" ? "Task Editing" : "Task Creation"}
          ariaLabel={taskFormMode === "edit" ? "Edit task" : "Create task"}
          onClose={onCloseTaskModal}
        >
          <TaskForm
            mode={taskFormMode}
            taskForm={taskForm}
            taskErrors={taskErrors}
            taskFormMessage={taskFormMessage}
            isSavingTask={isSavingTask}
            workflowExists={workflowExists}
            hasSelectedFolder={hasSelectedFolder}
            pendingTaskImages={pendingTaskImages}
            onFieldChange={onTaskFieldChange}
            onPendingImagesChange={onPendingTaskImagesChange}
            onRemovePendingImage={onRemovePendingTaskImage}
            onSubmit={onTaskSubmit}
            onCancel={onCloseTaskModal}
          />
        </Modal>
      ) : null}

      {isPromptModalOpen ? (
        <Modal
          title="Create a backlog item with LM Studio"
          subtitle="LM Studio Task Creation"
          ariaLabel="Generate LM Studio task"
          onClose={onClosePromptModal}
          variant="prompt"
        >
          <PromptGenerator
            lmStudioReady={lmStudioReady}
            isRunningLmStudio={isRunningLmStudio}
            promptSourceDescription={promptSourceDescription}
            promptMessage={promptMessage}
            latestTaskId={latestTaskId}
            latestBugId={latestBugId}
            nextTaskId={nextTaskId}
            nextBugId={nextBugId}
            onPromptSourceChange={onPromptSourceChange}
            onCreateTask={onCreateLmStudioTask}
            onClose={onClosePromptModal}
          />
        </Modal>
      ) : null}

      {isTaskDetailOpen ? (
        <Modal
          title={
            selectedTaskDetail?.title ||
            (isLoadingTaskDetail ? "Loading task..." : "Task detail")
          }
          subtitle="Task Detail"
          ariaLabel="Task detail"
          onClose={onCloseTaskDetailModal}
          variant="detail"
        >
          <TaskDetailContent
            selectedTaskDetail={selectedTaskDetail}
            isLoadingTaskDetail={isLoadingTaskDetail}
            taskDetailMessage={taskDetailMessage}
            canEdit={canEditSelectedTask}
            isUploadingImages={isUploadingTaskImages}
            onEdit={onEditSelectedTask}
            onUploadImages={onUploadTaskImages}
          />
        </Modal>
      ) : null}
    </section>
  );
}
