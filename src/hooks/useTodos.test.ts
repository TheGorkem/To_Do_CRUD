import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTodos } from "@/hooks/useTodos";

describe("useTodos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("CRUD ve filtreleme akışlarını yönetir", async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => expect(result.current.status).toBe("ready"));

    act(() => {
      result.current.addTodo("İlk görev", "Açıklama");
    });

    expect(result.current.todos).toHaveLength(1);
    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.updateTodo(todoId, "Güncel görev", "Yeni açıklama");
    });

    expect(result.current.todos[0].title).toBe("Güncel görev");

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.setFilter("completed");
    });

    expect(result.current.filteredTodos).toHaveLength(1);

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });
});
