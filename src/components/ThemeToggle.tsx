import Button from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      title={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
    >
      {theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
    </Button>
  );
};

export default ThemeToggle;
