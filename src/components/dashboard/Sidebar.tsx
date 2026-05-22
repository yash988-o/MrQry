"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  Target, 
  BarChart3, 
  BrainCircuit, 
  Calculator,
  Settings,
  LogOut,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimer } from "@/providers/TimerProvider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/timer", label: "Focus Timer", icon: Timer },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart3 },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: BrainCircuit },
  { href: "/dashboard/calculator", label: "Calculator", icon: Calculator },
];

const AI_COMPANIONS = [
  { href: "/dashboard/ai/mukki", label: "Mukki", color: "text-mukki-cyan", image: "/mukki.png" },
  { href: "/dashboard/ai/ghalib", label: "Ghalib", color: "text-ghalib-orange", image: "/ghalib.png" },
  { href: "/dashboard/ai/zadugarni", label: "Zadugarni", color: "text-zadugarni-pink", image: "/zadugarni.png" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { setIsTimerOpen } = useTimer();

  return (
    <aside className="w-64 border-r border-glass-border bg-bg-secondary flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-glass-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-accent-active/10 rounded-xl border border-accent-active/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={cn("w-5 h-5 relative z-10", isActive ? "text-accent-active" : "")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-6 mb-2 px-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">AI Companions</span>
        </div>

        {AI_COMPANIONS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium",
                isActive ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"
              )}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-glass-border">
                <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
              </div>
              <span className={cn(isActive ? "text-text-primary" : "text-text-secondary")}>{item.label}</span>
            </Link>
          );
        })}

        {/* The Open Timer button has been moved to main NAV_ITEMS */}
        <div className="mt-8 mb-4"></div>
      </div>

      <div className="p-4 border-t border-glass-border flex flex-col gap-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors text-sm font-medium"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-accent-red hover:bg-accent-red/10 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
