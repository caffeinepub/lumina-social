import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-1">
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-white/40 pointer-events-none z-10">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full glass rounded-xl py-3 text-sm text-white placeholder:text-white/30",
              "bg-white/5 border border-white/10 outline-none",
              "focus:border-primary/50 focus:bg-white/8 focus:shadow-glow-sm",
              "transition-all duration-200",
              icon ? "pl-10 pr-4" : "px-4",
              rightIcon ? "pr-10" : "",
              error && "border-destructive/60",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-white/40 z-10">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-destructive/80 pl-1">{error}</p>}
      </div>
    );
  },
);

GlassInput.displayName = "GlassInput";
