"use client";

import React, { useSyncExternalStore } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { DEMO_USERS } from "@/lib/constants";
import {
  getActiveUserId,
  getDashboardData,
  getInitialDashboardData,
  setActiveUserId,
} from "@/lib/store";
import { UserDashboardData } from "@/types";

function subscribe(callback: () => void) {
  window.addEventListener("kaushal_setu_user_changed", callback);
  window.addEventListener("kaushal_setu_state_updated", callback);
  return () => {
    window.removeEventListener("kaushal_setu_user_changed", callback);
    window.removeEventListener("kaushal_setu_state_updated", callback);
  };
}

const emptySubscribe = () => () => {};

export function AppShell({
  children,
}: {
  children: (data: UserDashboardData, refresh: () => void) => React.ReactNode;
}) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const activeUserId = useSyncExternalStore(
    subscribe,
    () => (isHydrated ? getActiveUserId() : DEMO_USERS[0].id),
    () => DEMO_USERS[0].id
  );

  const activeUser = DEMO_USERS.find((u) => u.id === activeUserId) || DEMO_USERS[0];
  const dashboardData = isHydrated
    ? getDashboardData(activeUserId)
    : getInitialDashboardData(DEMO_USERS[0].id);

  return (
    <div
      className="flex min-h-screen bg-[#f8fafd] text-[#0f1f35]"
      suppressHydrationWarning
    >
      <AppSidebar onResetData={() => window.location.reload()} />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AppHeader
          user={activeUser}
          onUserSwitched={(u) => {
            setActiveUserId(u.id);
          }}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children(dashboardData, () => {})}
        </main>
      </div>
    </div>
  );
}
