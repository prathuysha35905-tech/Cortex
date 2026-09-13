export interface DashboardStat {
  label: string;
  value: string | number;
  delta?: string;
  trendUp?: boolean;
}

export interface DashboardScheduleItem {
  time: string;
  title: string;
}

export interface DashboardAnalytics {
  stats: DashboardStat[];
  schedule: DashboardScheduleItem[];
  productivity: { day: string; value: number }[];
  tasksCompletedToday: number;
  tasksTotalToday: number;
  activeGoals: number;
  habitsCompletedToday: number;
  habitsTotalToday: number;
}
