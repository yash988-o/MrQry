"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, BrainCircuit, Play, Trash2 } from "lucide-react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { useTimer } from "@/providers/TimerProvider";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { startSession } = useTimer();

  const handleStartTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    startSession(task.title, task.estimatedMinutes || 25, 5, "plant");
  };

  const priorityColors = {
    high: "danger",
    medium: "warning",
    low: "default",
    core: "core"
  } as const;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex items-center justify-between p-4 bg-bg-secondary border border-glass-border rounded-xl transition-all hover:border-accent-active",
        task.completed && "opacity-60 grayscale hover:grayscale-0"
      )}
    >
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-colors",
            task.completed 
              ? "bg-accent-active border-accent-active text-white" 
              : "border-glass-border hover:border-accent-active text-transparent hover:text-accent-active/50"
          )}
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 stroke-current stroke-2">
            <polyline points="2.5 7 6 10.5 11.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-sm font-medium text-text-primary truncate transition-all",
            task.completed && "line-through text-text-muted"
          )}>
            {task.title}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="group/tooltip relative flex items-center">
              <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-bg-primary border border-glass-border shadow-shadow-glow-violet text-text-primary text-xs font-medium rounded-lg px-3 py-2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50">
                {task.priority === "high" && "High Priority: Complete immediately to stay on track."}
                {task.priority === "medium" && "Medium Priority: Should be completed soon."}
                {task.priority === "low" && "Low Priority: Complete when you have extra time."}
                {task.priority === "core" && "Core Task: Fundamental to your long-term goals."}
              </div>
            </div>
            {task.estimatedMinutes && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                <span>{task.estimatedMinutes}m</span>
              </div>
            )}
            {task.addedToSpacedRep && (
              <div className="flex items-center gap-1 text-xs text-accent-violet">
                <BrainCircuit className="w-3 h-3" />
                <span>In SR</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
          <button 
            onClick={handleStartTimer}
            className="p-1.5 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-green hover:bg-accent-green/10 transition-colors"
            title="Start Timer"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1.5 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
