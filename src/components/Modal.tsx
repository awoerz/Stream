import type { ReactNode } from "react";

import styles from "./Modal.module.scss";

type ModalProps = {
  title: string;
  subtitle: string;
  ariaLabel: string;
  onClose: () => void;
  variant?: "prompt" | "detail" | "document";
  children: ReactNode;
};

export function Modal({
  title,
  subtitle,
  ariaLabel,
  onClose,
  variant,
  children
}: ModalProps) {
  const cardClassName = `${styles.card} ${variant ? styles[variant] : ""}`.trim();

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <section
        className={cardClassName}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <p className={styles.subtitle}>{subtitle}</p>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label={`Close ${ariaLabel}`}
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
