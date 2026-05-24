"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/providers/ToastProvider";

export default function TopBar() {
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Student");
        } else {
          setUserName("Yash J.");
        }
      } catch (e) {
        setUserName("Yash J.");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 text-text-secondary transition-colors rounded-full ${isNotifOpen ? 'bg-bg-tertiary text-text-primary' : 'hover:text-text-primary hover:bg-bg-tertiary'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-active" />
          </button>
          
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-glass-border rounded-xl shadow-shadow-card overflow-hidden z-50">
              <div className="p-4 border-b border-glass-border flex justify-between items-center">
                <h3 className="font-medium text-text-primary">Notifications</h3>
                <span className="text-xs text-accent-active cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="p-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto no-scrollbar">
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-accent-active mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">Spaced Repetition Due</p>
                    <p className="text-xs text-text-muted mt-1">You have 15 items to review today in Quantum Physics.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-accent-green mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">Goal Completed</p>
                    <p className="text-xs text-text-muted mt-1">You successfully finished your "Deep Focus" timer session.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative pl-6 border-l border-glass-border" ref={profileRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-text-primary">{userName}</p>
              <p className="text-xs text-text-muted">Pro Plan</p>
            </div>
            <Avatar initials={userName.charAt(0).toUpperCase()} />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-bg-secondary border border-glass-border rounded-xl shadow-shadow-card overflow-hidden z-50 flex flex-col">
              <button className="px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-tertiary transition-colors">
                Account Settings
              </button>
              <button className="px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-tertiary transition-colors">
                Billing & Pro Plan
              </button>
              <div className="h-px bg-glass-border w-full" />
              <button className="px-4 py-3 text-left text-sm text-accent-red hover:bg-accent-red/10 transition-colors">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
