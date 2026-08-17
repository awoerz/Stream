import styles from "./HomePage.module.scss";

const productionGithubUrl = "https://github.com/adam/stream#readme";
// Temporary local-development fallback until the canonical repository target is finalized.
const developmentGithubUrl = "https://github.com/awoerz";
const githubUrl = import.meta.env.DEV ? developmentGithubUrl : productionGithubUrl;

export function HomePage() {
  function handleOpenGithubReadme() {
    void window.stream.openExternalUrl(githubUrl);
  }

  return (
    <>
      <section className={styles.heroCard}>
        <p className={styles.sectionLabel}>Workspace</p>
        <h2 className={styles.title}>Keep project context and agent work in one place</h2>
        <p className={styles.copy}>
          Use Stream to manage markdown-based workflow context, coordinate AI work, and
          keep project plans readable directly from the repository.
        </p>
      </section>

      <button
        className={styles.githubCard}
        type="button"
        onClick={handleOpenGithubReadme}
        aria-label="Learn more and give us a star on GitHub"
      >
        <p className={styles.sectionLabel}>GitHub</p>
        <h3 className={styles.cardTitle}>Learn more and give us a star</h3>
        <p className={styles.copy}>Open the project GitHub page in your browser.</p>
      </button>
    </>
  );
}
