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
        "flex w-64 flex-col justify-between border-r border-slate-200 bg-white text-[#0f1f35]",
        className
      )}
      suppressHydrationWarning
    >
      <div>
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b2945] font-bold text-white shadow-sm">
            KS
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-[#0f1f35] text-base">
              iGOT AI
            </div>
            <div className="text-[11px] text-slate-500 font-medium tracking-tight">
              Karmayogi Learning Intelligence
            </div>
          </div>
        </div>

        {/* Section: STATISTICAL CADRE CORE */}
        <div className="px-4 py-6">
          <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Statistical Cadre Core
          </div>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const currentPath = pathname || "";
              const isActive =
                item.href === "/assessment"
                  ? currentPath.startsWith("/assessment") ||
                    currentPath.startsWith("/ai-generator") ||
                    currentPath.startsWith("/quiz")
                  : currentPath === item.href ||
                    (item.href !== "/" && currentPath.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-[#0b2945] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-[#0f1f35]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-slate-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Account & Governance */}
      <div className="border-t border-slate-100 p-4 space-y-2.5">
        <div className="px-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Account &amp; Governance
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-[#0f1f35] transition-colors"
        >
          <UserCheck className="h-4 w-4 text-slate-500" />
          Switch User / Sign Out
        </Link>

        <button
          onClick={handleReset}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
          Reset Demo to 0% State
        </button>

        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-100 px-2">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            Govt. of India • MoSPI
          </span>
          <span className="font-mono text-[10px] text-slate-400">v3.2</span>
        </div>
      </div>
    </aside>
  );
}
