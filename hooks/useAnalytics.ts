"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnalytics } from "@/services/analytics.service";
import type { AnalyticsSummary } from "@/services/analytics.service";

export function useAnalytics(range: "week" | "month" | "year" = "week") {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return getAnalytics(range)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
