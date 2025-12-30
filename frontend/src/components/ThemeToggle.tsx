"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors shadow-sm",
        isDark
          ? "bg-white/10 text-slate-100 ring-white/15 hover:bg-white/15"
          : "bg-white/80 text-slate-900 ring-slate-200 hover:bg-white"
      )}
      aria-label="Toggle theme"
    >
      <span className={cn("h-2 w-2 rounded-full", isDark ? "bg-emerald-400" : "bg-amber-400")} />
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
