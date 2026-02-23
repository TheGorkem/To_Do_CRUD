import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "todoflow.theme";
const THEME_TRANSITION_CLASS = "theme-transition";
const THEME_TRANSITION_DURATION_MS = 320;

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add(THEME_TRANSITION_CLASS);
    window.setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS);
    }, THEME_TRANSITION_DURATION_MS);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme };
};
