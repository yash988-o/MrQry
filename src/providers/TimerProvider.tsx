"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TimerSession, GrowthCompanion } from "@/types";

type TimerContextType = {
  session: TimerSession | null;
  startSession: (topic: string, durationMinutes: number, breakMinutes: number, companion: GrowthCompanion) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  isTimerOpen: boolean;
  setIsTimerOpen: (open: boolean) => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<TimerSession | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session && session.isActive && !session.isPaused) {
      interval = setInterval(() => {
        setSession((prev) => {
          if (!prev) return null;
          
          const newElapsed = prev.elapsedSeconds + 1;
          const totalSeconds = prev.durationMinutes * 60;
          
          if (newElapsed >= totalSeconds) {
            // Timer has finished
            clearInterval(interval);
            return {
              ...prev,
              elapsedSeconds: totalSeconds,
              isActive: false,
              endedAt: new Date().toISOString()
            };
          }
          
          return {
            ...prev,
            elapsedSeconds: newElapsed,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session?.isActive, session?.isPaused]);

  const startSession = (topic: string, durationMinutes: number, breakMinutes: number, companion: GrowthCompanion) => {
    setSession({
      id: Math.random().toString(36).substring(2, 9),
      topic,
      durationMinutes,
      breakIntervalMinutes: breakMinutes,
      growthCompanion: companion,
      idleGracePeriodSeconds: 300,
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      isActive: true,
      isPaused: false,
    });
    setIsTimerOpen(true);
  };

  const pauseSession = () => {
    setSession((prev) => prev ? { ...prev, isPaused: true } : null);
  };

  const resumeSession = () => {
    setSession((prev) => prev ? { ...prev, isPaused: false } : null);
  };

  const endSession = () => {
    setSession((prev) => prev ? { ...prev, isActive: false, endedAt: new Date().toISOString() } : null);
    // Usually we would save this session to history here, but we will just close it for now.
    setTimeout(() => {
      setSession(null);
      setIsTimerOpen(false);
    }, 1000); // short delay to show end state
  };

  return (
    <TimerContext.Provider
      value={{
        session,
        startSession,
        pauseSession,
        resumeSession,
        endSession,
        isTimerOpen,
        setIsTimerOpen,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
