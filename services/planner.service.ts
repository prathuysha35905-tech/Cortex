import { api } from "@/lib/api";

export interface PlannerEntry {
  id: number;
  title: string;
  time: string;
  duration: string;
  priority: "Low" | "Medium" | "High";
  status: "Upcoming" | "In Progress" | "Done";
}

export function getPlannerEntries(date: string): Promise<PlannerEntry[]> {
  return api.get<PlannerEntry[]>(`/planner?date=${encodeURIComponent(date)}`);
}

export function generateAiPlan(date: string): Promise<PlannerEntry[]> {
  return api.post<PlannerEntry[]>("/planner/ai-generate", { date });
}
