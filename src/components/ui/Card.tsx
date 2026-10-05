import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs",
        hoverEffect && "transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
