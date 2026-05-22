"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import FloatingTimer from "@/components/dashboard/FloatingTimer";
import { TimerProvider } from "@/providers/TimerProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <TimerProvider>
      <div className="flex h-screen bg-bg-primary overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-8 no-scrollbar relative">
            {children}
          </main>
        </div>
      </div>
      <FloatingTimer />
    </TimerProvider>
  );
}
