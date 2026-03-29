"use client";

import { useTheme } from "@/lib/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 rounded-full border flex items-center justify-center text-base text-muted-foreground hover:text-foreground transition-colors"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
