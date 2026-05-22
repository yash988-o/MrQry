"use client";

import { useTimer } from "@/providers/TimerProvider";
import { Play, Pause, Square, Sprout, Ghost, Globe, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { GrowthCompanion } from "@/types";

export default function FullscreenTimer() {
  const { session, pauseSession, resumeSession, endSession } = useTimer();

  if (!session) return null;

  const totalSeconds = session.durationMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - session.elapsedSeconds);
  const progress = Math.min(1, session.elapsedSeconds / totalSeconds);
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const getCompanionIcon = (type: GrowthCompanion) => {
    switch (type) {
      case "plant": return <Sprout className="w-12 h-12 text-accent-green" />;
      case "character": return <Ghost className="w-12 h-12 text-accent-violet" />;
      case "planet": return <Globe className="w-12 h-12 text-accent-blue" />;
      case "building": return <Building2 className="w-12 h-12 text-text-primary" />;
    }
  };

  const circumference = 2 * Math.PI * 160; // r = 160
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full max-w-3xl mx-auto">
      
      {/* Topic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 text-center"
      >
        <span className="inline-block px-4 py-1 rounded-full border border-glass-border bg-bg-tertiary text-xs font-semibold text-accent-active uppercase tracking-widest mb-4">
          Active Session
        </span>
        <h2 className="text-3xl font-display font-bold text-text-primary">{session.topic}</h2>
      </motion.div>

      {/* Massive Timer Ring */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-[400px] h-[400px] flex items-center justify-center mt-12"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Background Ring */}
          <circle
            cx="200"
            cy="200"
            r="160"
            className="stroke-glass-border fill-transparent"
            strokeWidth="8"
          />
          {/* Progress Ring */}
          <circle
            cx="200"
            cy="200"
            r="160"
            className="stroke-accent-active fill-transparent transition-all duration-1000 ease-linear"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: "drop-shadow(0 0 12px rgba(124, 106, 247, 0.4))"
            }}
          />
        </svg>

        <div className="flex flex-col items-center justify-center z-10">
          <div className="mb-4">
            {getCompanionIcon(session.growthCompanion)}
          </div>
          <span className="font-mono text-7xl font-bold text-text-primary tracking-tighter">
            {formattedTime}
          </span>
          <span className="text-text-secondary mt-2 text-sm uppercase tracking-widest">
            {session.isPaused ? "Paused" : "Focusing"}
          </span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 flex items-center gap-6"
      >
        {session.isPaused ? (
          <button
            onClick={resumeSession}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-accent-active text-white hover:scale-105 transition-transform shadow-shadow-glow-violet"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </button>
        ) : (
          <button
            onClick={pauseSession}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-bg-tertiary border border-glass-border text-text-primary hover:bg-glass-surface transition-all"
          >
            <Pause className="w-8 h-8 fill-current" />
          </button>
        )}
        
        <button
          onClick={endSession}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-bg-tertiary border border-glass-border text-accent-red hover:bg-accent-red/10 transition-all"
        >
          <Square className="w-6 h-6 fill-current" />
        </button>
      </motion.div>

    </div>
  );
}
