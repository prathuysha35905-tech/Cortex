import { api } from "@/lib/api";

export interface AnalyticsSummary {
  productivity: { day: string; value: number }[];
  taskCompletion: { period: string; value: number }[];
  habitConsistency: { period: string; value: number }[];
  focusHours: { day: string; hours: number }[];
}

export function getAnalytics(range: "week" | "month" | "year" = "week"): Promise<AnalyticsSummary> {
  return api.get<AnalyticsSummary>(`/analytics?range=${range}`);
}
