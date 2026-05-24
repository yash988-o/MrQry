"use client";

import { useState } from "react";
import { useTimer } from "@/providers/TimerProvider";
import { GrowthCompanion } from "@/types";
import { Play, Sprout, Ghost, Globe, Building2, Clock, Coffee } from "lucide-react";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

export default function TimerSetup() {
  const { startSession } = useTimer();
  
  const [topic, setTopic] = useState("");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [numBreaks, setNumBreaks] = useState(3);
  const [companion, setCompanion] = useState<GrowthCompanion>("plant");

  const companions: { type: GrowthCompanion; icon: any; label: string; color: string }[] = [
    { type: "plant", icon: Sprout, label: "Zen Bonsai", color: "text-accent-green" },
    { type: "character", icon: Ghost, label: "Focus Spirit", color: "text-accent-violet" },
    { type: "planet", icon: Globe, label: "New World", color: "text-accent-blue" },
    { type: "building", icon: Building2, label: "Monolith", color: "text-text-primary" },
  ];

  const handleStart = () => {
    startSession(topic || "Deep Focus", focusMinutes, breakMinutes, companion, numBreaks);
  };

  return (
    <Card glass className="w-full max-w-2xl p-8 border-glass-border">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Configure Session</h2>
      
      <div className="space-y-8">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            What are you focusing on?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Study Neuroscience Ch. 4"
            className="w-full bg-bg-tertiary border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-active transition-colors"
          />
        </div>

        {/* Durations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Clock className="w-4 h-4 text-accent-violet" />
                Focus Duration
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="120"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(Number(e.target.value))}
                className="w-full bg-bg-tertiary border border-glass-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-violet transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">min</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Coffee className="w-4 h-4 text-accent-green" />
                Break {numBreaks > 0 && <span className="text-accent-green">({numBreaks} times)</span>}
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
                className="w-full bg-bg-tertiary border border-glass-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-green transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">min</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Clock className="w-4 h-4 text-accent-blue" />
                Number of Breaks
              </label>
            </div>
            <input
              type="number"
              min="0"
              max="15"
              value={numBreaks}
              onChange={(e) => setNumBreaks(Number(e.target.value))}
              className="w-full bg-bg-tertiary border border-glass-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Companion */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Select Growth Companion
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {companions.map((c) => {
              const Icon = c.icon;
              const isSelected = companion === c.type;
              return (
                <button
                  key={c.type}
                  onClick={() => setCompanion(c.type)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                    isSelected 
                      ? "border-accent-active bg-accent-active/10 shadow-shadow-glow-violet" 
                      : "border-glass-border bg-bg-tertiary hover:bg-glass-surface"
                  }`}
                >
                  <Icon className={`w-8 h-8 ${c.color}`} />
                  <span className={`text-xs font-medium ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-glass-border">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 bg-text-primary text-bg-primary py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors"
          >
            <Play className="w-5 h-5 fill-current" />
            Engage Focus
          </motion.button>
        </div>
      </div>
    </Card>
  );
}
