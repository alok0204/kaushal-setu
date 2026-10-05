import React from "react";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/50 py-8 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {APP_CONFIG.name} ({APP_CONFIG.nameHindi}) — Foundation Phase
            </p>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              {APP_CONFIG.description}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-mono text-[11px] text-zinc-500">
              Vercel-Ready • Next.js App Router • Strict Security (Zero Hardcoded Secrets)
            </p>
            <p className="text-zinc-400 dark:text-zinc-500">
              Designed for MoSPI, State DES & iGOT Karmayogi Framework
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
