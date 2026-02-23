import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "@/pages/Home";

describe("Home page", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("boş durumdan görev ekleme ve filtreleme akışını çalıştırır", async () => {
    const user = userEvent.setup();
    render(<Home />);

    expect(await screen.findByText("Henüz görev yok")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Görev başlığı"), "Görev 1");
    await user.click(screen.getByRole("button", { name: "Görev ekle" }));

    expect(screen.getByText("Görev 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tamamlandı olarak işaretle" }));
    await user.click(screen.getByRole("button", { name: "Tamamlandı" }));

    expect(screen.getByText("Görev 1")).toBeInTheDocument();
  });

  it("tema değişikliğini uygular", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Koyu temaya geç" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
