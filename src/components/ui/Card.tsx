import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 backdrop-blur-sm",
        hoverEffect && "transition-all duration-200 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
