import type { TaskBoardCard } from "../features/tasks/types";
import styles from "./TaskCard.module.scss";

type TaskCardProps = {
  task: TaskBoardCard;
  onOpen: (task: TaskBoardCard) => void;
  onContextMenu: (task: TaskBoardCard, event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function TaskCard({ task, onOpen, onContextMenu }: TaskCardProps) {
  const attachmentLabel =
    task.attachmentCount === 1
      ? "1 attachment available in task details"
      : `${task.attachmentCount} attachments available in task details`;

  return (
    <button
      className={`${styles.card} ${styles.interactive}`}
      type="button"
      onClick={() => onOpen(task)}
      onContextMenu={(event) => onContextMenu(task, event)}
    >
      <div className={styles.header}>
        <p className={styles.id}>{task.id}</p>
        {task.attachmentCount > 0 ? (
          <span className={styles.attachmentIndicator} title={attachmentLabel}>
            <svg
              className={styles.attachmentIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M8.5 12.75L14.78 6.47A3.25 3.25 0 1 1 19.38 11.07L11.34 19.1A5.25 5.25 0 0 1 3.92 11.68L12.31 3.3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            <span className={styles.attachmentCount}>{task.attachmentCount}</span>
            <span className={styles.srOnly}>{attachmentLabel}</span>
          </span>
        ) : null}
      </div>
      <div className={styles.badges}>
        <span
          className={`${styles.typeBadge} ${task.type === "bug" ? styles.typeBadgeBug : ""}`}
        >
          {task.type}
        </span>
        <span className={styles.metaBadge}>
          {task.rank !== null ? `Rank ${task.rank}` : "Unranked"}
        </span>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.meta}>Priority: {task.priority}</p>
    </button>
  );
}
