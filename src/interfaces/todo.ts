export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority?: TodoPriority;
  reminderAt?: string;
  reminderNotifiedAt?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
