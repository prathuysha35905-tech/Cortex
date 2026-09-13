export type GoalStatus = "Active" | "Completed" | "Archived";

export interface GoalResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  archived: boolean;
}

export type CreateGoalPayload = Omit<GoalResponse, "id" | "status" | "archived" | "progress"> & {
  progress?: number;
};

export type UpdateGoalPayload = Partial<CreateGoalPayload> & { status?: GoalStatus; archived?: boolean };
