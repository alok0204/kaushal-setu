"use client";

import React, { useState } from "react";
import { User, ChevronDown, Check } from "lucide-react";
import { DEMO_USERS } from "@/lib/constants";
import { DemoUser } from "@/types";
import { setActiveUserId } from "@/lib/store";

interface AppHeaderProps {
  user: DemoUser;
  onUserSwitched?: (newUser: DemoUser) => void;
}

export function AppHeader({ user, onUserSwitched }: AppHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getShortName = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
    }
    return fullName;
  };

  const handleSelectUser = (selectedUser: DemoUser) => {
    setActiveUserId(selectedUser.id);
    setDropdownOpen(false);
    if (onUserSwitched) onUserSwitched(selectedUser);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/95 px-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      {/* Platform Title */}
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-600" />
        <div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            iGOT AI Learning Platform
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Official Statistical System Competency Framework
          </div>
        </div>
      </div>

      {/* User Persona Switcher Pill */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800"
        >
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {getShortName(user.fullName)}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {user.role} ({user.stateName})
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <User className="h-4 w-4" />
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
            <div className="px-3 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Switch Demo Persona
            </div>
            <div className="space-y-1">
              {DEMO_USERS.map((u) => {
                const isSelected = u.id === user.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-semibold dark:bg-blue-950/50 dark:text-blue-200"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{u.fullName}</div>
                      <div className="text-[10px] text-zinc-500">
                        {u.stateName} • {u.role}
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
