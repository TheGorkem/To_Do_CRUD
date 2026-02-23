import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { Todo } from "@/interfaces/todo";
import type { FilterType } from "@/interfaces/ui";
import { createId } from "@/utils/id";
import { loadTodos, saveTodos } from "@/services/storage";
import { sendReminderNotification } from "@/services/notifications";

interface TodoState {
  todos: Todo[];
  filter: FilterType;
  status: "loading" | "ready" | "error";
  error?: string;
}

type Action =
  | { type: "INIT"; payload: { todos: Todo[]; error?: string } }
  | {
      type: "ADD";
      payload: { title: string; description?: string; reminderAt?: string };
    }
  | {
      type: "UPDATE";
      payload: {
        id: string;
        title: string;
        description?: string;
        reminderAt?: string;
      };
    }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "RESTORE"; payload: { todo: Todo } }
  | { type: "TOGGLE"; payload: { id: string } }
  | { type: "MARK_REMINDER_NOTIFIED"; payload: { id: string; notifiedAt: string } }
  | { type: "SET_FILTER"; payload: { filter: FilterType } }
  | { type: "SET_ERROR"; payload: { error: string } }
  | { type: "CLEAR_ERROR" };

const initialState: TodoState = {
  todos: [],
  filter: "all",
  status: "loading",
  error: undefined,
};

const reducer = (state: TodoState, action: Action): TodoState => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        todos: action.payload.todos,
        status: action.payload.error ? "error" : "ready",
        error: action.payload.error,
      };
    case "ADD": {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: createId(),
        title: action.payload.title,
        description: action.payload.description,
        reminderAt: action.payload.reminderAt,
        reminderNotifiedAt: undefined,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, todos: [newTodo, ...state.todos] };
    }
    case "UPDATE": {
      const now = new Date().toISOString();
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                title: action.payload.title,
                description: action.payload.description,
                reminderAt: action.payload.reminderAt,
                reminderNotifiedAt:
                  action.payload.reminderAt !== todo.reminderAt
                    ? undefined
                    : todo.reminderNotifiedAt,
                updatedAt: now,
              }
            : todo
        ),
      };
    }
    case "DELETE":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    case "RESTORE":
      return {
        ...state,
        todos: [action.payload.todo, ...state.todos],
      };
    case "TOGGLE": {
      const now = new Date().toISOString();
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                completed: !todo.completed,
                reminderNotifiedAt: !todo.completed ? todo.reminderNotifiedAt : undefined,
                updatedAt: now,
              }
            : todo
        ),
      };
    }
    case "MARK_REMINDER_NOTIFIED":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, reminderNotifiedAt: action.payload.notifiedAt }
            : todo
        ),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload.filter };
    case "SET_ERROR":
      return { ...state, error: action.payload.error, status: "error" };
    case "CLEAR_ERROR":
      return { ...state, error: undefined, status: "ready" };
    default:
      return state;
  }
};

export const useTodos = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reminderTimersRef = useRef<Map<string, number>>(new Map());

  const clearReminderTimers = useCallback(() => {
    reminderTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    reminderTimersRef.current.clear();
  }, []);

  useEffect(() => {
    const result = loadTodos();
    if (result.ok) {
      dispatch({ type: "INIT", payload: { todos: result.data } });
      return;
    }
    dispatch({ type: "INIT", payload: { todos: [], error: result.error } });
  }, []);

  useEffect(() => {
    if (state.status === "loading") return;
    const result = saveTodos(state.todos);
    if (!result.ok) {
      dispatch({ type: "SET_ERROR", payload: { error: result.error } });
    }
  }, [state.todos, state.status]);

  useEffect(() => {
    if (state.status === "loading") return;
    clearReminderTimers();

    const pendingTodos = state.todos.filter(
      (todo) => Boolean(todo.reminderAt) && !todo.completed && !todo.reminderNotifiedAt
    );

    pendingTodos.forEach((todo) => {
      if (!todo.reminderAt) return;
      const triggerAt = new Date(todo.reminderAt).getTime();
      if (Number.isNaN(triggerAt)) return;

      const notify = () => {
        const sent = sendReminderNotification(todo);
        if (!sent) return;
        dispatch({
          type: "MARK_REMINDER_NOTIFIED",
          payload: { id: todo.id, notifiedAt: new Date().toISOString() },
        });
      };

      const delay = triggerAt - Date.now();
      if (delay <= 0) {
        notify();
        return;
      }

      const timerId = window.setTimeout(notify, delay);
      reminderTimersRef.current.set(todo.id, timerId);
    });

    return clearReminderTimers;
  }, [clearReminderTimers, state.status, state.todos]);

  const addTodo = useCallback(
    (title: string, description?: string, reminderAt?: string) => {
      dispatch({ type: "ADD", payload: { title, description, reminderAt } });
    },
    []
  );

  const updateTodo = useCallback(
    (id: string, title: string, description?: string, reminderAt?: string) => {
      dispatch({ type: "UPDATE", payload: { id, title, description, reminderAt } });
    },
    []
  );

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: "DELETE", payload: { id } });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", payload: { id } });
  }, []);

  const restoreTodo = useCallback((todo: Todo) => {
    dispatch({ type: "RESTORE", payload: { todo } });
  }, []);

  const setFilter = useCallback((filter: FilterType) => {
    dispatch({ type: "SET_FILTER", payload: { filter } });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case "active":
        return state.todos.filter((todo) => !todo.completed);
      case "completed":
        return state.todos.filter((todo) => todo.completed);
      default:
        return state.todos;
    }
  }, [state.filter, state.todos]);

  const counts = useMemo(() => {
    const completed = state.todos.filter((todo) => todo.completed).length;
    return { total: state.todos.length, completed };
  }, [state.todos]);

  return {
    ...state,
    isLoading: state.status === "loading",
    filteredTodos,
    counts,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    restoreTodo,
    setFilter,
    clearError,
  };
};
