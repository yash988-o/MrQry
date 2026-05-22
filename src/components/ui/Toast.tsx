"use client";

import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "default" | "success" | "error" | "info";

interface ToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ title, description, type = "default", onClose }: ToastProps) {
  const icons = {
    default: null,
    success: <CheckCircle className="w-5 h-5 text-accent-green" />,
    error: <AlertCircle className="w-5 h-5 text-accent-red" />,
    info: <Info className="w-5 h-5 text-accent-active" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "bg-bg-secondary border border-glass-border shadow-shadow-card p-4 rounded-xl pointer-events-auto",
        "flex items-start gap-3 w-full backdrop-blur-md relative"
      )}
    >
      {icons[type] && <div className="mt-0.5 flex-shrink-0">{icons[type]}</div>}
      <div className="flex-1 pr-6">
        <h4 className="text-text-primary font-medium text-sm">{title}</h4>
        {description && <p className="text-text-secondary text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
