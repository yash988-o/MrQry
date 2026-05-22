"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, X, Maximize2, Minimize2, GripHorizontal } from "lucide-react";
import { useTimer } from "@/providers/TimerProvider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function FloatingTimer() {
  const { session, pauseSession, resumeSession, endSession, isTimerOpen, setIsTimerOpen } = useTimer();
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Do not show the floating widget if the user is on the dedicated Timer page
  if (pathname === "/dashboard/timer") return null;
  if (!isTimerOpen && !session) return null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate remaining time
  const remainingSeconds = session ? Math.max(0, session.durationMinutes * 60 - session.elapsedSeconds) : 0;
  
  // The plant grows as time increases
  const growthStage = session ? Math.min(Math.floor(session.elapsedSeconds / 60), 5) : 0;
  const plantIcons = ["🌱", "🌿", "🪴", "🌳", "🍎", "✨"];
  
  return (
    <AnimatePresence>
      {(isTimerOpen || session) && (
        <motion.div
          drag
          dragMomentum={false}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={cn(
            "fixed bottom-6 right-6 z-40 bg-bg-secondary border border-glass-border shadow-shadow-card rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing",
            isExpanded ? "w-80" : "w-auto"
          )}
        >
          <div className="flex items-center justify-between p-3 border-b border-glass-border bg-bg-tertiary">
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-text-muted cursor-grab hover:text-text-primary" />
              <span className="text-xl">{plantIcons[growthStage]}</span>
              <span className="text-sm font-medium text-text-primary">
                {session ? session.topic : "New Session"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-secondary"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => {
                  if (session) endSession();
                  else setIsTimerOpen(false);
                }}
                className="p-1 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={cn("p-4 flex flex-col items-center", isExpanded ? "gap-6" : "gap-4")}>
            <div className={cn("font-display font-bold text-text-primary tracking-tight", isExpanded ? "text-6xl" : "text-4xl")}>
              {session ? formatTime(remainingSeconds) : "00:00"}
            </div>

            <div className="flex items-center gap-3">
              {session && !session.isPaused ? (
                <button
                  onClick={pauseSession}
                  className="w-12 h-12 rounded-full bg-accent-amber/20 text-accent-amber flex items-center justify-center hover:bg-accent-amber/30 transition-colors"
                >
                  <Pause className="w-6 h-6 fill-current" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (session) resumeSession();
                    else {
                      // We'd usually open a modal to set topic, for now just start
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center hover:bg-accent-green/30 transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" />
                </button>
              )}

              {session && (
                <button
                  onClick={endSession}
                  className="w-12 h-12 rounded-full bg-accent-red/20 text-accent-red flex items-center justify-center hover:bg-accent-red/30 transition-colors"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              )}
            </div>
            
            {isExpanded && session && (
              <div className="w-full text-center mt-2">
                <p className="text-xs text-text-muted">Target: {session.durationMinutes}m | Break: {session.breakIntervalMinutes}m</p>
                <div className="w-full h-1.5 bg-bg-tertiary rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-accent-green rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (session.elapsedSeconds / (session.durationMinutes * 60)) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
