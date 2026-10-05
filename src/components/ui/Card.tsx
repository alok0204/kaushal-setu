import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-xs",
        hoverEffect && "transition-all duration-200 hover:border-slate-300 hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
