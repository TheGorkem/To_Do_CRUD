import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { STORAGE_KEY } from "@/constants/app";
import { loadTodos, saveTodos } from "@/services/storage";

describe("storage service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("kayıtlı todo listesini okur", () => {
    const payload = [
      {
        id: "1",
        title: "Test",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    const result = loadTodos();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe("Test");
    }
  });

  it("bozuk JSON olduğunda hata döner", () => {
    localStorage.setItem(STORAGE_KEY, "{bad-json");

    const result = loadTodos();

    expect(result.ok).toBe(false);
  });

  it("depolama yazım hatasında hata döner", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    const result = saveTodos([]);

    expect(result.ok).toBe(false);
  });
});
