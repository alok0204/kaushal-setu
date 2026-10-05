"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resetUserState, getActiveUserId } from "@/lib/store";

interface AppSidebarProps {
  className?: string;
  onResetData?: () => void;
}

export function AppSidebar({ className, onResetData }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Competency", href: "/competency", icon: Award },
    { name: "Learning", href: "/learning", icon: BookOpen },
    { name: "Assessments", href: "/assessment", icon: ClipboardCheck },
    { name: "Progress", href: "/progress", icon: TrendingUp },
  ];

  const handleReset = () => {
    if (confirm("Reset current demo user's performance back to zero state?")) {
      const activeId = getActiveUserId();
      resetUserState(activeId);
      if (onResetData) onResetData();
      window.location.reload();
    }
  };

  return (
    <aside
      className={cn(
        "flex w-64 flex-col justify-between border-r border-zinc-200 bg-[#0c1829] text-zinc-300 dark:border-zinc-800",
        className
      )}
    >
      <div>
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 border-b border-zinc-800/80 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white shadow-sm">
            KS
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
              iGOT AI
            </div>
            <div className="text-[11px] text-zinc-400 font-medium tracking-tight">
              Karmayogi Learning Intelligence
            </div>
          </div>
        </div>

        {/* Section: STATISTICAL CADRE CORE */}
        <div className="px-4 py-6">
          <div className="px-3 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
            Statistical Cadre Core
          </div>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#162a45] text-white shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-zinc-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Account & Governance */}
      <div className="border-t border-zinc-800/80 p-4 space-y-3">
        <div className="px-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
          Account &amp; Governance
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <UserCheck className="h-4 w-4 text-zinc-400" />
          Switch User / Sign Out
        </Link>

        <button
          onClick={handleReset}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-amber-400/90 hover:bg-amber-950/30 hover:text-amber-300 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
          Reset Demo to 0% State
        </button>

        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400 border-t border-zinc-800/50 px-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Govt. of India • MoSPI
          </span>
          <span className="font-mono text-[10px]">v3.2</span>
        </div>
      </div>
    </aside>
  );
}
