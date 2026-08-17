import type { ChangeEvent } from "react";

import styles from "./TaskDetailContent.module.scss";
import type { TaskDetail } from "./types";

type TaskDetailContentProps = {
  selectedTaskDetail: TaskDetail | null;
  isLoadingTaskDetail: boolean;
  taskDetailMessage: string;
  canEdit: boolean;
  isUploadingImages: boolean;
  onEdit: () => void;
  onUploadImages: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function TaskDetailContent({
  selectedTaskDetail,
  isLoadingTaskDetail,
  taskDetailMessage,
  canEdit,
  isUploadingImages,
  onEdit,
  onUploadImages
}: TaskDetailContentProps) {
  if (isLoadingTaskDetail) {
    return <p className={styles.message}>Loading task detail...</p>;
  }

  if (!selectedTaskDetail) {
    return (
      <p className={styles.message}>
        {taskDetailMessage || "Task detail could not be loaded."}
      </p>
    );
  }

  return (
    <div className={styles.layout}>
      {canEdit ? (
        <div className={styles.actions}>
          <button className={styles.compactButton} type="button" onClick={onEdit}>
            Edit backlog task
          </button>
          <label className={`${styles.compactButton} ${styles.uploadButton}`}>
            {isUploadingImages ? "Uploading..." : "Upload images"}
            <input
              className={styles.hiddenFileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={onUploadImages}
              disabled={isUploadingImages}
            />
          </label>
        </div>
      ) : null}
      <div className={styles.grid}>
        <div className={styles.metaCard}>
          <p className={styles.label}>ID</p>
          <p className={styles.copy}>{selectedTaskDetail.id}</p>
        </div>
        <div className={styles.metaCard}>
          <p className={styles.label}>Type</p>
          <p className={styles.copy}>{selectedTaskDetail.type}</p>
        </div>
        <div className={styles.sectionCard}>
          <p className={styles.label}>Status</p>
          <p className={styles.copy}>{selectedTaskDetail.status}</p>
        </div>
        <div className={styles.sectionCard}>
          <p className={styles.label}>Priority / Rank</p>
          <p className={styles.copy}>
            {selectedTaskDetail.priority} / {selectedTaskDetail.rank ?? "unranked"}
          </p>
        </div>
        <div className={styles.sectionCard}>
          <p className={styles.label}>Summary</p>
          <p className={styles.copy}>{selectedTaskDetail.summary}</p>
        </div>
        {selectedTaskDetail.why ? (
          <div className={styles.sectionCard}>
            <p className={styles.label}>Why</p>
            <p className={styles.copy}>{selectedTaskDetail.why}</p>
          </div>
        ) : null}
        <div className={styles.sectionCard}>
          <p className={styles.label}>Acceptance criteria</p>
          <ul className={styles.checklist}>
            {selectedTaskDetail.acceptanceCriteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {selectedTaskDetail.context ? (
          <div className={styles.sectionCard}>
            <p className={styles.label}>Context</p>
            <p className={styles.copy}>{selectedTaskDetail.context}</p>
          </div>
        ) : null}
        <div className={styles.sectionCard}>
          <p className={styles.label}>Notes</p>
          <p className={styles.copy}>{selectedTaskDetail.notes}</p>
        </div>
        {selectedTaskDetail.images.length > 0 ? (
          <div className={styles.sectionCard}>
            <p className={styles.label}>Images</p>
            <div className={styles.imageGrid}>
              {selectedTaskDetail.images.map((image) => (
                <figure className={styles.imageCard} key={image.id}>
                  <img
                    className={styles.imagePreview}
                    src={image.fileUrl}
                    alt={image.id}
                  />
                  <figcaption className={styles.copy}>{image.id}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
        {selectedTaskDetail.activityLog.length > 0 ? (
          <div className={styles.sectionCard}>
            <p className={styles.label}>Activity log</p>
            <ul className={styles.checklist}>
              {selectedTaskDetail.activityLog.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className={styles.sectionCard}>
          <p className={styles.label}>File path</p>
          <p className={styles.copy}>{selectedTaskDetail.filePath}</p>
        </div>
      </div>
    </div>
  );
}
