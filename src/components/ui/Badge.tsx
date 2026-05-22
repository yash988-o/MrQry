import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "core";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-bg-tertiary text-text-secondary border border-glass-border",
      success: "bg-accent-green/10 text-accent-green border border-accent-green/20",
      warning: "bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
      danger: "bg-accent-red/10 text-accent-red border border-accent-red/20",
      core: "bg-accent-active/10 text-accent-active border border-accent-active/20",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export default Badge;
