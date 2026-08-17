import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

import styles from "./Sidebar.module.scss";

export type ViewMode = "home" | "board" | "projectPlan" | "settings";

type SidebarProps = {
  activeView: ViewMode;
  hasSelectedFolder: boolean;
  workflowExists: boolean;
  feedbackMessage: string;
  isCollapsed: boolean;
  theme: "light" | "dark";
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
  onViewChange: (view: ViewMode) => void;
};

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <svg className={styles.navIcon} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

type NavItemProps = {
  active: boolean;
  disabled?: boolean;
  label: string;
  onNavigate: () => void;
  children: ReactNode;
};

function NavItem({ active, disabled = false, label, onNavigate, children }: NavItemProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onNavigate();
  }

  return (
    <a
      className={`${styles.navLink} ${active ? styles.active : ""} ${disabled ? styles.disabled : ""}`}
      href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled ? "true" : undefined}
      aria-label={label}
      title={label}
    >
      {children}
      <span className={styles.navLinkLabel}>{label}</span>
    </a>
  );
}

export function Sidebar({
  activeView,
  hasSelectedFolder,
  workflowExists,
  feedbackMessage,
  isCollapsed,
  theme,
  onToggleCollapse,
  onToggleTheme,
  onViewChange
}: SidebarProps) {
  function handleToggleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      if (!isCollapsed) {
        event.preventDefault();
        onToggleCollapse();
      }
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isCollapsed) {
        event.preventDefault();
        onToggleCollapse();
      }
    }
  }

  return (
    <aside className={`${styles.sidebarCard} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.sidebarHeaderRow}>
        <button
          className={styles.sidebarToggle}
          type="button"
          onClick={onToggleCollapse}
          onKeyDown={handleToggleKeyDown}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand side navigation" : "Collapse side navigation"}
          title={isCollapsed ? "Expand side navigation" : "Collapse side navigation"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isCollapsed ? (
              <>
                <path d="M9.22 18.03A0.75 0.75 0 0 1 9.22 16.97L14.19 12L9.22 7.03A0.75 0.75 0 1 1 10.28 5.97L15.78 11.47A0.75 0.75 0 0 1 15.78 12.53L10.28 18.03A0.75 0.75 0 0 1 9.22 18.03Z" />
              </>
            ) : (
              <>
                <path d="M14.78 18.03A0.75 0.75 0 0 1 13.72 18.03L8.22 12.53A0.75 0.75 0 0 1 8.22 11.47L13.72 5.97A0.75 0.75 0 1 1 14.78 7.03L9.81 12L14.78 16.97A0.75 0.75 0 0 1 14.78 18.03Z" />
              </>
            )}
          </svg>
        </button>

        <div className={styles.sidebarBrand} aria-label="Stream">
          <span className={styles.sidebarBrandInitial}>S</span>
          <span className={styles.sidebarBrandRemainder}>tream</span>
        </div>
      </div>

      <div className={styles.sidebarBody}>
        <nav className={styles.primaryNav} aria-label="Primary navigation">
          <NavItem active={activeView === "home"} label="Home" onNavigate={() => onViewChange("home")}>
            <SidebarIcon>
              <path d="M4.75 10.36L11.29 4.68A1.08 1.08 0 0 1 12.71 4.68L19.25 10.36V18.5A1.5 1.5 0 0 1 17.75 20H14.5V14.75H9.5V20H6.25A1.5 1.5 0 0 1 4.75 18.5V10.36Z" />
            </SidebarIcon>
          </NavItem>
          <NavItem
            active={activeView === "board"}
            label="Task Board"
            onNavigate={() => onViewChange("board")}
          >
            <SidebarIcon>
              <path d="M4.5 5.75A1.25 1.25 0 0 1 5.75 4.5H10.25A1.25 1.25 0 0 1 11.5 5.75V10.25A1.25 1.25 0 0 1 10.25 11.5H5.75A1.25 1.25 0 0 1 4.5 10.25V5.75Z" />
              <path d="M12.5 5.75A1.25 1.25 0 0 1 13.75 4.5H18.25A1.25 1.25 0 0 1 19.5 5.75V10.25A1.25 1.25 0 0 1 18.25 11.5H13.75A1.25 1.25 0 0 1 12.5 10.25V5.75Z" />
              <path d="M4.5 13.75A1.25 1.25 0 0 1 5.75 12.5H10.25A1.25 1.25 0 0 1 11.5 13.75V18.25A1.25 1.25 0 0 1 10.25 19.5H5.75A1.25 1.25 0 0 1 4.5 18.25V13.75Z" />
              <path d="M12.5 13.75A1.25 1.25 0 0 1 13.75 12.5H18.25A1.25 1.25 0 0 1 19.5 13.75V18.25A1.25 1.25 0 0 1 18.25 19.5H13.75A1.25 1.25 0 0 1 12.5 18.25V13.75Z" />
            </SidebarIcon>
          </NavItem>
          <NavItem
            active={activeView === "projectPlan"}
            disabled={!workflowExists}
            label="Project Plan"
            onNavigate={() => onViewChange("projectPlan")}
          >
            <SidebarIcon>
              <path d="M6 4.5H14.5L18 8V18.25A1.25 1.25 0 0 1 16.75 19.5H7.25A1.25 1.25 0 0 1 6 18.25V4.5Z" />
              <path d="M14 4.5V8.5H18" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8.75 11H15.25M8.75 14H15.25M8.75 17H13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </SidebarIcon>
          </NavItem>
          <NavItem
            active={activeView === "settings"}
            label="Settings"
            onNavigate={() => onViewChange("settings")}
          >
            <SidebarIcon>
              <path d="M12 8.75A3.25 3.25 0 1 0 12 15.25A3.25 3.25 0 1 0 12 8.75Z" />
              <path d="M19.4 13.5A7.77 7.77 0 0 0 19.47 12A7.77 7.77 0 0 0 19.4 10.5L21.31 9.01A0.75 0.75 0 0 0 21.49 8.03L19.69 4.97A0.75 0.75 0 0 0 18.77 4.65L16.52 5.56A7.44 7.44 0 0 0 13.99 4.09L13.66 1.71A0.75 0.75 0 0 0 12.92 1.06H11.08A0.75 0.75 0 0 0 10.34 1.71L10.01 4.09A7.44 7.44 0 0 0 7.48 5.56L5.23 4.65A0.75 0.75 0 0 0 4.31 4.97L2.51 8.03A0.75 0.75 0 0 0 2.69 9.01L4.6 10.5A7.77 7.77 0 0 0 4.53 12A7.77 7.77 0 0 0 4.6 13.5L2.69 14.99A0.75 0.75 0 0 0 2.51 15.97L4.31 19.03A0.75 0.75 0 0 0 5.23 19.35L7.48 18.44A7.44 7.44 0 0 0 10.01 19.91L10.34 22.29A0.75 0.75 0 0 0 11.08 22.94H12.92A0.75 0.75 0 0 0 13.66 22.29L13.99 19.91A7.44 7.44 0 0 0 16.52 18.44L18.77 19.35A0.75 0.75 0 0 0 19.69 19.03L21.49 15.97A0.75 0.75 0 0 0 21.31 14.99L19.4 13.5Z" />
            </SidebarIcon>
          </NavItem>
        </nav>

        <div className={styles.sidebarTools}>
          <p className={styles.sidebarSectionLabel}>Appearance</p>
          <button className={styles.sidebarModeButton} type="button" onClick={onToggleTheme}>
            {theme === "dark" ? "Use light mode" : "Use dark mode"}
          </button>
        </div>

        <div className={styles.statusPanel}>
          <span className={styles.statusDot} aria-hidden="true" />
          <div>
            <p className={styles.statusLabel}>
              {!hasSelectedFolder
                ? "No project selected"
                : workflowExists
                  ? "Workflow ready"
                  : "Project attached"}
            </p>
            <p className={styles.statusCopy}>{feedbackMessage}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
