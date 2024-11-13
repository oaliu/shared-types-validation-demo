import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const THEMES: Theme[] = ["light", "dark", "system"];
const DEFAULT_THEME: Theme = "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (newTheme: Theme) => {
      root.classList.remove("light", "dark");

      if (
        newTheme === "light" ||
        (newTheme === "system" && !isSystemDarkMode())
      ) {
        root.classList.add("light");
      } else {
        root.classList.add("dark");
      }

      if (newTheme !== "system") {
        localStorage.setItem("theme", newTheme);
      } else {
        localStorage.removeItem("theme");
      }
    };

    const isSystemDarkMode = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return { theme, setTheme: (theme: Theme) => setTheme(theme), themes: THEMES };
}
