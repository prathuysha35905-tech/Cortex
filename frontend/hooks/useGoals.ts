"use client";

import { useCallback, useEffect, useState } from "react";
import { archiveGoal, createGoal, deleteGoal, getGoals, updateGoal, updateGoalProgress } from "@/services/goal.service";
import type { CreateGoalPayload, GoalResponse, UpdateGoalPayload } from "@/types/goal";

export function useGoals() {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return getGoals()
      .then(setGoals)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load goals"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (payload: CreateGoalPayload) => {
    const goal = await createGoal(payload);
    setGoals((prev) => [goal, ...prev]);
    return goal;
  }, []);

  const update = useCallback(async (id: number, payload: UpdateGoalPayload) => {
    const goal = await updateGoal(id, payload);
    setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
    return goal;
  }, []);

  const setProgress = useCallback(async (id: number, progress: number) => {
    const goal = await updateGoalProgress(id, progress);
    setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
    return goal;
  }, []);

  const archive = useCallback(async (id: number) => {
    const goal = await archiveGoal(id);
    setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
    return goal;
  }, []);

  const remove = useCallback(async (id: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await deleteGoal(id);
  }, []);

  return { goals, loading, error, refresh, add, update, setProgress, archive, remove };
}
