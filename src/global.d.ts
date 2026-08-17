export {};

declare global {
  interface Window {
    stream: {
      appName: string;
      openExternalUrl: (targetUrl: string) => Promise<void>;
      getDefaultProjectPath: () => Promise<string>;
      selectProjectFolder: () => Promise<string | null>;
      getWorkflowStatus: (projectPath: string) => Promise<{
        exists: boolean;
        workflowRoot: string;
      }>;
      readProjectPlan: (projectPath: string) => Promise<{
        filePath: string;
        contents: string;
      }>;
      saveProjectPlan: (projectPath: string, contents: string) => Promise<{
        filePath: string;
        contents: string;
      }>;
      initializeWorkflow: (
        projectPath: string,
        gitignoreMode: "track" | "ignore"
      ) => Promise<{
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
      }>;
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
      ) => Promise<{
        taskId: string;
        fileName: string;
        filePath: string;
      }>;
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
      ) => Promise<{
        filePath: string;
      }>;
      deleteTask: (filePath: string) => Promise<{
        filePath: string;
      }>;
      showTaskContextMenu: (payload: {
        filePath: string;
        canEdit: boolean;
        x: number;
        y: number;
      }) => Promise<void>;
      getTaskDetail: (filePath: string) => Promise<{
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
      }>;
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
      ) => Promise<{
        uploadedImageIds: string[];
      }>;
      getNextActionableTask: (projectPath: string) => Promise<{
        id: string;
        title: string;
        type: string;
        status: "backlog" | "doing" | "blocked" | "done";
        priority: string;
        rank: number | null;
        filePath: string;
      } | null>;
      saveGeneratedMarkdownTasks: (
        projectPath: string,
        payload: {
          markdown: string;
        }
      ) => Promise<{
        createdItems: Array<{
          taskId: string;
          fileName: string;
          filePath: string;
        }>;
      }>;
      testLmStudioUrl: (url: string) => Promise<{
        ok: boolean;
        model: string;
      }>;
      listTasks: (projectPath: string) => Promise<
        Array<{
          status: "backlog" | "doing" | "blocked" | "done";
          tasks: Array<{
            id: string;
            title: string;
            type: string;
            priority: string;
            rank: number | null;
            attachmentCount: number;
            owner: string;
            agent: string;
            status: "backlog" | "doing" | "blocked" | "done";
            filePath: string;
          }>;
        }>
      >;
      subscribeToTaskChanges: (
        projectPath: string,
        listener: () => void
      ) => () => void;
      subscribeToTaskContextActions: (
        listener: (payload: {
          action: "view" | "edit" | "delete";
          filePath: string;
        }) => void
      ) => () => void;
      runLmStudioPrompt: (payload: {
        url: string;
        prompt: string;
      }) => Promise<{
        markdown: string;
      }>;
      getNextWorkItemIds: (projectPath: string) => Promise<{
        latestTaskId: string | null;
        latestBugId: string | null;
        nextTaskId: string;
        nextBugId: string;
      }>;
    };
  }
}
