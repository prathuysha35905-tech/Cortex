export type TaskPriority = "Low" | "Medium" | "High";

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: TaskPriority;
  category: string;
  duration: string;
  progress: number;
  done: boolean;
  overdue: boolean;
}

export type CreateTaskPayload = Omit<TaskResponse, "id" | "done" | "overdue" | "progress"> & {
  progress?: number;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload> & { done?: boolean; progress?: number };
