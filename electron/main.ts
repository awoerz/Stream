import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeImage,
  shell,
  webContents,
  type IpcMainInvokeEvent,
  type MenuItemConstructorOptions,
  type OpenDialogOptions
} from "electron";
import { existsSync, watch, type FSWatcher } from "node:fs";
import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  getNextTaskImageId,
  storeTaskImageFile,
  validateTaskImageUpload
} from "./taskImages";

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const appDisplayName = "Stream";
const primaryWorkflowFolderName = "1-Stream";
const workflowDirectories = [
  "tasks/backlog",
  "tasks/doing",
  "tasks/blocked",
  "tasks/done",
  "images",
  "templates"
];

app.setName(appDisplayName);

function resolveAppAssetPath(fileName: string) {
  const candidatePaths = [
    path.join(process.resourcesPath, "assets", fileName),
    path.join(process.resourcesPath, "electron", "assets", fileName),
    path.join(__dirname, "assets", fileName),
    path.join(__dirname, "../electron/assets", fileName)
  ];

  return candidatePaths.find((candidatePath) => existsSync(candidatePath)) ?? null;
}

function getRoundedRectAlphaMultiplier(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const pixelCenterX = x + 0.5;
  const pixelCenterY = y + 0.5;
  const nearestX = Math.max(radius, Math.min(pixelCenterX, width - radius));
  const nearestY = Math.max(radius, Math.min(pixelCenterY, height - radius));
  const deltaX = pixelCenterX - nearestX;
  const deltaY = pixelCenterY - nearestY;
  const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
  const antiAliasWidth = 1.25;

  if (distance <= radius - antiAliasWidth) {
    return 1;
  }

  if (distance >= radius + antiAliasWidth) {
    return 0;
  }

  return Math.max(0, Math.min(1, (radius + antiAliasWidth - distance) / (antiAliasWidth * 2)));
}

function createRoundedApplicationIcon(sourceIcon: Electron.NativeImage) {
  const sourceSize = sourceIcon.getSize();
  const sourceDimension = Math.min(sourceSize.width, sourceSize.height);
  const cropInset = Math.round(sourceDimension * 0.05);
  const croppedIcon =
    cropInset > 0
      ? sourceIcon.crop({
          x: cropInset,
          y: cropInset,
          width: sourceSize.width - (cropInset * 2),
          height: sourceSize.height - (cropInset * 2)
        })
      : sourceIcon;
  const resizedIcon = croppedIcon.resize({
    width: 1024,
    height: 1024,
    quality: "best"
  });
  const { width, height } = resizedIcon.getSize();
  const cornerRadius = Math.round(Math.min(width, height) * 0.22);
  const bitmap = Buffer.from(resizedIcon.toBitmap());

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = ((y * width) + x) * 4;
      const alphaMultiplier = getRoundedRectAlphaMultiplier(x, y, width, height, cornerRadius);

      bitmap[pixelIndex + 3] = Math.round(bitmap[pixelIndex + 3] * alphaMultiplier);
    }
  }

  return nativeImage.createFromBitmap(bitmap, {
    width,
    height,
    scaleFactor: 1
  });
}

function getApplicationIcon() {
  const iconPath =
    resolveAppAssetPath("stream-icon-source.png") ??
    resolveAppAssetPath("stream-icon-1024.png") ??
    resolveAppAssetPath("stream-icon-512.png");

  if (!iconPath) {
    return null;
  }

  const sourceIcon = nativeImage.createFromPath(iconPath);

  if (sourceIcon.isEmpty()) {
    return null;
  }

  const icon = createRoundedApplicationIcon(sourceIcon);

  return icon.isEmpty() ? null : icon;
}

function configureApplicationIdentity() {
  app.setAboutPanelOptions({
    applicationName: appDisplayName,
    applicationVersion: app.getVersion()
  });

  const icon = getApplicationIcon();

  if (process.platform === "darwin" && icon && app.dock) {
    app.dock.setIcon(icon);
  }
}

