"use client";

import { useCallback, useEffect, useState } from "react";
import { generateAiPlan, getPlannerEntries } from "@/services/planner.service";
import type { PlannerEntry } from "@/services/planner.service";

/**
 * Loads the real planner timeline for a given ISO date ("YYYY-MM-DD").
 * Pass `null` when the current view has no single concrete date (e.g. a
 * "This Week" / "This Month" range) — the hook simply stays empty then.
 */
export function usePlanner(date: string | null) {
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!date) {
      setEntries([]);
      setLoading(false);
      setError(null);
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    return getPlannerEntries(date)
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load planner"))
      .finally(() => setLoading(false));
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const generate = useCallback(async () => {
    if (!date) return [] as PlannerEntry[];
    const plan = await generateAiPlan(date);
    setEntries(plan);
    return plan;
  }, [date]);

  return { entries, loading, error, refresh, generate };
}
