"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Segment {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({ segments, selectedValue, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("flex items-center p-1 bg-bg-tertiary rounded-xl border border-glass-border w-max", className)}>
      {segments.map((segment) => {
        const isSelected = selectedValue === segment.value;
        return (
          <button
            key={segment.value}
            onClick={() => onChange(segment.value)}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors z-10",
              isSelected ? "text-white" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {segment.label}
            {isSelected && (
              <motion.div
                layoutId={`segment-indicator-${segments.map(s => s.value).join('-')}`}
                className="absolute inset-0 bg-bg-secondary border border-glass-border rounded-lg shadow-sm -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