function configureApplicationMenu() {
  const isMac = process.platform === "darwin";
  const appMenuSubmenu: MenuItemConstructorOptions[] = [
    { role: "about" },
    { type: "separator" },
    { role: "services" },
    { type: "separator" },
    { role: "hide" },
    { role: "hideOthers" },
    { role: "unhide" },
    { type: "separator" },
    { role: "quit" }
  ];
  const fileMenuSubmenu: MenuItemConstructorOptions[] = [{ role: "quit" }];
  const editMenuSubmenuForMac: MenuItemConstructorOptions[] = [
    { role: "undo" },
    { role: "redo" },
    { type: "separator" },
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    { role: "pasteAndMatchStyle" },
    { role: "delete" },
    { role: "selectAll" },
    { type: "separator" },
    {
      label: "Speech",
      submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
    }
  ];
  const editMenuSubmenuForOtherPlatforms: MenuItemConstructorOptions[] = [
    { role: "undo" },
    { role: "redo" },
    { type: "separator" },
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    { role: "delete" },
    { type: "separator" },
    { role: "selectAll" }
  ];
  const viewMenuSubmenuForDev: MenuItemConstructorOptions[] = [
    { role: "reload" },
    { role: "forceReload" },
    { role: "toggleDevTools" },
    { type: "separator" },
    { role: "resetZoom" },
    { role: "zoomIn" },
    { role: "zoomOut" },
    { type: "separator" },
    { role: "togglefullscreen" }
  ];
  const viewMenuSubmenuForProd: MenuItemConstructorOptions[] = [
    { role: "resetZoom" },
    { role: "zoomIn" },
    { role: "zoomOut" },
    { type: "separator" },
    { role: "togglefullscreen" }
  ];
  const windowMenuSubmenuForMac: MenuItemConstructorOptions[] = [
    { role: "minimize" },
    { role: "zoom" },
    { type: "separator" },
    { role: "front" }
  ];
  const windowMenuSubmenuForOtherPlatforms: MenuItemConstructorOptions[] = [
    { role: "minimize" },
    { role: "close" }
  ];
  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: appDisplayName,
            submenu: appMenuSubmenu
          } satisfies MenuItemConstructorOptions
        ]
      : []),
    ...(isMac
      ? []
      : [
          {
            label: "File",
            submenu: fileMenuSubmenu
          } satisfies MenuItemConstructorOptions
        ]),
    {
      label: "Edit",
      submenu: isMac ? editMenuSubmenuForMac : editMenuSubmenuForOtherPlatforms
    },
    {
      label: "View",
      submenu: isDev ? viewMenuSubmenuForDev : viewMenuSubmenuForProd
    },
    {
      label: "Window",
      submenu: isMac ? windowMenuSubmenuForMac : windowMenuSubmenuForOtherPlatforms
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

const starterFiles = [
  {
    relativePath: "README.md",
    contents: `# Stream Guide

This folder defines how Stream stores project coordination files inside this repository.

Use it as a lightweight, local-first workflow layer for humans and AI coding agents.

## Key Files

- \`stream.md\`
  Agent instructions for selecting and executing work.

- \`project-plan.md\`
  The living plan for where the project is headed.

- \`current-state.md\`
  A concrete snapshot of what is implemented, partial, broken, or still uncertain.

- \`decisions.md\`
  A running log of meaningful project or architecture decisions.

- \`tasks/\`
  Work items grouped by status.

- \`templates/work-item-template.md\`
  A reusable template for creating new work items.

## Folder Structure

- \`README.md\`
  Human-facing orientation for this Stream workspace.

- \`stream.md\`
  Agent-facing execution rules.

- \`project-plan.md\`
  The current project plan.

- \`current-state.md\`
  The latest implementation snapshot.

- \`decisions.md\`
  The running decision log.

- \`tasks/\`
  Contains all work items as markdown files grouped by status.

  Task subfolders represent status:
  - \`backlog/\` = not started
  - \`doing/\` = in progress
  - \`blocked/\` = waiting on something
  - \`done/\` = completed

- \`templates/\`
  Contains reusable templates for workflow files.

## Human Workflow

- Humans usually maintain:
  - \`project-plan.md\`
  - \`current-state.md\`
  - \`decisions.md\`
  - task files under \`tasks/\`

- Agents should follow the instructions in \`stream.md\`.
`
  },
  {
    relativePath: "stream.md",
    contents: `# Stream Agent Instructions

## Purpose

This file defines how an AI coding agent should work inside this project.

Use these instructions alongside the task files in \`tasks/\`.

## Read First

Before making changes, read:
- \`project-plan.md\`
- \`current-state.md\`
- \`decisions.md\`

## Task Selection

Choose work using this order:
1. Continue an already-started item in \`tasks/doing/\` if one is clearly assigned to you or is the active next step.
2. Otherwise choose from \`tasks/backlog/\`.
3. Prefer lower \`rank\` values first when they exist.
4. If rank is tied or missing, prefer higher \`priority\`.
5. If still tied, prefer the oldest clearly actionable work item.

Do not start new work if the next item is blocked and cannot be advanced safely without clarification.

## Execution Rules

- Move the selected work item to \`doing\` when you begin meaningful implementation.
- Keep changes aligned to the task summary and acceptance criteria.
- Do not widen scope unless the work item is updated to reflect it.
- Preserve existing human changes unless explicitly asked to replace them.

## Documentation Updates

After implementation changes:
- update the work item notes or activity log
- update \`current-state.md\` so it reflects reality
- update \`decisions.md\` when you make a meaningful project or architecture decision

## Completion

When the work is complete:
- verify the result as well as you reasonably can
- update the work item activity log
- move the work item to \`tasks/done/\`

## Reporting Back

When you report back, summarize:
- what changed
- what was verified
- any known limitations or follow-up risks
`
  },
  {
    relativePath: "project-plan.md",
    contents: `# Project Plan: Replace With Project Name

## Vision

Describe the product or system this project is meant to become.

## Problem

Explain the problem this project solves and why it matters.

## Solution

Summarize the shape of the solution at a high level.

## Core Principles

- local-first where possible
- human-readable project context
- calm, practical workflows

## MVP Features

### Setup
- attach to an existing project
- initialize a \`1-Stream\` folder

### Core Workflows
- create and manage tasks
- preserve project context for future sessions

## Non-Goals

- list anything intentionally out of scope for now

## Success Criteria

- define what success looks like for this project
`
  },
  {
    relativePath: "current-state.md",
    contents: `# Current State

## Overview

Summarize what this project currently does in practical terms.

## Implemented Features

- List concrete behaviors that are working today

## Partially Implemented Features

- List features that exist in some form but are not fully complete

## Broken or Incomplete Areas

- List known broken flows, missing capabilities, or rough edges

## Technical Debt or Architectural Concerns

- List structural concerns that affect future development
`
  },
  {
    relativePath: "decisions.md",
    contents: `# Decisions

Use this file to record meaningful product, technical, or workflow decisions.

## Decision Template

### YYYY-MM-DD - Short Decision Title

- Context:
- Decision:
- Why:
- Follow-up:
`
  },
  {
    relativePath: "templates/work-item-template.md",
    contents: `---
id: TASK-0000
title: Replace with task title
type: task
priority: medium
rank: 1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

## Summary
Describe the work clearly and briefly.

## Acceptance Criteria
- Criterion 1
- Criterion 2
- Criterion 3

## Notes
Add implementation notes, reminders, or observations here.
`
  }
];

type TaskStatus = "backlog" | "doing" | "blocked" | "done";
const taskStatuses: TaskStatus[] = ["backlog", "doing", "blocked", "done"];

type TaskSavePayload = {
  title: string;
  type: "task" | "bug" | "chore" | "research";
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  rank: string;
  owner: string;
  agent: string;
  tags: string;
  summary: string;
  why: string;
  acceptanceCriteria: string;
  context: string;
  notes: string;
};

type TaskUpdatePayload = {
  filePath: string;
  title: string;
  type: "task" | "bug" | "chore" | "research";
  priority: "low" | "medium" | "high";
  rank: string;
  summary: string;
  acceptanceCriteria: string;
  notes: string;
};

type GitignoreMode = "track" | "ignore";

type TaskBoardItem = {
  id: string;
  title: string;
  type: string;
  priority: string;
  rank: number | null;
  attachmentCount: number;
  owner: string;
  agent: string;
  status: TaskStatus;
  filePath: string;
};

type TaskDetail = {
  id: string;
  title: string;
  type: string;
  status: TaskStatus;
  priority: string;
  rank: number | null;
  owner: string;
  agent: string;
  tags: string;
  related: string;
  summary: string;
  why: string;
  acceptanceCriteria: string[];
  context: string;
  notes: string;
  images: Array<{
    id: string;
    filePath: string;
    fileUrl: string;
  }>;
  activityLog: string[];
  filePath: string;
};

type TaskImageUploadPayload = {
  filePath: string;
  files: Array<{
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    base64Contents: string;
  }>;
};

type SaveGeneratedMarkdownPayload = {
  markdown: string;
};

type WorkItemIdPreview = {
  latestTaskId: string | null;
  latestBugId: string | null;
  nextTaskId: string;
  nextBugId: string;
};

type WorkflowDocument = {
  filePath: string;
  contents: string;
};

type LmStudioTestResult = {
  ok: boolean;
  model: string;
};

type NextActionableTask = {
  id: string;
  title: string;
  type: string;
  status: TaskStatus;
  priority: string;
  rank: number | null;
  filePath: string;
} | null;

type TaskContextMenuPayload = {
  filePath: string;
  canEdit: boolean;
  x: number;
  y: number;
};

type TaskWatchState = {
  projectPath: string;
  tasksRoot: string;
  directoryWatchers: Map<string, FSWatcher>;
  subscriberIds: Set<number>;
  debounceTimer: NodeJS.Timeout | null;
};

const taskWatchStates = new Map<string, TaskWatchState>();

function getWorkflowPaths(projectPath: string) {
  return {
    primaryRoot: path.join(projectPath, primaryWorkflowFolderName),
    legacyRoot: path.join(projectPath, "agent-workflow")
  };
}

async function handleSelectProjectFolder() {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const dialogOptions: OpenDialogOptions = {
    title: "Choose a project folder",
    properties: ["openDirectory"]
  };
  const result = focusedWindow
    ? await dialog.showOpenDialog(focusedWindow, dialogOptions)
    : await dialog.showOpenDialog(dialogOptions);

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}

function handleGetDefaultProjectPath() {
  return process.cwd();
}

async function pathExists(targetPath: string) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureFile(targetPath: string, contents: string) {
  if (await pathExists(targetPath)) {
    return "skipped";
  }

  await writeFile(targetPath, contents, { encoding: "utf8", flag: "wx" });
  return "created";
}

async function ensureGitignoreEntry(projectPath: string) {
  const gitignorePath = path.join(projectPath, ".gitignore");
  const gitignoreEntry = `${primaryWorkflowFolderName}/`;
  const legacyGitignoreEntry = "agent-workflow/";
  const gitignoreExists = await pathExists(gitignorePath);

  if (!gitignoreExists) {
    await writeFile(gitignorePath, `${gitignoreEntry}\n`, {
      encoding: "utf8",
      flag: "wx"
    });

    return {
      status: "created" as const,
      path: gitignorePath
    };
  }

  const existingContents = await readFile(gitignorePath, "utf8");
  const lines = existingContents.split(/\r?\n/);
  const trimmedLines = lines.map((line) => line.trim());
  const hasEntry = trimmedLines.includes(gitignoreEntry);

  if (hasEntry) {
    return {
      status: "unchanged" as const,
      path: gitignorePath
    };
  }

  if (trimmedLines.includes(legacyGitignoreEntry)) {
    const updatedContents = lines
      .map((line) => (line.trim() === legacyGitignoreEntry ? gitignoreEntry : line))
      .join("\n");

    await writeFile(
      gitignorePath,
      updatedContents.endsWith("\n") ? updatedContents : `${updatedContents}\n`,
      {
        encoding: "utf8"
      }
    );

    return {
      status: "updated" as const,
      path: gitignorePath
    };
  }

  const normalizedContents = existingContents.endsWith("\n")
    ? existingContents
    : `${existingContents}\n`;

  await writeFile(gitignorePath, `${normalizedContents}${gitignoreEntry}\n`, {
    encoding: "utf8"
  });

  return {
    status: "updated" as const,
    path: gitignorePath
  };
}

async function removeGitignoreEntry(projectPath: string) {
  const gitignorePath = path.join(projectPath, ".gitignore");

  if (!(await pathExists(gitignorePath))) {
    return null;
  }

  const removableEntries = new Set(["1-Stream/", "1-stream/", "1-Stream", "1-stream"]);
  const existingContents = await readFile(gitignorePath, "utf8");
  const lines = existingContents.split(/\r?\n/);
  const nextLines = lines.filter((line) => !removableEntries.has(line.trim()));

  if (nextLines.length === lines.length) {
    return {
      status: "unchanged" as const,
      path: gitignorePath
    };
  }

  const normalizedContents = nextLines.join("\n").replace(/\n+$/g, "");
  await writeFile(gitignorePath, normalizedContents ? `${normalizedContents}\n` : "", {
    encoding: "utf8"
  });

  return {
    status: "removed" as const,
    path: gitignorePath
  };
}

async function renameIfPresent(sourcePath: string, targetPath: string) {
  if (!(await pathExists(sourcePath)) || (await pathExists(targetPath))) {
    return false;
  }

  await rename(sourcePath, targetPath);
  return true;
}

function rewriteMigratedMarkdownReferences(contents: string) {
  return contents
    .replace(/agent-workflow/g, primaryWorkflowFolderName)
    .replace(/epic\.md/g, "project-plan.md")
    .replace(/task-template\.md/g, "work-item-template.md");
}

async function rewriteMarkdownFileReferences(targetPath: string) {
  const contents = await readFile(targetPath, "utf8");
  const updatedContents = rewriteMigratedMarkdownReferences(contents);

  if (updatedContents !== contents) {
    await writeFile(targetPath, updatedContents, { encoding: "utf8" });
  }
}

async function collectMarkdownFiles(targetPath: string): Promise<string[]> {
  if (!(await pathExists(targetPath))) {
    return [];
  }

  const targetStat = await stat(targetPath);

  if (targetStat.isFile()) {
    return targetPath.endsWith(".md") ? [targetPath] : [];
  }

  const entries = await readdir(targetPath);
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(targetPath, entry);
    const entryStat = await stat(entryPath);

    if (entryStat.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)));
      continue;
    }

    if (entryPath.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

async function collectDirectories(targetPath: string): Promise<string[]> {
  if (!(await pathExists(targetPath))) {
    return [];
  }

  const targetStat = await stat(targetPath);

  if (!targetStat.isDirectory()) {
    return [];
  }

  const entries = await readdir(targetPath);
  const directories = [targetPath];

  for (const entry of entries) {
    const entryPath = path.join(targetPath, entry);
    const entryStat = await stat(entryPath);

    if (entryStat.isDirectory()) {
      directories.push(...(await collectDirectories(entryPath)));
    }
  }

  return directories;
}

function cleanupTaskWatchState(tasksRoot: string) {
  const existingState = taskWatchStates.get(tasksRoot);

  if (!existingState) {
    return;
  }

  if (existingState.debounceTimer) {
    clearTimeout(existingState.debounceTimer);
  }

  for (const watcher of existingState.directoryWatchers.values()) {
    watcher.close();
  }

  taskWatchStates.delete(tasksRoot);
}

function notifyTaskWatchSubscribers(tasksRoot: string) {
  const state = taskWatchStates.get(tasksRoot);

  if (!state) {
    return;
  }

  for (const subscriberId of state.subscriberIds) {
    const subscriber = webContents.fromId(subscriberId);

    if (!subscriber || subscriber.isDestroyed()) {
      state.subscriberIds.delete(subscriberId);
      continue;
    }

    subscriber.send("task:filesystem-changed", {
      projectPath: state.projectPath
    });
  }
}

function scheduleTaskWatchRefresh(tasksRoot: string) {
  const state = taskWatchStates.get(tasksRoot);

  if (!state) {
    return;
  }

  if (state.debounceTimer) {
    clearTimeout(state.debounceTimer);
  }

  state.debounceTimer = setTimeout(async () => {
    state.debounceTimer = null;

    try {
      await syncTaskDirectoryWatchers(tasksRoot);
      notifyTaskWatchSubscribers(tasksRoot);
    } catch {
      notifyTaskWatchSubscribers(tasksRoot);
    }
  }, 180);
}

async function syncTaskDirectoryWatchers(tasksRoot: string) {
  const state = taskWatchStates.get(tasksRoot);

  if (!state) {
    return;
  }

  if (!(await pathExists(tasksRoot))) {
    cleanupTaskWatchState(tasksRoot);
    return;
  }

  const directories = await collectDirectories(tasksRoot);
  const directorySet = new Set(directories);

  for (const [directoryPath, watcher] of state.directoryWatchers) {
    if (!directorySet.has(directoryPath)) {
      watcher.close();
      state.directoryWatchers.delete(directoryPath);
    }
  }

  for (const directoryPath of directories) {
    if (state.directoryWatchers.has(directoryPath)) {
      continue;
    }

    const watcher = watch(directoryPath, () => {
      scheduleTaskWatchRefresh(tasksRoot);
    });

    watcher.on("error", () => {
      scheduleTaskWatchRefresh(tasksRoot);
    });

    state.directoryWatchers.set(directoryPath, watcher);
  }
}

async function handleStartTaskWatch(
  event: IpcMainInvokeEvent,
  projectPath: string
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");

  if (!(await pathExists(tasksRoot))) {
    throw new Error("Initialize 1-Stream before starting the board watcher.");
  }

  let state = taskWatchStates.get(tasksRoot);

  if (!state) {
    state = {
      projectPath,
      tasksRoot,
      directoryWatchers: new Map(),
      subscriberIds: new Set(),
      debounceTimer: null
    };
    taskWatchStates.set(tasksRoot, state);
  }

  state.projectPath = projectPath;
  state.subscriberIds.add(event.sender.id);
  await syncTaskDirectoryWatchers(tasksRoot);

  return {
    watching: true
  };
}

function handleStopTaskWatch(event: IpcMainInvokeEvent, projectPath: string) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");
  const state = taskWatchStates.get(tasksRoot);

  if (!state) {
    return {
      watching: false
    };
  }

  state.subscriberIds.delete(event.sender.id);

  if (state.subscriberIds.size === 0) {
    cleanupTaskWatchState(tasksRoot);
  }

  return {
    watching: false
  };
}

