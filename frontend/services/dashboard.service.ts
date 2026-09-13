import { api } from "@/lib/api";
import type { DashboardAnalytics } from "@/types/dashboard";
import { getPlannerEntries } from "@/services/planner.service";
import { getHabits } from "@/services/habit.service";

// The backend's GET /dashboard (app/dashboard/service.py) returns a flat
// snake_case summary shaped nothing like the frontend's DashboardAnalytics
// (no `stats`/`schedule`/`productivity` arrays at all). Rather than guess
// at a redesign of that endpoint, this composes the real
// DashboardAnalytics shape from several already-correct endpoints.
interface BackendDashboardSummary {
  productivity_score: number;
  today_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  active_goals: number;
  completed_goals: number;
  habit_streak: number;
  focus_hours: number;
  ai_message: string;
}

interface BackendAnalyticsSummary {
  productivity: { day: string; value: number }[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const [summary, todayPlan, analytics, habits] = await Promise.all([
    api.get<BackendDashboardSummary>("/dashboard"),
    getPlannerEntries(todayIso()),
    api.get<BackendAnalyticsSummary>("/analytics?range=week"),
    getHabits(),
  ]);

  const tasksCompletedToday = todayPlan.filter((e) => e.status === "Done").length;
  const tasksTotalToday = todayPlan.length;
  const habitsCompletedToday = habits.filter((h) => h.doneToday).length;
  const habitsTotalToday = habits.length;

  return {
    stats: [
      { label: "Tasks completed", value: `${summary.completed_tasks}/${summary.today_tasks}` },
      { label: "Active goals", value: summary.active_goals },
      { label: "Habit streak", value: `${summary.habit_streak}d` },
      { label: "Productivity score", value: `${summary.productivity_score}%` },
    ],
    schedule: todayPlan.map((e) => ({ time: e.time, title: e.title })),
    productivity: analytics.productivity,
    tasksCompletedToday,
    tasksTotalToday,
    activeGoals: summary.active_goals,
    habitsCompletedToday,
    habitsTotalToday,
  };
}
