import type { Todo } from "@/interfaces/todo";
import type { Result } from "@/interfaces/result";
import { STORAGE_KEY } from "@/constants/app";

type TodosResult = Result<Todo[], string>;

const isValidTodo = (todo: unknown): todo is Todo => {
  if (!todo || typeof todo !== "object") return false;
  const candidate = todo as Partial<Todo>;
  const hasValidReminderAt =
    candidate.reminderAt === undefined || typeof candidate.reminderAt === "string";
  const hasValidReminderNotifiedAt =
    candidate.reminderNotifiedAt === undefined ||
    typeof candidate.reminderNotifiedAt === "string";
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.completed === "boolean" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    hasValidReminderAt &&
    hasValidReminderNotifiedAt
  );
};

export const loadTodos = (): TodosResult => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, data: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Kayıtlı veri liste formatında değil." };
    }
    const validTodos = parsed.filter((item) => isValidTodo(item));
    if (validTodos.length !== parsed.length) {
      return {
        ok: false,
        error: "Kayıtlı veriler bozuk. Geçerli görevler temizlendi.",
      };
    }
    return { ok: true, data: validTodos };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Depolama okunamadı." };
  }
};

export const saveTodos = (todos: Todo[]): Result<true, string> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return { ok: true, data: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Depolama yazılamadı." };
  }
};
