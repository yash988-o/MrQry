"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/providers/ToastProvider";

export default function TopBar() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Search feature coming soon in Phase 3", type: "info" });
  };

  const handleNotifications = () => {
    toast({ title: "No new notifications", type: "default" });
  };

  // Generate a title based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    const segment = pathname.split("/").pop();
    if (segment) {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    return "Dashboard";
  };

  return (
    <header className="h-16 border-b border-glass-border bg-bg-primary/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <h1 className="text-xl font-display font-semibold text-text-primary">
        {getPageTitle()}
      </h1>

      <div className="flex items-center gap-6">
        <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search className="w-4 h-4" />
          </div>
          <Input
            type="search"
            placeholder="Search tasks, cards..."
            className="h-9 pl-9 text-sm rounded-full bg-bg-tertiary border-none focus:ring-1"
          />
        </form>

        <button 
          onClick={handleNotifications}
          className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-bg-tertiary"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-active" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-glass-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">Yash J.</p>
            <p className="text-xs text-text-muted">Pro Plan</p>
          </div>
          <Avatar initials="YJ" />
        </div>
      </div>
    </header>
  );
}
