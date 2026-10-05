import React from "react";
import { APP_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      {/* Top Subtle Tricolor Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-lg dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
            KS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {APP_CONFIG.name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                ({APP_CONFIG.nameHindi})
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              India&apos;s Official Statistical System • iGOT Karmayogi Aligned
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success">Foundation v{APP_CONFIG.version}</Badge>
          <span className="hidden md:inline-flex text-xs font-medium text-emerald-600 dark:text-emerald-400 items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Next.js App Router Ready
          </span>
        </div>
      </div>
    </header>
  );
}
