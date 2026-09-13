import { api } from "@/lib/api";
import type { TaskResponse, CreateTaskPayload, UpdateTaskPayload, TaskPriority } from "@/types/task";

// Wire shape from app/schemas/task.py -- notably uses a single `deadline`
// datetime instead of separate date/time strings, has no `done` (derives
// from `status`), no `overdue` (derived from deadline vs now), and no
// `duration`/`progress` prior to this integration (now added as real
// columns on the backend Task model).
interface BackendTask {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  category: string | null;
  deadline: string | null;
  is_recurring: boolean;
  recurrence: string | null;
  duration: string | null;
  progress: number;
  status: string;
}

function splitDeadline(deadline: string | null): { date: string; time: string } {
  if (!deadline) return { date: "", time: "" };
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  const date = d.toISOString().slice(0, 10);
  const time = d.toISOString().slice(11, 16);
  return { date, time };
}

function combineDeadline(date?: string, time?: string): string | undefined {
  if (!date) return undefined;
  return `${date}T${time || "00:00"}:00`;
}

function toTaskResponse(t: BackendTask): TaskResponse {
  const { date, time } = splitDeadline(t.deadline);
  const done = t.status === "Completed";
  const overdue = !done && !!t.deadline && new Date(t.deadline).getTime() < Date.now();
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    date,
    time,
    priority: t.priority,
    category: t.category ?? "",
    duration: t.duration ?? "",
    progress: t.progress ?? 0,
    done,
    overdue,
  };
}

function toBackendCreateBody(payload: CreateTaskPayload) {
  return {
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    category: payload.category,
    deadline: combineDeadline(payload.date, payload.time),
    duration: payload.duration,
    progress: payload.progress ?? 0,
  };
}

function toBackendUpdateBody(payload: UpdateTaskPayload) {
  const body: Record<string, unknown> = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.priority !== undefined) body.priority = payload.priority;
  if (payload.category !== undefined) body.category = payload.category;
  if (payload.duration !== undefined) body.duration = payload.duration;
  if (payload.progress !== undefined) body.progress = payload.progress;
  if (payload.date !== undefined || payload.time !== undefined) {
    body.deadline = combineDeadline(payload.date, payload.time);
  }
  if (payload.done !== undefined) body.done = payload.done;
  return body;
}

export async function getTasks(): Promise<TaskResponse[]> {
  const res = await api.get<BackendTask[]>("/tasks");
  return res.map(toTaskResponse);
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskResponse> {
  const res = await api.post<BackendTask>("/tasks", toBackendCreateBody(payload));
  return toTaskResponse(res);
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<TaskResponse> {
  const res = await api.patch<BackendTask>(`/tasks/${id}`, toBackendUpdateBody(payload));
  return toTaskResponse(res);
}

export async function toggleTaskDone(id: number, done: boolean): Promise<TaskResponse> {
  const res = await api.patch<BackendTask>(`/tasks/${id}`, { done });
  return toTaskResponse(res);
}

export function deleteTask(id: number): Promise<void> {
  return api.delete<void>(`/tasks/${id}`);
}