function cleanupTaskWatchSubscriptionsForSender(senderId: number) {
  for (const [tasksRoot, state] of taskWatchStates) {
    state.subscriberIds.delete(senderId);

    if (state.subscriberIds.size === 0) {
      cleanupTaskWatchState(tasksRoot);
    }
  }
}

async function handleDeleteTask(
  _: Electron.IpcMainInvokeEvent,
  filePath: string
) {
  if (!(await pathExists(filePath))) {
    throw new Error("The selected task file no longer exists.");
  }

  await import("node:fs/promises").then(({ unlink }) => unlink(filePath));

  return { filePath };
}

function handleShowTaskContextMenu(
  event: IpcMainInvokeEvent,
  payload: TaskContextMenuPayload
) {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return;
  }

  const menu = Menu.buildFromTemplate([
    {
      label: "View details",
      click: () => {
        event.sender.send("task:context-action", {
          action: "view",
          filePath: payload.filePath
        });
      }
    },
    ...(payload.canEdit
      ? [
          {
            label: "Edit",
            click: () => {
              event.sender.send("task:context-action", {
                action: "edit",
                filePath: payload.filePath
              });
            }
          }
        ]
      : []),
    { type: "separator" },
    {
      label: "Delete",
      click: () => {
        event.sender.send("task:context-action", {
          action: "delete",
          filePath: payload.filePath
        });
      }
    }
  ]);

  menu.popup({
    window,
    x: Math.round(payload.x),
    y: Math.round(payload.y)
  });
}

