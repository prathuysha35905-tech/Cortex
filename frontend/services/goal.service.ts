import { api } from "@/lib/api";
import type { GoalResponse, CreateGoalPayload, UpdateGoalPayload, GoalStatus } from "@/types/goal";

// Wire shape from app/schemas/goal.py -- snake_case target_date/is_archived
// instead of camelCase targetDate/archived, and no single generic
// "archived" flag to PATCH (there are dedicated /archive and /restore
// routes instead).
interface BackendGoal {
  id: number;
  title: string;
  description: string;
  category: string;
  target_date: string | null;
  progress: number;
  status: string;
  is_archived: boolean;
}

function toGoalResponse(g: BackendGoal): GoalResponse {
  const status: GoalStatus = g.is_archived
    ? "Archived"
    : g.status === "Completed"
      ? "Completed"
      : "Active";
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    category: g.category,
    targetDate: g.target_date ?? "",
    progress: g.progress,
    status,
    archived: g.is_archived,
  };
}

export async function getGoals(): Promise<GoalResponse[]> {
  const res = await api.get<BackendGoal[]>("/goals");
  return res.map(toGoalResponse);
}

export async function createGoal(payload: CreateGoalPayload): Promise<GoalResponse> {
  const res = await api.post<BackendGoal>("/goals", {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    target_date: payload.targetDate || undefined,
  });
  return toGoalResponse(res);
}

export async function updateGoal(id: number, payload: UpdateGoalPayload): Promise<GoalResponse> {
  const body: Record<string, unknown> = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.category !== undefined) body.category = payload.category;
  if (payload.targetDate !== undefined) body.target_date = payload.targetDate || undefined;

  let res = await api.patch<BackendGoal>(`/goals/${id}`, body);

  // `status`/`archived` aren't part of the generic PATCH -- they have
  // dedicated routes.
  if (payload.progress !== undefined) {
    res = await api.put<BackendGoal>(`/goals/${id}/progress/${payload.progress}`);
  }
  if (payload.archived === true) {
    await api.put<void>(`/goals/${id}/archive`);
    res = { ...res, is_archived: true };
  } else if (payload.archived === false) {
    await api.put<void>(`/goals/${id}/restore`);
    res = { ...res, is_archived: false };
  }

  return toGoalResponse(res);
}

export async function updateGoalProgress(id: number, progress: number): Promise<GoalResponse> {
  const res = await api.put<BackendGoal>(`/goals/${id}/progress/${progress}`);
  return toGoalResponse(res);
}

export async function archiveGoal(id: number): Promise<GoalResponse> {
  await api.put<void>(`/goals/${id}/archive`);
  const res = await api.get<BackendGoal>(`/goals/${id}`);
  return toGoalResponse(res);
}

export function deleteGoal(id: number): Promise<void> {
  return api.delete<void>(`/goals/${id}`);
}
