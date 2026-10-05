"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "header" | "sidebar" | "standalone";
}

export function ThemeToggle({ className, variant = "header" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = isHydrated && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative flex items-center justify-center rounded-lg border transition-all duration-150 focus:outline-hidden",
        variant === "header" &&
          "h-8 w-8 border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-[#0f1f35] dark:border-[#2A2A2E] dark:bg-[#171719] dark:text-[#A1A1AA] dark:hover:bg-[#1D1D20] dark:hover:text-[#F5F5F5]",
        variant === "sidebar" &&
          "w-full gap-2.5 px-2.5 py-2 text-xs font-semibold border-transparent text-slate-600 hover:bg-slate-100 hover:text-[#0f1f35] dark:text-[#A1A1AA] dark:hover:bg-[#171719] dark:hover:text-[#F5F5F5]",
        variant === "standalone" &&
          "h-9 w-9 border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-[#2A2A2E] dark:bg-[#171719] dark:text-[#A1A1AA] dark:hover:bg-[#1D1D20]",
        className
      )}
      suppressHydrationWarning
    >
      {variant === "sidebar" ? (
        <>
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 text-slate-500 group-hover:text-slate-800 shrink-0" />
          )}
          <span className="flex-1 text-left">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:bg-[#2A2A2E] dark:text-[#A1A1AA]">
            {isDark ? "SUN" : "MOON"}
          </span>
        </>
      ) : isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-transform duration-200 group-hover:-rotate-12 dark:text-[#A1A1AA]" />
      )}
    </button>
  );
}
