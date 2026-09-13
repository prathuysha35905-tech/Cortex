"use client";

import { useCallback, useEffect, useState } from "react";
import { createHabit, deleteHabit, getHabits, toggleHabitDoneToday, updateHabit } from "@/services/habit.service";
import type { CreateHabitPayload, HabitResponse, UpdateHabitPayload } from "@/types/habit";

export function useHabits() {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return getHabits()
      .then(setHabits)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load habits"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (payload: CreateHabitPayload) => {
    const habit = await createHabit(payload);
    setHabits((prev) => [habit, ...prev]);
    return habit;
  }, []);

  const update = useCallback(async (id: number, payload: UpdateHabitPayload) => {
    const habit = await updateHabit(id, payload);
    setHabits((prev) => prev.map((h) => (h.id === id ? habit : h)));
    return habit;
  }, []);

  const toggleToday = useCallback(async (id: number, doneToday: boolean) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, doneToday } : h)));
    try {
      await toggleHabitDoneToday(id, doneToday);
    } catch (err) {
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, doneToday: !doneToday } : h)));
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await deleteHabit(id);
  }, []);

  return { habits, loading, error, refresh, add, update, toggleToday, remove };
}
