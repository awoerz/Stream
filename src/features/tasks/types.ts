import {
  boardStatuses,
  taskPriorityOptions,
  taskStatusOptions,
  taskTypeOptions
} from "./constants";

export type TaskType = (typeof taskTypeOptions)[number];
export type TaskStatus = (typeof taskStatusOptions)[number];
export type TaskPriority = (typeof taskPriorityOptions)[number];
export type BoardStatus = (typeof boardStatuses)[number];

export type TaskFormData = {
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
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

export type TaskFormErrors = Partial<Record<keyof TaskFormData, string>>;
export type TaskFormMode = "create" | "edit";

export type PendingTaskImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export type TaskBoardCard = {
  id: string;
  title: string;
  type: string;
  priority: string;
  rank: number | null;
  attachmentCount: number;
  owner: string;
  agent: string;
  status: BoardStatus;
  filePath: string;
};

export type TaskBoardColumn = {
  status: BoardStatus;
  tasks: TaskBoardCard[];
};

export type TaskDetail = {
  id: string;
  title: string;
  type: string;
  status: BoardStatus;
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

export type SavedTaskDetails = {
  taskId: string;
  fileName: string;
  filePath: string;
};
