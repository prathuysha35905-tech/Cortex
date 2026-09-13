"use client";

import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, toggleTaskDone, updateTask } from "@/services/task.service";
import type { CreateTaskPayload, TaskResponse, UpdateTaskPayload } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return getTasks()
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (payload: CreateTaskPayload) => {
    const task = await createTask(payload);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const update = useCallback(async (id: number, payload: UpdateTaskPayload) => {
    const task = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  }, []);

  const toggleDone = useCallback(async (id: number, done: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
    try {
      await toggleTaskDone(id, done);
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !done } : t)));
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTask(id);
  }, []);

  return { tasks, loading, error, refresh, add, update, toggleDone, remove };
}
