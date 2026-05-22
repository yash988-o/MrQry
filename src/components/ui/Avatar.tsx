import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  colorClass?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, initials, src, size = "md", colorClass = "bg-accent-violet", ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center rounded-full overflow-hidden shrink-0 font-medium text-white border-2 border-bg-secondary",
          sizes[size],
          !src && colorClass,
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{initials.substring(0, 2).toUpperCase()}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export default Avatar;