function buildLmStudioChatEndpoint(rawUrl: string) {
  const baseUrl = new URL(rawUrl.trim());
  const normalizedPath = baseUrl.pathname.replace(/\/+$/g, "");

  if (normalizedPath.endsWith("/chat/completions")) {
    return baseUrl.toString();
  }

  if (normalizedPath.endsWith("/v1")) {
    baseUrl.pathname = `${normalizedPath}/chat/completions`;
    return baseUrl.toString();
  }

  baseUrl.pathname = `${normalizedPath}/v1/chat/completions`.replace(/\/{2,}/g, "/");
  return baseUrl.toString();
}

function buildLmStudioModelsEndpoint(rawUrl: string) {
  const baseUrl = new URL(rawUrl.trim());
  const normalizedPath = baseUrl.pathname.replace(/\/+$/g, "");

  if (normalizedPath.endsWith("/v1/models")) {
    return baseUrl.toString();
  }

  if (normalizedPath.endsWith("/v1")) {
    baseUrl.pathname = `${normalizedPath}/models`;
    return baseUrl.toString();
  }

  baseUrl.pathname = `${normalizedPath}/v1/models`.replace(/\/{2,}/g, "/");
  return baseUrl.toString();
}

async function discoverLmStudioModel(rawUrl: string) {
  const response = await fetch(buildLmStudioModelsEndpoint(rawUrl));

  if (!response.ok) {
    throw new Error(`LM Studio model discovery failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ id?: string }>;
  };
  const firstModel = payload.data?.find((entry) => entry.id)?.id;

  if (!firstModel) {
    throw new Error("LM Studio did not return any available models.");
  }

  return firstModel;
}

async function handleRunLmStudioPrompt(
  _: Electron.IpcMainInvokeEvent,
  payload: { url: string; prompt: string }
) {
  const model = await discoverLmStudioModel(payload.url);
  const response = await fetch(buildLmStudioChatEndpoint(payload.url), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: payload.prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`LM Studio request failed with ${response.status}.`);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
  const markdown = data.choices?.[0]?.message?.content?.trim();

  if (!markdown) {
    throw new Error("LM Studio returned an empty response.");
  }

  return {
    markdown
  };
}

async function handleTestLmStudioUrl(
  _: Electron.IpcMainInvokeEvent,
  rawUrl: string
) {
  const model = await discoverLmStudioModel(rawUrl);

  return {
    ok: true,
    model
  } satisfies LmStudioTestResult;
}

async function handleOpenExternalUrl(
  _: Electron.IpcMainInvokeEvent,
  targetUrl: string
) {
  await shell.openExternal(targetUrl);
}

async function migrateLegacyWorkflowStructure(workflowRoot: string) {
  await renameIfPresent(
    path.join(workflowRoot, "epic.md"),
    path.join(workflowRoot, "project-plan.md")
  );
  await renameIfPresent(
    path.join(workflowRoot, "templates", "task-template.md"),
    path.join(workflowRoot, "templates", "work-item-template.md")
  );

  const markdownFiles = await collectMarkdownFiles(workflowRoot);

  await Promise.all(markdownFiles.map((filePath) => rewriteMarkdownFileReferences(filePath)));
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function slugifyTitle(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "untitled-task";
}

function parseTaskNumber(fileName: string) {
  const match = fileName.match(/^TASK-(\d+)/);

  return match ? Number.parseInt(match[1], 10) : null;
}

function parseWorkItemNumber(identifier: string) {
  const match = identifier.match(/^(?:TASK|BUG)-0*(\d+)/);

  return match ? Number.parseInt(match[1], 10) : null;
}

async function getNextTaskNumber(tasksRoot: string) {
  const directories: TaskStatus[] = taskStatuses;
  const numbers: number[] = [];

  for (const directory of directories) {
    const statusPath = path.join(tasksRoot, directory);

    if (!(await pathExists(statusPath))) {
      continue;
    }

    const entries = await readdir(statusPath);

    for (const entry of entries) {
      const parsedNumber = parseTaskNumber(entry);

      if (parsedNumber !== null) {
        numbers.push(parsedNumber);
      }
    }
  }

  return (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
}

async function getNextWorkItemIds(tasksRoot: string): Promise<WorkItemIdPreview> {
  const latest = {
    task: 0,
    bug: 0
  };

  for (const directory of taskStatuses) {
    const statusPath = path.join(tasksRoot, directory);

    if (!(await pathExists(statusPath))) {
      continue;
    }

    const entries = (await readdir(statusPath)).filter((entry) => entry.endsWith(".md"));

    for (const entry of entries) {
      const filePath = path.join(statusPath, entry);
      const contents = await readFile(filePath, "utf8");
      const identifier =
        readFrontmatterValue(contents, "id") || entry.replace(/\.md$/, "");
      const parsedNumber = parseWorkItemNumber(identifier);

      if (parsedNumber === null) {
        continue;
      }

      if (identifier.startsWith("BUG-")) {
        latest.bug = Math.max(latest.bug, parsedNumber);
      } else {
        latest.task = Math.max(latest.task, parsedNumber);
      }
    }
  }

  return {
    latestTaskId: latest.task > 0 ? `TASK-${String(latest.task).padStart(4, "0")}` : null,
    latestBugId: latest.bug > 0 ? `BUG-${String(latest.bug).padStart(4, "0")}` : null,
    nextTaskId: `TASK-${String(latest.task + 1).padStart(4, "0")}`,
    nextBugId: `BUG-${String(latest.bug + 1).padStart(4, "0")}`
  };
}

function formatTags(tags: string) {
  const cleanedTags = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return cleanedTags.length > 0 ? `[${cleanedTags.join(", ")}]` : "[]";
}

function formatAcceptanceCriteria(criteria: string) {
  return criteria
    .split("\n")
    .map((item) => item.replace(/^-+\s*/, "").trim())
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n");
}

function formatTaskMarkdown(taskId: string, task: TaskSavePayload) {
  const today = getTodayDate();
  const rankLine = task.rank.trim() ? `rank: ${task.rank.trim()}\n` : "";

  return `---
id: ${taskId}
title: ${task.title.trim()}
type: ${task.type}
status: ${task.status}
priority: ${task.priority}
${rankLine}owner: ${task.owner.trim()}
agent: ${task.agent.trim()}
created: ${today}
updated: ${today}
tags: ${formatTags(task.tags)}
related: []
---

## Summary
${task.summary.trim()}

## Why
${task.why.trim()}

## Acceptance Criteria
${formatAcceptanceCriteria(task.acceptanceCriteria)}

## Context
${task.context.trim() || "Add useful project or feature context here."}

## Notes
${task.notes.trim() || "Add implementation notes, reminders, or observations here."}

## Activity Log
- ${today}: Task created
`;
}

function upsertFrontmatterField(contents: string, field: string, value: string) {
  const pattern = new RegExp(`^${field}:\\s*.*$`, "m");

  if (pattern.test(contents)) {
    return contents.replace(pattern, `${field}: ${value}`);
  }

  return contents.replace(/^---\n/, `---\n${field}: ${value}\n`);
}

function removeFrontmatterField(contents: string, field: string) {
  return contents.replace(new RegExp(`^${field}:\\s*.*\\n`, "m"), "");
}

function upsertFrontmatterArrayField(contents: string, field: string, values: string[]) {
  const formattedValue = `[${values.join(", ")}]`;
  const pattern = new RegExp(`^${field}:\\s*.*$`, "m");

  if (pattern.test(contents)) {
    return contents.replace(pattern, `${field}: ${formattedValue}`);
  }

  return contents.replace(/^---\n/, `---\n${field}: ${formattedValue}\n`);
}

function upsertMarkdownSection(contents: string, heading: string, value: string) {
  const normalizedValue = value.trim();
  const replacement = `## ${heading}\n${normalizedValue}`;
  const pattern = new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |\\Z)`, "m");

  if (pattern.test(contents)) {
    return contents.replace(pattern, replacement);
  }

  return `${contents.replace(/\s*$/g, "")}\n\n${replacement}\n`;
}

function sanitizeGeneratedMarkdown(markdown: string) {
  let normalized = markdown.replace(/\r\n/g, "\n").trim();
  const fencedBlockMatch = normalized.match(/```(?:md|markdown)?\n([\s\S]*?)\n```/i);

  if (fencedBlockMatch) {
    normalized = fencedBlockMatch[1].trim();
  } else {
    normalized = normalized
      .replace(/^```(?:md|markdown)?\s*/i, "")
      .replace(/\n```$/i, "")
      .trim();
  }

  const frontmatterStart = normalized.match(/(?:^|\n)---\n/);

  if (frontmatterStart && frontmatterStart.index !== undefined && frontmatterStart.index > 0) {
    normalized = normalized.slice(frontmatterStart.index + 1).trimStart();
  }

  return normalized;
}

function extractTaskStructure(markdown: string) {
  const normalizedMarkdown = sanitizeGeneratedMarkdown(markdown);
  const frontmatterMatch = normalizedMarkdown.match(/^---\n([\s\S]*?)\n---/);

  const requiredSections = ["## Summary", "## Acceptance Criteria", "## Notes"];

  if (!frontmatterMatch) {
    const inferredTitle =
      normalizedMarkdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
      normalizedMarkdown.match(/^Title:\s*(.+)$/im)?.[1]?.trim() ||
      normalizedMarkdown.match(/^##\s+Summary\s*\n(.+)$/m)?.[1]?.trim() ||
      "Untitled task";
    const inferredType = /\bbug\b/i.test(normalizedMarkdown) ? "bug" : "task";
    const inferredPriority =
      normalizedMarkdown.match(/^Priority:\s*(low|medium|high)$/im)?.[1]?.toLowerCase() ||
      "medium";
    const inferredRank = normalizedMarkdown.match(/^Rank:\s*(\d+)$/im)?.[1] || "";

    for (const section of requiredSections) {
      if (!normalizedMarkdown.includes(section)) {
        throw new Error(`The markdown file is missing the required section: ${section}.`);
      }
    }

    const synthesizedFrontmatter = `---\ntitle: ${inferredTitle}\ntype: ${inferredType}\npriority: ${inferredPriority}${inferredRank ? `\nrank: ${inferredRank}` : ""}\n---\n\n`;

    return {
      title: inferredTitle,
      status: "backlog" as TaskStatus,
      type: inferredType,
      priority: inferredPriority,
      rank: inferredRank,
      markdown: `${synthesizedFrontmatter}${normalizedMarkdown}`.trim()
    };
  }

  const fields = Object.fromEntries(
    frontmatterMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");

        if (separatorIndex === -1) {
          return [line, ""];
        }

        return [
          line.slice(0, separatorIndex).trim(),
          line.slice(separatorIndex + 1).trim()
        ];
      })
  );

  for (const section of requiredSections) {
    if (!normalizedMarkdown.includes(section)) {
      throw new Error(`The markdown file is missing the required section: ${section}.`);
    }
  }

  if (!fields.title) {
    throw new Error("The markdown file is missing a title in frontmatter.");
  }

  return {
    title: fields.title,
    status: taskStatuses.includes(fields.status as TaskStatus)
      ? (fields.status as TaskStatus)
      : "backlog",
    type: fields.type || "task",
    priority: fields.priority || "medium",
    rank: fields.rank || "",
    markdown: normalizedMarkdown
  };
}

function normalizeImportedTaskMarkdown(markdown: string, taskId: string) {
  let normalized = markdown.replace(/\r\n/g, "\n");
  const today = getTodayDate();

  normalized = upsertFrontmatterField(normalized, "id", taskId);
  normalized = upsertFrontmatterField(normalized, "updated", today);

  if (!/^created:\s*.+$/m.test(normalized) || /^created:\s*YYYY-MM-DD$/m.test(normalized)) {
    normalized = upsertFrontmatterField(normalized, "created", today);
  }

  return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
}

function readFrontmatterArrayField(contents: string, field: string) {
  const match = contents.match(new RegExp(`^${field}:\\s*\\[(.*?)\\]\\s*$`, "m"));

  if (!match) {
    return [];
  }

  return match[1]
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseRank(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : null;
}

function getPriorityWeight(priority: string) {
  switch (priority) {
    case "high":
      return 0;
    case "medium":
      return 1;
    case "low":
      return 2;
    default:
      return 3;
  }
}

function getTaskStatusFromFilePath(filePath: string): TaskStatus | null {
  const parentDirectory = path.basename(path.dirname(filePath));
  return taskStatuses.includes(parentDirectory as TaskStatus)
    ? (parentDirectory as TaskStatus)
    : null;
}

async function handleGetWorkflowStatus(_: Electron.IpcMainInvokeEvent, projectPath: string) {
  const { primaryRoot } = getWorkflowPaths(projectPath);

  return {
    exists: await pathExists(primaryRoot),
    workflowRoot: primaryRoot
  };
}

async function handleReadProjectPlan(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const filePath = path.join(workflowRoot, "project-plan.md");

  if (!(await pathExists(filePath))) {
    throw new Error("The project plan file could not be found in 1-Stream.");
  }

  return {
    filePath,
    contents: await readFile(filePath, "utf8")
  } satisfies WorkflowDocument;
}

async function handleSaveProjectPlan(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string,
  contents: string
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const filePath = path.join(workflowRoot, "project-plan.md");

  if (!(await pathExists(filePath))) {
    throw new Error("The project plan file could not be found in 1-Stream.");
  }

  await writeFile(filePath, contents.endsWith("\n") ? contents : `${contents}\n`, {
    encoding: "utf8"
  });

  return {
    filePath,
    contents
  } satisfies WorkflowDocument;
}

async function handleInitializeWorkflow(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string,
  gitignoreMode: GitignoreMode
) {
  const { primaryRoot, legacyRoot } = getWorkflowPaths(projectPath);
  const primaryExists = await pathExists(primaryRoot);
  const legacyExists = await pathExists(legacyRoot);
  const existedBefore = primaryExists || legacyExists;
  let workflowRoot = primaryRoot;

  if (!primaryExists && legacyExists) {
    await rename(legacyRoot, primaryRoot);
  }

  await mkdir(workflowRoot, { recursive: true });

  for (const directory of workflowDirectories) {
    await mkdir(path.join(workflowRoot, directory), { recursive: true });
  }

  await migrateLegacyWorkflowStructure(workflowRoot);

  const files = await Promise.all(
    starterFiles.map(async (file) => ({
      relativePath: file.relativePath,
      status: await ensureFile(path.join(workflowRoot, file.relativePath), file.contents)
    }))
  );

  const gitignore =
    gitignoreMode === "ignore"
      ? await ensureGitignoreEntry(projectPath)
      : await removeGitignoreEntry(projectPath);

  return {
    existedBefore,
    workflowRoot,
    files,
    gitignore
  };
}

async function handleSaveTask(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string,
  task: TaskSavePayload
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");
  const targetDirectory = path.join(tasksRoot, task.status);

  if (!(await pathExists(workflowRoot))) {
    throw new Error("Initialize 1-Stream before saving tasks.");
  }

  await mkdir(targetDirectory, { recursive: true });

  const nextTaskNumber = await getNextTaskNumber(tasksRoot);
  const taskId = `TASK-${String(nextTaskNumber).padStart(4, "0")}`;
  const fileName = `${taskId}-${slugifyTitle(task.title)}.md`;
  const filePath = path.join(targetDirectory, fileName);

  await writeFile(filePath, formatTaskMarkdown(taskId, task), {
    encoding: "utf8",
    flag: "wx"
  });

  return {
    taskId,
    fileName,
    filePath
  };
}

function splitGeneratedMarkdownFiles(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .split(/\n?---TASK FILE---\n?/g)
    .map((entry) => sanitizeGeneratedMarkdown(entry))
    .filter(Boolean);
}

async function handleSaveGeneratedMarkdownTasks(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string,
  payload: SaveGeneratedMarkdownPayload
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");
  const targetDirectory = path.join(tasksRoot, "backlog");

  if (!(await pathExists(workflowRoot))) {
    throw new Error("Initialize 1-Stream before creating tasks with LM Studio.");
  }

  await mkdir(targetDirectory, { recursive: true });

  const entries = splitGeneratedMarkdownFiles(payload.markdown);

  if (entries.length === 0) {
    throw new Error("LM Studio did not return any markdown task content.");
  }

  const preview = await getNextWorkItemIds(tasksRoot);
  let nextTaskNumber = parseWorkItemNumber(preview.nextTaskId) ?? 1;
  let nextBugNumber = parseWorkItemNumber(preview.nextBugId) ?? 1;
  const createdItems: Array<{
    taskId: string;
    fileName: string;
    filePath: string;
  }> = [];

  for (const markdown of entries) {
    const parsedTask = extractTaskStructure(markdown);
    const type = parsedTask.type === "bug" ? "bug" : "task";
    const taskId =
      type === "bug"
        ? `BUG-${String(nextBugNumber++).padStart(4, "0")}`
        : `TASK-${String(nextTaskNumber++).padStart(4, "0")}`;
    const fileName = `${taskId}-${slugifyTitle(parsedTask.title)}.md`;
    const filePath = path.join(targetDirectory, fileName);
    let normalizedMarkdown = normalizeImportedTaskMarkdown(parsedTask.markdown, taskId);

    normalizedMarkdown = removeFrontmatterField(normalizedMarkdown, "status");

    await writeFile(filePath, normalizedMarkdown, {
      encoding: "utf8",
      flag: "wx"
    });

    createdItems.push({
      taskId,
      fileName,
      filePath
    });
  }

  return {
    createdItems
  };
}

async function handleUpdateTask(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string,
  payload: TaskUpdatePayload
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const backlogRoot = path.join(workflowRoot, "tasks", "backlog");

  if (!(await pathExists(payload.filePath))) {
    throw new Error("The selected backlog task no longer exists on disk.");
  }

  if (!payload.filePath.startsWith(`${backlogRoot}${path.sep}`)) {
    throw new Error("Only backlog tasks can be edited from the UI.");
  }

  const existingContents = await readFile(payload.filePath, "utf8");
  const today = getTodayDate();
  let updatedContents = existingContents.replace(/\r\n/g, "\n");

  updatedContents = upsertFrontmatterField(updatedContents, "title", payload.title.trim());
  updatedContents = upsertFrontmatterField(updatedContents, "type", payload.type);
  updatedContents = upsertFrontmatterField(
    updatedContents,
    "priority",
    payload.priority
  );
  updatedContents = upsertFrontmatterField(updatedContents, "updated", today);
  updatedContents = payload.rank.trim()
    ? upsertFrontmatterField(updatedContents, "rank", payload.rank.trim())
    : removeFrontmatterField(updatedContents, "rank");
  updatedContents = upsertMarkdownSection(
    updatedContents,
    "Summary",
    payload.summary
  );
  updatedContents = upsertMarkdownSection(
    updatedContents,
    "Acceptance Criteria",
    formatAcceptanceCriteria(payload.acceptanceCriteria)
  );
  updatedContents = upsertMarkdownSection(updatedContents, "Notes", payload.notes);

  await writeFile(
    payload.filePath,
    updatedContents.endsWith("\n") ? updatedContents : `${updatedContents}\n`,
    { encoding: "utf8" }
  );

  return {
    filePath: payload.filePath
  };
}

async function handleUploadTaskImages(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string,
  payload: TaskImageUploadPayload
) {
  if (payload.files.length === 0) {
    return {
      uploadedImageIds: [] as string[]
    };
  }

  if (!(await pathExists(payload.filePath))) {
    throw new Error("The selected task file no longer exists on disk.");
  }

  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const imagesDirectory = path.join(workflowRoot, "images");
  const existingContents = await readFile(payload.filePath, "utf8");
  const taskIdMatch = existingContents.match(/^id:\s*(.+)$/m);

  if (!taskIdMatch?.[1]?.trim()) {
    throw new Error("The selected task file is missing an id.");
  }

  const taskId = taskIdMatch[1].trim();
  const existingImageIds = readFrontmatterArrayField(existingContents, "images");
  const uploadedImageIds: string[] = [];

  for (const file of payload.files) {
    validateTaskImageUpload(file.fileName, file.mimeType, file.sizeBytes);
    const imageId = getNextTaskImageId(taskId, [...existingImageIds, ...uploadedImageIds]);
    await storeTaskImageFile(
      imagesDirectory,
      imageId,
      file.fileName,
      file.mimeType,
      file.base64Contents
    );
    uploadedImageIds.push(imageId);
  }

  const updatedContents = upsertFrontmatterField(
    upsertFrontmatterArrayField(
      existingContents,
      "images",
      [...existingImageIds, ...uploadedImageIds]
    ),
    "updated",
    getTodayDate()
  );

  await writeFile(
    payload.filePath,
    updatedContents.endsWith("\n") ? updatedContents : `${updatedContents}\n`,
    { encoding: "utf8" }
  );

  return {
    uploadedImageIds
  };
}

function readFrontmatterValue(contents: string, field: string) {
  const match = contents.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));

  return match?.[1]?.trim() ?? "";
}

function readSection(contents: string, heading: string) {
  const lines = contents.replace(/\r\n/g, "\n").split("\n");
  const headingLine = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === headingLine);

  if (startIndex === -1) {
    return "";
  }

  const collectedLines: string[] = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^##\s+/.test(line)) {
      break;
    }

    collectedLines.push(line);
  }

  return collectedLines.join("\n").trim();
}

function readListSection(contents: string, heading: string) {
  return readSection(contents, heading)
    .split("\n")
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .filter(Boolean);
}

async function readTasksForStatus(tasksRoot: string, status: TaskStatus) {
  const statusDirectory = path.join(tasksRoot, status);

  if (!(await pathExists(statusDirectory))) {
    return [];
  }

  const entries = (await readdir(statusDirectory)).filter((entry) =>
    entry.endsWith(".md")
  );

  const items: TaskBoardItem[] = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(statusDirectory, entry);
      const contents = await readFile(filePath, "utf8");

      return {
        id: readFrontmatterValue(contents, "id") || entry.replace(/\.md$/, ""),
        title: readFrontmatterValue(contents, "title") || "Untitled task",
        type: readFrontmatterValue(contents, "type") || "task",
        priority: readFrontmatterValue(contents, "priority") || "unknown",
        rank: parseRank(readFrontmatterValue(contents, "rank")),
        attachmentCount: readFrontmatterArrayField(contents, "images").length,
        owner: readFrontmatterValue(contents, "owner") || "unassigned",
        agent: readFrontmatterValue(contents, "agent") || "unassigned",
        status,
        filePath
      };
    })
  );

  return items.sort((left, right) => {
    if (left.rank !== null && right.rank !== null && left.rank !== right.rank) {
      return left.rank - right.rank;
    }

    if (left.rank !== null && right.rank === null) {
      return -1;
    }

    if (left.rank === null && right.rank !== null) {
      return 1;
    }

    const priorityDelta =
      getPriorityWeight(left.priority) - getPriorityWeight(right.priority);

    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    const leftNumber = parseWorkItemNumber(left.id);
    const rightNumber = parseWorkItemNumber(right.id);

    if (leftNumber !== null && rightNumber !== null && leftNumber !== rightNumber) {
      return rightNumber - leftNumber;
    }

    if (leftNumber !== null && rightNumber === null) {
      return -1;
    }

    if (leftNumber === null && rightNumber !== null) {
      return 1;
    }

    return right.id.localeCompare(left.id);
  });
}

async function handleListTasks(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");
  const statuses: TaskStatus[] = ["backlog", "doing", "blocked", "done"];

  return Promise.all(
    statuses.map(async (status) => ({
      status,
      tasks: await readTasksForStatus(tasksRoot, status)
    }))
  );
}

async function handleGetNextWorkItemIds(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");

  if (!(await pathExists(workflowRoot))) {
    return {
      latestTaskId: null,
      latestBugId: null,
      nextTaskId: "TASK-0001",
      nextBugId: "BUG-0001"
    } satisfies WorkItemIdPreview;
  }

  return getNextWorkItemIds(tasksRoot);
}

async function handleGetTaskDetail(
  _: Electron.IpcMainInvokeEvent,
  filePath: string
) {
  const contents = await readFile(filePath, "utf8");
  const inferredStatus = getTaskStatusFromFilePath(filePath);
  const workflowRoot = filePath.split(`${path.sep}tasks${path.sep}`)[0];
  const imagesDirectory = path.join(workflowRoot, "images");
  const imageIds = readFrontmatterArrayField(contents, "images");
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

  const images = await Promise.all(
    imageIds.map(async (imageId) => {
      let filePathForImage = path.join(imagesDirectory, imageId);

      for (const extension of imageExtensions) {
        const candidatePath = path.join(imagesDirectory, `${imageId}${extension}`);

        if (await pathExists(candidatePath)) {
          filePathForImage = candidatePath;
          break;
        }
      }

      return {
        id: imageId,
        filePath: filePathForImage,
        fileUrl: pathToFileURL(filePathForImage).toString()
      };
    })
  );

  return {
    id: readFrontmatterValue(contents, "id") || path.basename(filePath, ".md"),
    title: readFrontmatterValue(contents, "title") || "Untitled task",
    type: readFrontmatterValue(contents, "type") || "task",
    status:
      (readFrontmatterValue(contents, "status") as TaskStatus) ||
      inferredStatus ||
      "backlog",
    priority: readFrontmatterValue(contents, "priority") || "unknown",
    rank: parseRank(readFrontmatterValue(contents, "rank")),
    owner: readFrontmatterValue(contents, "owner"),
    agent: readFrontmatterValue(contents, "agent"),
    tags: readFrontmatterValue(contents, "tags"),
    related: readFrontmatterValue(contents, "related"),
    summary: readSection(contents, "Summary"),
    why: readSection(contents, "Why"),
    acceptanceCriteria: readListSection(contents, "Acceptance Criteria"),
    context: readSection(contents, "Context"),
    notes: readSection(contents, "Notes"),
    images,
    activityLog: readListSection(contents, "Activity Log"),
    filePath
  } satisfies TaskDetail;
}

async function handleGetNextActionableTask(
  _: Electron.IpcMainInvokeEvent,
  projectPath: string
) {
  const { primaryRoot: workflowRoot } = getWorkflowPaths(projectPath);
  const tasksRoot = path.join(workflowRoot, "tasks");

  if (!(await pathExists(workflowRoot))) {
    return null satisfies NextActionableTask;
  }

  const doingTasks = await readTasksForStatus(tasksRoot, "doing");

  if (doingTasks.length > 0) {
    const nextTask = doingTasks[0];

    return {
      id: nextTask.id,
      title: nextTask.title,
      type: nextTask.type,
      status: nextTask.status,
      priority: nextTask.priority,
      rank: nextTask.rank,
      filePath: nextTask.filePath
    } satisfies NextActionableTask;
  }

  const backlogTasks = await readTasksForStatus(tasksRoot, "backlog");

  if (backlogTasks.length === 0) {
    return null satisfies NextActionableTask;
  }

  const nextTask = backlogTasks[0];

  return {
    id: nextTask.id,
    title: nextTask.title,
    type: nextTask.type,
    status: nextTask.status,
    priority: nextTask.priority,
    rank: nextTask.rank,
    filePath: nextTask.filePath
  } satisfies NextActionableTask;
}

function createMainWindow() {
  const applicationIcon = getApplicationIcon() ?? undefined;

  const window = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#f5f1e8",
    title: appDisplayName,
    icon: applicationIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL as string);
    window.webContents.openDevTools({ mode: "detach" });
    window.webContents.on("context-menu", (_event, params) => {
      if (!params.isEditable && !params.selectionText) {
        return;
      }

      const menu = Menu.buildFromTemplate([
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut", enabled: params.editFlags.canCut },
        { role: "copy", enabled: params.editFlags.canCopy },
        { role: "paste", enabled: params.editFlags.canPaste },
        { role: "selectAll" }
      ]);

      menu.popup({
        window,
        x: params.x,
        y: params.y
      });
    });
    return window;
  }

  window.loadFile(path.join(__dirname, "../dist/index.html"));
  window.webContents.on("context-menu", (_event, params) => {
    if (!params.isEditable && !params.selectionText) {
      return;
    }

    const menu = Menu.buildFromTemplate([
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut", enabled: params.editFlags.canCut },
      { role: "copy", enabled: params.editFlags.canCopy },
      { role: "paste", enabled: params.editFlags.canPaste },
      { role: "selectAll" }
    ]);

    menu.popup({
      window,
      x: params.x,
      y: params.y
    });
  });
  return window;
}

app.whenReady().then(() => {
  configureApplicationIdentity();
  configureApplicationMenu();

  ipcMain.handle("project:get-default-path", handleGetDefaultProjectPath);
  ipcMain.handle("project:select-folder", handleSelectProjectFolder);
  ipcMain.handle("workflow:get-status", handleGetWorkflowStatus);
  ipcMain.handle("workflow:read-project-plan", handleReadProjectPlan);
  ipcMain.handle("workflow:save-project-plan", handleSaveProjectPlan);
  ipcMain.handle("workflow:initialize", handleInitializeWorkflow);
  ipcMain.handle("task:save", handleSaveTask);
  ipcMain.handle("task:update", handleUpdateTask);
  ipcMain.handle("task:delete", handleDeleteTask);
  ipcMain.handle("task:show-context-menu", handleShowTaskContextMenu);
  ipcMain.handle("task:list", handleListTasks);
  ipcMain.handle("task:watch-start", handleStartTaskWatch);
  ipcMain.handle("task:watch-stop", handleStopTaskWatch);
  ipcMain.handle("task:get-next-ids", handleGetNextWorkItemIds);
  ipcMain.handle("task:get-detail", handleGetTaskDetail);
  ipcMain.handle("task:upload-images", handleUploadTaskImages);
  ipcMain.handle("task:get-next-actionable", handleGetNextActionableTask);
  ipcMain.handle("task:save-generated-markdown", handleSaveGeneratedMarkdownTasks);
  ipcMain.handle("lmstudio:test-url", handleTestLmStudioUrl);
  ipcMain.handle("lmstudio:run-prompt", handleRunLmStudioPrompt);
  ipcMain.handle("app:open-external-url", handleOpenExternalUrl);
  const mainWindow = createMainWindow();
  mainWindow.webContents.on("destroyed", () => {
    cleanupTaskWatchSubscriptionsForSender(mainWindow.webContents.id);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const window = createMainWindow();
      window.webContents.on("destroyed", () => {
        cleanupTaskWatchSubscriptionsForSender(window.webContents.id);
      });
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  ipcMain.removeHandler("project:select-folder");
  ipcMain.removeHandler("project:get-default-path");
  ipcMain.removeHandler("workflow:get-status");
  ipcMain.removeHandler("workflow:read-project-plan");
  ipcMain.removeHandler("workflow:save-project-plan");
  ipcMain.removeHandler("workflow:initialize");
  ipcMain.removeHandler("task:save");
  ipcMain.removeHandler("task:update");
  ipcMain.removeHandler("task:delete");
  ipcMain.removeHandler("task:show-context-menu");
  ipcMain.removeHandler("task:list");
  ipcMain.removeHandler("task:watch-start");
  ipcMain.removeHandler("task:watch-stop");
  ipcMain.removeHandler("task:get-next-ids");
  ipcMain.removeHandler("task:get-detail");
  ipcMain.removeHandler("task:upload-images");
  ipcMain.removeHandler("task:get-next-actionable");
  ipcMain.removeHandler("task:save-generated-markdown");
  ipcMain.removeHandler("lmstudio:test-url");
  ipcMain.removeHandler("lmstudio:run-prompt");
  ipcMain.removeHandler("app:open-external-url");

  for (const tasksRoot of taskWatchStates.keys()) {
    cleanupTaskWatchState(tasksRoot);
  }
});
