import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import appStyles from "./App.module.scss";
import { Modal } from "./components/Modal";
import { Sidebar, type ViewMode } from "./components/Sidebar";
import { buildAutoAttachMessages, buildSelectedProjectMessages } from "./features/project/messages";
import { boardStatuses } from "./features/tasks/constants";
import { initialTaskForm, validateTaskForm } from "./features/tasks/formState";
import { buildTaskBreakdownPrompt, createSequentialTaskPlan } from "./features/tasks/lmStudioPlanning";
import { buildTaskPrompt } from "./features/tasks/prompt";
import type {
  PendingTaskImage,
  SavedTaskDetails,
  TaskBoardCard,
  TaskBoardColumn,
  TaskDetail,
  TaskFormData,
  TaskFormErrors,
  TaskFormMode
} from "./features/tasks/types";
import { buildInitializationMessages } from "./features/workflow/messages";
import type { GitignoreMode, WorkflowState } from "./features/workflow/types";
import { HomePage } from "./pages/HomePage";
import { ProjectPlanPage } from "./pages/ProjectPlanPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TaskBoardPage } from "./pages/TaskBoardPage";
import { getStreamMethod } from "./services/stream";

type WorkItemIdPreview = {
  latestTaskId: string | null;
  latestBugId: string | null;
  nextTaskId: string;
  nextBugId: string;
};

type AppTheme = "light" | "dark";

type ProjectPlanDocument = {
  filePath: string;
  contents: string;
};

function createEmptyBoardColumns(): TaskBoardColumn[] {
  return boardStatuses.map((status) => ({ status, tasks: [] }));
}

const defaultWorkItemIdPreview: WorkItemIdPreview = {
  latestTaskId: null,
  latestBugId: null,
  nextTaskId: "TASK-0001",
  nextBugId: "BUG-0001"
};

const smallScreenSidenavBreakpoint = 768;
const themeStorageKey = "stream-theme";
const maxPendingTaskImageSizeBytes = 10 * 1024 * 1024;
const supportedPendingTaskImageMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif"
]);

function getInitialTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  return storedTheme === "dark" ? "dark" : "light";
}

function validateLmStudioUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  try {
    const parsed = new URL(trimmedValue);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Use an http:// or https:// URL.";
    }

    return "";
  } catch {
    return "Enter a valid LM Studio server URL.";
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function createPendingTaskImageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `pending-image-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function App() {
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < smallScreenSidenavBreakpoint;
  });
  const [activeView, setActiveView] = useState<ViewMode>("home");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isPickingFolder, setIsPickingFolder] = useState(false);
  const [workflowState, setWorkflowState] = useState<WorkflowState>(null);
  const [isInitializingWorkflow, setIsInitializingWorkflow] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Choose an existing project folder to begin working with Stream."
  );
  const [generatedFilesSummary, setGeneratedFilesSummary] = useState(
    "Starter workflow files will appear here after initialization."
  );
  const [lmStudioUrlDraft, setLmStudioUrlDraft] = useState("");
  const [lmStudioUrl, setLmStudioUrl] = useState("");
  const [lmStudioUrlError, setLmStudioUrlError] = useState("");
  const [lmStudioMessage, setLmStudioMessage] = useState(
    "No LM Studio URL configured yet."
  );
  const [lmStudioVerifiedUrl, setLmStudioVerifiedUrl] = useState("");
  const [lmStudioVerifiedModel, setLmStudioVerifiedModel] = useState("");
  const [isTestingLmStudioUrl, setIsTestingLmStudioUrl] = useState(false);
  const [isRunningLmStudio, setIsRunningLmStudio] = useState(false);
  const [gitignoreMode, setGitignoreMode] = useState<GitignoreMode>("track");
  const [gitignoreSummary, setGitignoreSummary] = useState(
    "Workflow files will stay tracked, and re-initialize will remove any existing 1-Stream ignore entry unless you choose to ignore them."
  );
  const [taskForm, setTaskForm] = useState<TaskFormData>(initialTaskForm);
  const [taskErrors, setTaskErrors] = useState<TaskFormErrors>({});
  const [savedTaskDetails, setSavedTaskDetails] = useState<SavedTaskDetails | null>(
    null
  );
  const [taskFormMessage, setTaskFormMessage] = useState(
    "Fill out the fields below to prepare a task for markdown generation."
  );
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<TaskFormMode>("create");
  const [editingTaskFilePath, setEditingTaskFilePath] = useState<string | null>(null);
  const [pendingTaskImages, setPendingTaskImages] = useState<PendingTaskImage[]>([]);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptSourceDescription, setPromptSourceDescription] = useState("");
  const [promptMessage, setPromptMessage] = useState(
    "Describe the work in plain language, then Stream will ask LM Studio to create the backlog item for you."
  );
  const [lmStudioDisabledWarning, setLmStudioDisabledWarning] = useState("");
  const [showLmStudioSettingsRedirectPrompt, setShowLmStudioSettingsRedirectPrompt] =
    useState(false);
  const [workItemIdPreview, setWorkItemIdPreview] = useState<WorkItemIdPreview>(
    defaultWorkItemIdPreview
  );
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskDetail | null>(
    null
  );
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isLoadingTaskDetail, setIsLoadingTaskDetail] = useState(false);
  const [isUploadingTaskImages, setIsUploadingTaskImages] = useState(false);
  const [taskDetailMessage, setTaskDetailMessage] = useState("");
  const [boardColumns, setBoardColumns] = useState<TaskBoardColumn[]>(
    createEmptyBoardColumns()
  );
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);
  const [boardMessage, setBoardMessage] = useState(
    "Choose a project and open the task board to review workflow items."
  );
  const [projectPlanDocument, setProjectPlanDocument] = useState<ProjectPlanDocument | null>(null);
  const [projectPlanMessage, setProjectPlanMessage] = useState(
    "Open the project plan from 1-Stream to read it here."
  );
  const [isEditingProjectPlan, setIsEditingProjectPlan] = useState(false);
  const [editedProjectPlanContents, setEditedProjectPlanContents] = useState("");
  const [isSavingProjectPlan, setIsSavingProjectPlan] = useState(false);
  const [nextTaskPromptMessage, setNextTaskPromptMessage] = useState("");
  const pendingTaskImagesRef = useRef<PendingTaskImage[]>([]);
  const hasSelectedFolder = Boolean(selectedFolder);
  const workflowExists = workflowState?.exists ?? false;
  const isLmStudioVerified =
    Boolean(lmStudioUrl.trim()) &&
    !lmStudioUrlError &&
    lmStudioVerifiedUrl === lmStudioUrl.trim();
  const lmStudioDisabledReason = !hasSelectedFolder || !workflowExists
    ? "Generate LM Studio Task is unavailable until a project is attached and 1-Stream is initialized."
    : !lmStudioUrl.trim()
      ? ""
      : lmStudioUrlError
        ? "Generate LM Studio Task is unavailable until the LM Studio URL is valid."
        : !isLmStudioVerified
          ? "Generate LM Studio Task is unavailable until the saved LM Studio URL has been tested successfully."
          : "";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    pendingTaskImagesRef.current = pendingTaskImages;
  }, [pendingTaskImages]);

  useEffect(() => {
    return () => {
      pendingTaskImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  function clearPendingTaskImages() {
    setPendingTaskImages((currentImages) => {
      currentImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });

      return [];
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(
      `(max-width: ${smallScreenSidenavBreakpoint - 1}px)`
    );

    function handleMediaQueryChange(event: MediaQueryListEvent | MediaQueryList) {
      setIsSidebarCollapsed(event.matches);
    }

    handleMediaQueryChange(mediaQuery);

    const listener = (event: MediaQueryListEvent) => {
      handleMediaQueryChange(event);
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    const error = validateLmStudioUrl(lmStudioUrlDraft);
    setLmStudioUrlError(error);
  }, [lmStudioUrlDraft]);

  async function refreshBoardData(projectPath: string, reason?: "watch") {
    await Promise.all([loadBoard(projectPath), loadWorkItemIdPreview(projectPath)]);

    if (reason === "watch") {
      setBoardMessage("Board updated automatically from filesystem changes.");
    }
  }

  async function loadBoard(projectPath: string) {
    setIsLoadingBoard(true);

    try {
      const listTasks = getStreamMethod("listTasks");
      const nextColumns = await listTasks(projectPath);
      setBoardColumns(nextColumns);
      const totalTasks = nextColumns.reduce(
        (count, column) => count + column.tasks.length,
        0
      );
      setBoardMessage(
        totalTasks > 0
          ? `Loaded ${totalTasks} task${totalTasks === 1 ? "" : "s"} from the workflow folders.`
          : "No tasks are stored yet. Create one from the board to populate the columns."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The task board could not be loaded.";
      setBoardColumns(createEmptyBoardColumns());
      setBoardMessage(`Unable to load tasks: ${message}`);
    } finally {
      setIsLoadingBoard(false);
    }
  }

  async function loadWorkItemIdPreview(projectPath: string) {
    try {
      const getNextWorkItemIds = getStreamMethod("getNextWorkItemIds");
      const preview = await getNextWorkItemIds(projectPath);
      setWorkItemIdPreview(preview);
    } catch {
      setWorkItemIdPreview(defaultWorkItemIdPreview);
    }
  }

  useEffect(() => {
    async function attachDefaultProject() {
      try {
        const getDefaultProjectPath = getStreamMethod("getDefaultProjectPath");
        const getWorkflowStatus = getStreamMethod("getWorkflowStatus");
        const projectPath = await getDefaultProjectPath();
        const nextWorkflowState = await getWorkflowStatus(projectPath);
        const messages = buildAutoAttachMessages(nextWorkflowState);

        setSelectedFolder(projectPath);
        setWorkflowState(nextWorkflowState);
        setGeneratedFilesSummary(messages.generatedFilesSummary);
        setFeedbackMessage(messages.feedbackMessage);
        setBoardMessage(messages.boardMessage);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "The current workspace could not be attached automatically.";
        setFeedbackMessage(message);
        setBoardMessage("Choose a project and open the task board to review workflow items.");
      }
    }

    void attachDefaultProject();
  }, []);

  useEffect(() => {
    if (activeView === "board" && selectedFolder && workflowExists) {
      void refreshBoardData(selectedFolder);
    }
  }, [activeView, selectedFolder, workflowExists]);

  useEffect(() => {
    if (!lmStudioDisabledWarning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLmStudioDisabledWarning("");
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [lmStudioDisabledWarning]);

  useEffect(() => {
    if (!nextTaskPromptMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNextTaskPromptMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [nextTaskPromptMessage]);

  useEffect(() => {
    if (activeView === "projectPlan" && selectedFolder && workflowExists) {
      setProjectPlanMessage("Loading the project plan...");
      const readProjectPlan = getStreamMethod("readProjectPlan");

      void readProjectPlan(selectedFolder)
        .then((document) => {
          setProjectPlanDocument(document);
          setEditedProjectPlanContents(document.contents);
          setIsEditingProjectPlan(false);
          setProjectPlanMessage(`Viewing ${document.filePath}`);
        })
        .catch((error) => {
          const message =
            error instanceof Error ? error.message : "The project plan could not be loaded.";
          setProjectPlanDocument(null);
          setProjectPlanMessage(message);
        });
    }
  }, [activeView, selectedFolder, workflowExists]);

  useEffect(() => {
    if (activeView !== "board" || !selectedFolder || !workflowExists) {
      return;
    }

    const subscribeToTaskChanges = getStreamMethod("subscribeToTaskChanges");
    const unsubscribe = subscribeToTaskChanges(selectedFolder, () => {
      void refreshBoardData(selectedFolder, "watch");
    });

    return () => {
      unsubscribe();
    };
  }, [activeView, selectedFolder, workflowExists]);

  function resetTaskComposer() {
    clearPendingTaskImages();
    setTaskForm(initialTaskForm);
    setTaskErrors({});
    setTaskFormMode("create");
    setEditingTaskFilePath(null);
    setTaskFormMessage(
      "Fill out the fields below to prepare a task for markdown generation."
    );
  }

  function resetPromptComposer() {
    setPromptSourceDescription("");
    setPromptMessage(
      "Describe the work in plain language, then Stream will ask LM Studio to create the backlog item for you."
    );
  }

  function openTaskModal() {
    resetTaskComposer();
    setIsTaskModalOpen(true);
  }

  function openEditTaskModal() {
    if (!selectedTaskDetail || selectedTaskDetail.status !== "backlog") {
      return;
    }

    clearPendingTaskImages();
    setTaskFormMode("edit");
    setEditingTaskFilePath(selectedTaskDetail.filePath);
    setTaskForm({
      title: selectedTaskDetail.title,
      type: selectedTaskDetail.type as TaskFormData["type"],
      status: "backlog",
      priority: selectedTaskDetail.priority as TaskFormData["priority"],
      rank: selectedTaskDetail.rank !== null ? String(selectedTaskDetail.rank) : "",
      owner: selectedTaskDetail.owner,
      agent: selectedTaskDetail.agent,
      tags: selectedTaskDetail.tags,
      summary: selectedTaskDetail.summary,
      why: selectedTaskDetail.why,
      acceptanceCriteria: selectedTaskDetail.acceptanceCriteria.join("\n"),
      context: selectedTaskDetail.context,
      notes: selectedTaskDetail.notes
    });
    setTaskErrors({});
    setTaskFormMessage("Update the backlog task fields and save the markdown file.");
    setIsTaskDetailOpen(false);
    setIsTaskModalOpen(true);
  }

  function closeTaskModal(force = false) {
    if (isSavingTask && !force) {
      return;
    }

    setIsTaskModalOpen(false);
    resetTaskComposer();
  }

  function openPromptModal() {
    resetPromptComposer();
    if (selectedFolder && workflowExists) {
      void loadWorkItemIdPreview(selectedFolder);
    }
    setIsPromptModalOpen(true);
  }

  function closePromptModal() {
    setIsPromptModalOpen(false);
    resetPromptComposer();
  }

  function handleDisabledLmStudioAttempt() {
    if (!selectedFolder || !workflowExists) {
      setLmStudioDisabledWarning(
        "Generate LM Studio Task is unavailable until a project is attached and 1-Stream is initialized."
      );
      return;
    }

    if (!lmStudioUrl.trim()) {
      setLmStudioDisabledWarning("");
      setShowLmStudioSettingsRedirectPrompt(true);
      return;
    }

    if (!lmStudioDisabledReason) {
      return;
    }

    setLmStudioDisabledWarning(lmStudioDisabledReason);
  }

  function handleDismissLmStudioWarning() {
    setLmStudioDisabledWarning("");
  }

  function handleAcknowledgeLmStudioSettingsRedirect() {
    setShowLmStudioSettingsRedirectPrompt(false);
    setActiveView("settings");
  }

  function handleCloseLmStudioSettingsRedirectPrompt() {
    setShowLmStudioSettingsRedirectPrompt(false);
  }

  function closeTaskDetailModal() {
    if (isLoadingTaskDetail) {
      return;
    }

    setIsTaskDetailOpen(false);
    setSelectedTaskDetail(null);
    setTaskDetailMessage("");
  }

  async function handleSelectFolder() {
    setIsPickingFolder(true);

    try {
      const selectProjectFolder = getStreamMethod("selectProjectFolder");
      const getWorkflowStatus = getStreamMethod("getWorkflowStatus");
      const folderPath = await selectProjectFolder();

      if (!folderPath) {
        return;
      }

      const nextWorkflowState = await getWorkflowStatus(folderPath);
      const messages = buildSelectedProjectMessages(nextWorkflowState);

      setSelectedFolder(folderPath);
      setWorkflowState(nextWorkflowState);
      setSavedTaskDetails(null);
      setBoardColumns(createEmptyBoardColumns());
      setBoardMessage(messages.boardMessage);
      setGeneratedFilesSummary(messages.generatedFilesSummary);
      setFeedbackMessage(messages.feedbackMessage);
      setWorkItemIdPreview(defaultWorkItemIdPreview);
    } finally {
      setIsPickingFolder(false);
    }
  }

  async function handleInitializeWorkflow() {
    if (!selectedFolder) {
      return;
    }

    setIsInitializingWorkflow(true);

    try {
      const initializeWorkflow = getStreamMethod("initializeWorkflow");
      const result = await initializeWorkflow(selectedFolder, gitignoreMode);
      const messages = buildInitializationMessages(result);

      setWorkflowState({
        exists: true,
        workflowRoot: result.workflowRoot
      });
      setGeneratedFilesSummary(messages.generatedFilesSummary);
      setGitignoreSummary(messages.gitignoreSummary);
      setBoardMessage(messages.boardMessage);
      setFeedbackMessage(messages.feedbackMessage);
      await loadWorkItemIdPreview(selectedFolder);
    } finally {
      setIsInitializingWorkflow(false);
    }
  }

  function handleTaskFieldChange<K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) {
    setTaskForm((current) => ({
      ...current,
      [field]: value
    }));
    setTaskErrors((current) => ({
      ...current,
      [field]: undefined
    }));
    setSavedTaskDetails(null);
  }

  function handlePendingTaskImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const validImages: PendingTaskImage[] = [];
    const rejectedMessages: string[] = [];

    for (const file of files) {
      if (!supportedPendingTaskImageMimeTypes.has(file.type)) {
        rejectedMessages.push(
          `${file.name} uses an unsupported format. Use PNG, JPEG, WEBP, or GIF.`
        );
        continue;
      }

      if (file.size > maxPendingTaskImageSizeBytes) {
        rejectedMessages.push(`${file.name} exceeds the 10 MB upload limit.`);
        continue;
      }

      validImages.push({
        id: createPendingTaskImageId(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }

    if (validImages.length > 0) {
      setPendingTaskImages((currentImages) => [...currentImages, ...validImages]);
      setTaskFormMessage(
        rejectedMessages.length > 0
          ? `Added ${validImages.length} image(s). ${rejectedMessages[0]}`
          : `Added ${validImages.length} image${validImages.length === 1 ? "" : "s"} to upload after task creation.`
      );
    } else if (rejectedMessages.length > 0) {
      setTaskFormMessage(rejectedMessages[0]);
    }

    event.target.value = "";
  }

  function handleRemovePendingTaskImage(imageId: string) {
    setPendingTaskImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return currentImages.filter((image) => image.id !== imageId);
    });
  }

  function handleToggleSidebar() {
    setIsSidebarCollapsed((current) => !current);
  }

  function handleLmStudioUrlChange(value: string) {
    const error = validateLmStudioUrl(value);
    const trimmedValue = value.trim();

    setLmStudioUrlDraft(value);
    setLmStudioUrlError(error);
    setLmStudioVerifiedUrl("");
    setLmStudioVerifiedModel("");

    if (!trimmedValue) {
      setLmStudioMessage("No LM Studio URL configured yet.");
      return;
    }

    if (error) {
      setLmStudioMessage("The LM Studio URL is not usable yet.");
      return;
    }

    setLmStudioMessage("Save and test the LM Studio URL before generating tasks.");
  }

  function handleClearLmStudioUrl() {
    setLmStudioUrlDraft("");
    setLmStudioUrl("");
    setLmStudioUrlError("");
    setLmStudioVerifiedUrl("");
    setLmStudioVerifiedModel("");
    setLmStudioMessage("No LM Studio URL configured yet.");
  }

  function handleSaveLmStudioUrl() {
    const trimmedValue = lmStudioUrlDraft.trim();
    const error = validateLmStudioUrl(trimmedValue);

    setLmStudioUrlError(error);

    if (error) {
      setLmStudioMessage("Fix the LM Studio URL before saving.");
      return;
    }

    setLmStudioUrl(trimmedValue);
    setLmStudioVerifiedUrl("");
    setLmStudioVerifiedModel("");
    setLmStudioMessage(
      trimmedValue
        ? "LM Studio URL saved for this session. Test it before creating tasks."
        : "No LM Studio URL configured yet."
    );
    setActiveView("settings");
  }

  async function handleTestLmStudioUrl() {
    const trimmedValue = lmStudioUrlDraft.trim();
    const error = validateLmStudioUrl(trimmedValue);

    setLmStudioUrlError(error);

    if (error || !trimmedValue) {
      setLmStudioMessage("Enter a valid LM Studio URL before testing.");
      return;
    }

    setIsTestingLmStudioUrl(true);
    setLmStudioMessage("Testing LM Studio connectivity...");

    try {
      const testLmStudioUrl = getStreamMethod("testLmStudioUrl");
      const result = await testLmStudioUrl(trimmedValue);
      setLmStudioUrl(trimmedValue);
      setLmStudioVerifiedUrl(trimmedValue);
      setLmStudioVerifiedModel(result.model);
      setLmStudioMessage(`LM Studio verified successfully with model ${result.model}.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "LM Studio URL verification failed.";
      setLmStudioVerifiedUrl("");
      setLmStudioVerifiedModel("");
      setLmStudioMessage(message);
    } finally {
      setIsTestingLmStudioUrl(false);
    }
  }

  function handleToggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  async function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateTaskForm(taskForm, taskFormMode);
    setTaskErrors(errors);

    if (Object.keys(errors).length > 0) {
      setTaskFormMessage(
        "A few required fields still need attention before the task can be saved."
      );
      return;
    }

    if (!selectedFolder || !workflowExists) {
      setTaskFormMessage(
        "Choose a project and initialize 1-Stream before saving tasks."
      );
      return;
    }

    setIsSavingTask(true);

    try {
      let postSaveBoardMessage = "";

      if (taskFormMode === "edit" && editingTaskFilePath) {
        const updateTask = getStreamMethod("updateTask");
        await updateTask(selectedFolder, {
          filePath: editingTaskFilePath,
          title: taskForm.title,
          type: taskForm.type,
          priority: taskForm.priority,
          rank: taskForm.rank,
          summary: taskForm.summary,
          acceptanceCriteria: taskForm.acceptanceCriteria,
          notes: taskForm.notes
        });
        setTaskFormMessage(`Saved changes to ${taskForm.title}.`);
      } else {
        const saveTask = getStreamMethod("saveTask");
        const saveResult = await saveTask(selectedFolder, taskForm);
        const pendingImageCount = pendingTaskImages.length;
        setSavedTaskDetails(saveResult);
        setTaskFormMessage(
          pendingImageCount > 0
            ? `Saved ${saveResult.taskId}. Uploading ${pendingImageCount} image${pendingImageCount === 1 ? "" : "s"}...`
            : `Saved ${saveResult.taskId} to ${taskForm.status}.`
        );

        if (pendingImageCount > 0) {
          try {
            const uploadTaskImages = getStreamMethod("uploadTaskImages");
            const payloadFiles = await Promise.all(
              pendingTaskImages.map(async (image) => ({
                fileName: image.file.name,
                mimeType: image.file.type,
                sizeBytes: image.file.size,
                base64Contents: arrayBufferToBase64(await image.file.arrayBuffer())
              }))
            );

            await uploadTaskImages(selectedFolder, {
              filePath: saveResult.filePath,
              files: payloadFiles
            });
            setTaskFormMessage(
              `Saved ${saveResult.taskId} to ${taskForm.status} with ${pendingImageCount} image${pendingImageCount === 1 ? "" : "s"}.`
            );
            postSaveBoardMessage =
              `Saved ${saveResult.taskId} to ${taskForm.status} with ${pendingImageCount} image${pendingImageCount === 1 ? "" : "s"}.`
          } catch (uploadError) {
            const uploadMessage =
              uploadError instanceof Error
                ? uploadError.message
                : "The task was created, but the image upload failed.";
            setTaskFormMessage(
              `Saved ${saveResult.taskId}, but image upload failed: ${uploadMessage}`
            );
            postSaveBoardMessage =
              `Saved ${saveResult.taskId}, but image upload failed: ${uploadMessage}`
          }
        } else {
          postSaveBoardMessage = `Saved ${saveResult.taskId} to ${taskForm.status}.`;
        }
      }
      await refreshBoardData(selectedFolder);
      if (postSaveBoardMessage) {
        setBoardMessage(postSaveBoardMessage);
      }
      if (taskFormMode === "edit" && editingTaskFilePath) {
        const getTaskDetail = getStreamMethod("getTaskDetail");
        const detail = await getTaskDetail(editingTaskFilePath);
        setSelectedTaskDetail(detail);
      }
      closeTaskModal(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the task.";
      setTaskFormMessage(message);
    } finally {
      setIsSavingTask(false);
    }
  }

  function handleToggleProjectPlanEditMode() {
    setIsEditingProjectPlan((currentValue) => !currentValue);
  }

  async function handleSaveProjectPlan() {
    if (!selectedFolder || !workflowExists) {
      setProjectPlanMessage("Choose a project and initialize 1-Stream before saving the plan.");
      return;
    }

    setIsSavingProjectPlan(true);

    try {
      const saveProjectPlan = getStreamMethod("saveProjectPlan");
      const document = await saveProjectPlan(selectedFolder, editedProjectPlanContents);
      setProjectPlanDocument(document);
      setEditedProjectPlanContents(document.contents);
      setIsEditingProjectPlan(false);
      setProjectPlanMessage(`Saved ${document.filePath}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The project plan could not be saved.";
      setProjectPlanMessage(message);
    } finally {
      setIsSavingProjectPlan(false);
    }
  }

  async function handleCopyNextTaskPrompt() {
    const prompt = "Please read stream.md and work on the next task";

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = prompt;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setNextTaskPromptMessage("Copied the next-task prompt to the clipboard.");
    } catch {
      setNextTaskPromptMessage("Copy failed. Please copy the prompt manually.");
    }
  }

  async function openTaskDetailByFilePath(filePath: string) {
    setIsTaskDetailOpen(true);
    setIsLoadingTaskDetail(true);
    setTaskDetailMessage("");

    try {
      const getTaskDetail = getStreamMethod("getTaskDetail");
      const detail = await getTaskDetail(filePath);
      setSelectedTaskDetail(detail);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The task detail could not be loaded.";
      setSelectedTaskDetail(null);
      setTaskDetailMessage(message);
    } finally {
      setIsLoadingTaskDetail(false);
    }
  }

  async function handleOpenTaskDetail(task: TaskBoardCard) {
    await openTaskDetailByFilePath(task.filePath);
  }

  async function handleUploadTaskImages(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0 || !selectedFolder || !selectedTaskDetail) {
      event.target.value = "";
      return;
    }

    setIsUploadingTaskImages(true);
    setTaskDetailMessage("Uploading task images...");

    try {
      const uploadTaskImages = getStreamMethod("uploadTaskImages");
      const payloadFiles = await Promise.all(
        Array.from(files).map(async (file) => ({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          base64Contents: arrayBufferToBase64(await file.arrayBuffer())
        }))
      );

      await uploadTaskImages(selectedFolder, {
        filePath: selectedTaskDetail.filePath,
        files: payloadFiles
      });
      await openTaskDetailByFilePath(selectedTaskDetail.filePath);
      setTaskDetailMessage("Task images uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The task images could not be uploaded.";
      setTaskDetailMessage(message);
    } finally {
      setIsUploadingTaskImages(false);
      event.target.value = "";
    }
  }

  async function openEditTaskModalByFilePath(filePath: string) {
    const getTaskDetail = getStreamMethod("getTaskDetail");
    const detail = await getTaskDetail(filePath);
    setSelectedTaskDetail(detail);

    if (detail.status === "backlog") {
      clearPendingTaskImages();
      setTaskFormMode("edit");
      setEditingTaskFilePath(detail.filePath);
      setTaskForm({
        title: detail.title,
        type: detail.type as TaskFormData["type"],
        status: "backlog",
        priority: detail.priority as TaskFormData["priority"],
        rank: detail.rank !== null ? String(detail.rank) : "",
        owner: detail.owner,
        agent: detail.agent,
        tags: detail.tags,
        summary: detail.summary,
        why: detail.why,
        acceptanceCriteria: detail.acceptanceCriteria.join("\n"),
        context: detail.context,
        notes: detail.notes
      });
      setTaskErrors({});
      setTaskFormMessage("Update the backlog task fields and save the markdown file.");
      setIsTaskDetailOpen(false);
      setIsTaskModalOpen(true);
    }
  }

  function handleOpenTaskContextMenu(
    task: TaskBoardCard,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    const showTaskContextMenu = getStreamMethod("showTaskContextMenu");
    void showTaskContextMenu({
      filePath: task.filePath,
      canEdit: task.status === "backlog",
      x: event.clientX,
      y: event.clientY
    });
  }

  async function handleRunLmStudio() {
    const trimmedUrl = lmStudioUrl.trim();

    if (!selectedFolder || !workflowExists) {
      setPromptMessage("Choose a project and initialize 1-Stream before creating tasks.");
      return;
    }

    if (!promptSourceDescription.trim()) {
      setPromptMessage("Add a plain-language task description first.");
      return;
    }

    if (!trimmedUrl || lmStudioUrlError || !isLmStudioVerified) {
      setPromptMessage("Save and verify the LM Studio URL in Settings before creating tasks.");
      return;
    }

    setIsRunningLmStudio(true);
    setPromptMessage("Asking LM Studio to break the request into task-sized summaries...");

    try {
      const runLmStudioPrompt = getStreamMethod("runLmStudioPrompt");
      const breakdownResult = await runLmStudioPrompt({
        url: trimmedUrl,
        prompt: buildTaskBreakdownPrompt(promptSourceDescription)
      });
      const taskSummaries = createSequentialTaskPlan(
        promptSourceDescription,
        breakdownResult.markdown
      );
      const saveGeneratedMarkdownTasks = getStreamMethod("saveGeneratedMarkdownTasks");
      const getNextWorkItemIds = getStreamMethod("getNextWorkItemIds");
      let currentWorkItemIds = workItemIdPreview;
      const createdItems: SavedTaskDetails[] = [];

      for (const [index, taskSummary] of taskSummaries.entries()) {
        setPromptMessage(
          taskSummaries.length > 1
            ? `Generating task ${index + 1} of ${taskSummaries.length} with LM Studio...`
            : "Generating the backlog item with LM Studio..."
        );

        const generatedPrompt = buildTaskPrompt(taskSummary, currentWorkItemIds, {
          singleTaskOnly: true
        });
        const lmStudioResult = await runLmStudioPrompt({
          url: trimmedUrl,
          prompt: generatedPrompt
        });
        const saveResult = await saveGeneratedMarkdownTasks(selectedFolder, {
          markdown: lmStudioResult.markdown
        });

        createdItems.push(...saveResult.createdItems);
        currentWorkItemIds = await getNextWorkItemIds(selectedFolder);
      }

      await refreshBoardData(selectedFolder);
      setWorkItemIdPreview(currentWorkItemIds);

      if (createdItems.length === 1) {
        const [createdItem] = createdItems;
        setSavedTaskDetails(createdItem);
        setBoardMessage(`Created ${createdItem.taskId} in backlog from LM Studio.`);
        closePromptModal();
        return;
      }

      setSavedTaskDetails(null);
      setBoardMessage(
        `Created ${createdItems.length} backlog items from LM Studio.`
      );
      closePromptModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "LM Studio request failed.";
      setPromptMessage(message);
    } finally {
      setIsRunningLmStudio(false);
    }
  }

  useEffect(() => {
    const subscribeToTaskContextActions = getStreamMethod("subscribeToTaskContextActions");
    const unsubscribe = subscribeToTaskContextActions((payload) => {
      if (payload.action === "view") {
        void openTaskDetailByFilePath(payload.filePath);
        return;
      }

      if (payload.action === "edit") {
        void openEditTaskModalByFilePath(payload.filePath);
        return;
      }

      if (payload.action === "delete") {
        const confirmed = window.confirm(
          "Delete this task file from the workflow?"
        );

        if (!confirmed) {
          return;
        }

        const deleteTask = getStreamMethod("deleteTask");
        void deleteTask(payload.filePath)
          .then(async () => {
            if (selectedFolder) {
              await refreshBoardData(selectedFolder);
            }

            if (selectedTaskDetail?.filePath === payload.filePath) {
              closeTaskDetailModal();
            }
          })
          .catch((error) => {
            const message =
              error instanceof Error ? error.message : "The task could not be deleted.";
            setBoardMessage(message);
          });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedFolder, selectedTaskDetail]);

  return (
    <div
      className={`${appStyles.appShell} ${isSidebarCollapsed ? appStyles.sidebarCollapsed : ""}`}
    >
      <Sidebar
        activeView={activeView}
        hasSelectedFolder={hasSelectedFolder}
        workflowExists={workflowExists}
        feedbackMessage={feedbackMessage}
        isCollapsed={isSidebarCollapsed}
        theme={theme}
        onToggleCollapse={handleToggleSidebar}
        onToggleTheme={handleToggleTheme}
        onViewChange={setActiveView}
      />

      <main className={appStyles.mainPanel}>
        {activeView === "home" ? (
          <HomePage />
        ) : activeView === "projectPlan" ? (
          <ProjectPlanPage
            selectedFolder={selectedFolder}
            workflowExists={workflowExists}
            projectPlanContents={projectPlanDocument?.contents ?? ""}
            projectPlanMessage={projectPlanMessage}
            isEditingProjectPlan={isEditingProjectPlan}
            editedProjectPlanContents={editedProjectPlanContents}
            isSavingProjectPlan={isSavingProjectPlan}
            onToggleEditMode={handleToggleProjectPlanEditMode}
            onEditedProjectPlanChange={setEditedProjectPlanContents}
            onSaveProjectPlan={() => void handleSaveProjectPlan()}
          />
        ) : activeView === "settings" ? (
          <SettingsPage
            selectedFolder={selectedFolder}
            isPickingFolder={isPickingFolder}
            isInitializingWorkflow={isInitializingWorkflow}
            hasSelectedFolder={hasSelectedFolder}
            workflowExists={workflowExists}
            workflowState={workflowState}
            generatedFilesSummary={generatedFilesSummary}
            gitignoreMode={gitignoreMode}
            gitignoreSummary={gitignoreSummary}
            lmStudioUrlDraft={lmStudioUrlDraft}
            lmStudioMessage={lmStudioMessage}
            lmStudioUrlError={lmStudioUrlError}
            lmStudioVerifiedModel={lmStudioVerifiedModel}
            isTestingLmStudioUrl={isTestingLmStudioUrl}
            onSelectFolder={handleSelectFolder}
            onInitializeWorkflow={handleInitializeWorkflow}
            onGitignoreModeChange={setGitignoreMode}
            onLmStudioUrlChange={handleLmStudioUrlChange}
            onClearLmStudioUrl={handleClearLmStudioUrl}
            onSaveLmStudioUrl={handleSaveLmStudioUrl}
            onTestLmStudioUrl={() => void handleTestLmStudioUrl()}
          />
        ) : (
          <TaskBoardPage
            selectedFolder={selectedFolder}
            workflowExists={workflowExists}
            boardColumns={boardColumns}
            savedTaskDetails={savedTaskDetails}
            onOpenTaskModal={openTaskModal}
            onOpenPromptModal={openPromptModal}
            onOpenTaskDetail={(task) => void handleOpenTaskDetail(task)}
            onOpenTaskContextMenu={handleOpenTaskContextMenu}
            isTaskModalOpen={isTaskModalOpen}
            isPromptModalOpen={isPromptModalOpen}
            isTaskDetailOpen={isTaskDetailOpen}
            onCloseTaskModal={() => closeTaskModal()}
            onClosePromptModal={closePromptModal}
            onCloseTaskDetailModal={closeTaskDetailModal}
            taskForm={taskForm}
            taskErrors={taskErrors}
            taskFormMode={taskFormMode}
            taskFormMessage={taskFormMessage}
            isSavingTask={isSavingTask}
            hasSelectedFolder={hasSelectedFolder}
            pendingTaskImages={pendingTaskImages}
            onTaskFieldChange={handleTaskFieldChange}
            onPendingTaskImagesChange={handlePendingTaskImagesChange}
            onRemovePendingTaskImage={handleRemovePendingTaskImage}
            onTaskSubmit={handleTaskSubmit}
            promptSourceDescription={promptSourceDescription}
            lmStudioReady={isLmStudioVerified}
            lmStudioDisabledReason={lmStudioDisabledReason}
            lmStudioDisabledWarning={lmStudioDisabledWarning}
            nextTaskPromptMessage={nextTaskPromptMessage}
            isRunningLmStudio={isRunningLmStudio}
            promptMessage={promptMessage}
            latestTaskId={workItemIdPreview.latestTaskId}
            latestBugId={workItemIdPreview.latestBugId}
            nextTaskId={workItemIdPreview.nextTaskId}
            nextBugId={workItemIdPreview.nextBugId}
            onPromptSourceChange={setPromptSourceDescription}
            onCreateLmStudioTask={() => void handleRunLmStudio()}
            onCopyNextTaskPrompt={() => void handleCopyNextTaskPrompt()}
            onDisabledLmStudioAttempt={handleDisabledLmStudioAttempt}
            onDismissLmStudioWarning={handleDismissLmStudioWarning}
            selectedTaskDetail={selectedTaskDetail}
            isLoadingTaskDetail={isLoadingTaskDetail}
            taskDetailMessage={taskDetailMessage}
            canEditSelectedTask={Boolean(
              selectedTaskDetail && selectedTaskDetail.status === "backlog"
            )}
            isUploadingTaskImages={isUploadingTaskImages}
            onEditSelectedTask={openEditTaskModal}
            onUploadTaskImages={handleUploadTaskImages}
          />
        )}

        {showLmStudioSettingsRedirectPrompt ? (
          <Modal
            title="LM Studio setup required"
            subtitle="Settings Redirect"
            ariaLabel="LM Studio setup required"
            onClose={handleCloseLmStudioSettingsRedirectPrompt}
            variant="document"
          >
            <div className={appStyles.helperModalContent}>
              <p className={appStyles.helperText}>
                Stream can&apos;t open the Generate Task flow yet because no LM Studio URL is
                saved in Settings.
              </p>
              <p className={appStyles.helperText}>
                After you acknowledge this message, Stream will take you to Settings so you
                can add and verify the LM Studio connection.
              </p>

              <div className={appStyles.helperActions}>
                <button
                  className={appStyles.secondaryButton}
                  type="button"
                  onClick={handleCloseLmStudioSettingsRedirectPrompt}
                >
                  Cancel
                </button>
                <button
                  className={appStyles.primaryButton}
                  type="button"
                  onClick={handleAcknowledgeLmStudioSettingsRedirect}
                >
                  Go to Settings
                </button>
              </div>
            </div>
          </Modal>
        ) : null}

      </main>
    </div>
  );
}
