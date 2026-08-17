import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("stream", {
  appName: "Stream",
  openExternalUrl: (targetUrl: string) =>
    ipcRenderer.invoke("app:open-external-url", targetUrl) as Promise<void>,
  getDefaultProjectPath: () =>
    ipcRenderer.invoke("project:get-default-path") as Promise<string>,
  selectProjectFolder: () => ipcRenderer.invoke("project:select-folder") as Promise<string | null>,
  getWorkflowStatus: (projectPath: string) =>
    ipcRenderer.invoke("workflow:get-status", projectPath) as Promise<{
      exists: boolean;
      workflowRoot: string;
    }>,
  readProjectPlan: (projectPath: string) =>
    ipcRenderer.invoke("workflow:read-project-plan", projectPath) as Promise<{
      filePath: string;
      contents: string;
    }>,
  saveProjectPlan: (projectPath: string, contents: string) =>
    ipcRenderer.invoke("workflow:save-project-plan", projectPath, contents) as Promise<{
      filePath: string;
      contents: string;
    }>,
  initializeWorkflow: (
    projectPath: string,
    gitignoreMode: "track" | "ignore"
  ) =>
    ipcRenderer.invoke("workflow:initialize", projectPath, gitignoreMode) as Promise<{
      existedBefore: boolean;
      workflowRoot: string;
      files: Array<{
        relativePath: string;
        status: "created" | "skipped";
      }>;
      gitignore: {
        status: "created" | "updated" | "removed" | "unchanged";
        path: string;
      } | null;
    }>,
  saveTask: (
    projectPath: string,
    task: {
      title: string;
      type: "task" | "bug" | "chore" | "research";
      status: "backlog" | "doing" | "blocked" | "done";
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
    }
  ) =>
    ipcRenderer.invoke("task:save", projectPath, task) as Promise<{
      taskId: string;
      fileName: string;
      filePath: string;
    }>,
  updateTask: (
    projectPath: string,
    task: {
      filePath: string;
      title: string;
      type: "task" | "bug" | "chore" | "research";
      priority: "low" | "medium" | "high";
      rank: string;
      summary: string;
      acceptanceCriteria: string;
      notes: string;
    }
  ) =>
    ipcRenderer.invoke("task:update", projectPath, task) as Promise<{
      filePath: string;
    }>,
  deleteTask: (filePath: string) =>
    ipcRenderer.invoke("task:delete", filePath) as Promise<{
      filePath: string;
    }>,
  showTaskContextMenu: (
    payload: {
      filePath: string;
      canEdit: boolean;
      x: number;
      y: number;
    }
  ) => ipcRenderer.invoke("task:show-context-menu", payload) as Promise<void>,
  getTaskDetail: (filePath: string) =>
    ipcRenderer.invoke("task:get-detail", filePath) as Promise<{
      id: string;
      title: string;
      type: string;
      status: "backlog" | "doing" | "blocked" | "done";
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
    }>,
  uploadTaskImages: (
    projectPath: string,
    payload: {
      filePath: string;
      files: Array<{
        fileName: string;
        mimeType: string;
        sizeBytes: number;
        base64Contents: string;
      }>;
    }
  ) =>
    ipcRenderer.invoke("task:upload-images", projectPath, payload) as Promise<{
      uploadedImageIds: string[];
    }>,
  getNextActionableTask: (projectPath: string) =>
    ipcRenderer.invoke("task:get-next-actionable", projectPath) as Promise<{
      id: string;
      title: string;
      type: string;
      status: "backlog" | "doing" | "blocked" | "done";
      priority: string;
      rank: number | null;
      filePath: string;
    } | null>,
  saveGeneratedMarkdownTasks: (
    projectPath: string,
    payload: { markdown: string }
  ) =>
    ipcRenderer.invoke("task:save-generated-markdown", projectPath, payload) as Promise<{
      createdItems: Array<{
        taskId: string;
        fileName: string;
        filePath: string;
      }>;
    }>,
  testLmStudioUrl: (url: string) =>
    ipcRenderer.invoke("lmstudio:test-url", url) as Promise<{
      ok: boolean;
      model: string;
    }>,
  listTasks: (projectPath: string) =>
    ipcRenderer.invoke("task:list", projectPath) as Promise<
      Array<{
        status: "backlog" | "doing" | "blocked" | "done";
        tasks: Array<{
          id: string;
          title: string;
          type: string;
          priority: string;
          rank: number | null;
          owner: string;
          agent: string;
          status: "backlog" | "doing" | "blocked" | "done";
          filePath: string;
        }>;
      }>
    >,
  subscribeToTaskChanges: (
    projectPath: string,
    listener: () => void
  ) => {
    const wrappedListener = (
      _: Electron.IpcRendererEvent,
      payload: { projectPath: string }
    ) => {
      if (payload.projectPath === projectPath) {
        listener();
      }
    };

    ipcRenderer.on("task:filesystem-changed", wrappedListener);
    void ipcRenderer.invoke("task:watch-start", projectPath);

    return () => {
      ipcRenderer.removeListener("task:filesystem-changed", wrappedListener);
      void ipcRenderer.invoke("task:watch-stop", projectPath);
    };
  },
  subscribeToTaskContextActions: (
    listener: (payload: { action: "view" | "edit" | "delete"; filePath: string }) => void
  ) => {
    const wrappedListener = (
      _: Electron.IpcRendererEvent,
      payload: { action: "view" | "edit" | "delete"; filePath: string }
    ) => {
      listener(payload);
    };

    ipcRenderer.on("task:context-action", wrappedListener);

    return () => {
      ipcRenderer.removeListener("task:context-action", wrappedListener);
    };
  },
  runLmStudioPrompt: (
    payload: { url: string; prompt: string }
  ) =>
    ipcRenderer.invoke("lmstudio:run-prompt", payload) as Promise<{
      markdown: string;
    }>,
  getNextWorkItemIds: (projectPath: string) =>
    ipcRenderer.invoke("task:get-next-ids", projectPath) as Promise<{
      latestTaskId: string | null;
      latestBugId: string | null;
      nextTaskId: string;
      nextBugId: string;
    }>
});
