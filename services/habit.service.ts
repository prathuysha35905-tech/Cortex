import { api } from "@/lib/api";
import type { HabitResponse, CreateHabitPayload, UpdateHabitPayload } from "@/types/habit";

// The backend's /habits schema (app/schemas/habit.py) already mirrors
// this shape field-for-field (it exposes computed properties named to
// match: name, streak, longestStreak, completion, missedDays, doneToday,
// paused, progress, week) -- the only wire difference is the create
// payload doesn't accept `progress`/`streak`/etc, which CreateHabitPayload
// already excludes.

export function getHabits(): Promise<HabitResponse[]> {
  return api.get<HabitResponse[]>("/habits");
}

export function createHabit(payload: CreateHabitPayload): Promise<HabitResponse> {
  return api.post<HabitResponse>("/habits", payload);
}

export function updateHabit(id: number, payload: UpdateHabitPayload): Promise<HabitResponse> {
  return api.patch<HabitResponse>(`/habits/${id}`, payload);
}

export function toggleHabitDoneToday(id: number, doneToday: boolean): Promise<HabitResponse> {
  return api.patch<HabitResponse>(`/habits/${id}`, { doneToday });
}

export function deleteHabit(id: number): Promise<void> {
  return api.delete<void>(`/habits/${id}`);
}
