import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-bg-tertiary border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-accent-active focus:border-transparent transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export default Textarea;
