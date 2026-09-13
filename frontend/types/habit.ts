export interface HabitResponse {
  id: number;
  name: string;
  category: string;
  reminder: string;
  streak: number;
  longestStreak: number;
  completion: number;
  missedDays: number;
  doneToday: boolean;
  paused: boolean;
  progress: number;
  week: boolean[];
}

export type CreateHabitPayload = Omit<
  HabitResponse,
  "id" | "streak" | "longestStreak" | "completion" | "missedDays" | "doneToday" | "progress" | "week"
>;

export type UpdateHabitPayload = Partial<HabitResponse>;
