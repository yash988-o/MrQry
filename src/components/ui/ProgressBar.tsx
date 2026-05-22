"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  colorClass?: string;
  heightClass?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  progress,
  className,
  colorClass = "bg-accent-active",
  heightClass = "h-2",
  showValue = false,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-bg-tertiary rounded-full overflow-hidden", heightClass)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 1, ease: "easeOut", type: "spring", bounce: 0 }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
      {showValue && (
        <div className="mt-1 flex justify-end">
          <span className="text-xs text-text-muted font-medium">{Math.round(clampedProgress)}%</span>
        </div>
      )}
    </div>
  );
}
