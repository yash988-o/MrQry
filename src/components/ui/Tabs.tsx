"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  fullWidth?: boolean;
}

export default function Tabs({ tabs, activeTab, onChange, className, fullWidth = false }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-2 border-b border-glass-border overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              isActive ? "text-accent-active" : "text-text-secondary hover:text-text-primary",
              fullWidth && "flex-1 text-center"
            )}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId={`tab-indicator-${tabs.map(t => t.id).join('-')}`} // unique layoutId context
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-active"
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
