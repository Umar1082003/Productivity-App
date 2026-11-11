export type TaskType = {
    id: string;
    title: string;
    description: string | null;
    priority: "high" | "medium" | "low";
    status: "todo" | "in-progress" | "completed";
    due_date: string | null;
    created_at: string;
  };

export type ActiveFocusSession = {
    id: string;
    task_id: string;
    duration_seconds: number;
    elapsed_seconds: number;
    status: "running" | "paused";
    last_resumed_at: string | null;
    time_left_seconds: number;
  };

export type FocusSession = {
    id: string;
    task_id: string;
    duration_seconds: number;
    elapsed_seconds: number;
    status: "running" | "paused" | "completed" | "cancelled";
    started_at: string;
  };