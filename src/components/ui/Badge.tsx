import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "info" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-[#1D1D20] dark:text-[#F5F5F5] dark:border-[#2A2A2E]",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40",
    warning: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
    info: "bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40",
    outline: "border border-slate-200 text-slate-700 bg-white dark:border-[#2A2A2E] dark:text-[#A1A1AA] dark:bg-[#171719]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
