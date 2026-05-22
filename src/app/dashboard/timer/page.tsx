"use client";

import { useTimer } from "@/providers/TimerProvider";
import TimerSetup from "@/components/dashboard/timer/TimerSetup";
import FullscreenTimer from "@/components/dashboard/timer/FullscreenTimer";
import { motion } from "framer-motion";

export default function TimerPage() {
  const { session } = useTimer();

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-hidden relative">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Focus Suite</h1>
        <p className="text-text-secondary mt-1">Deep space concentration zone.</p>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {session?.isActive ? (
          <FullscreenTimer />
        ) : (
          <TimerSetup />
        )}
      </div>
      
      {/* Deep Space Background Glow specifically for this page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
