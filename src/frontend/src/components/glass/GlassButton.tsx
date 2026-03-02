import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gradient" | "glass" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  glow?: boolean;
}

export function GlassButton({
  children,
  className,
  variant = "gradient",
  size = "md",
  glow = false,
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        {
          "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]":
            variant === "gradient",
          "glass text-white hover:bg-white/10 hover:scale-[1.02]":
            variant === "glass",
          "border border-white/20 text-white/80 hover:bg-white/5 hover:text-white hover:scale-[1.02]":
            variant === "outline",
          "text-white/70 hover:text-white hover:bg-white/5":
            variant === "ghost",
        },
        {
          "px-3 py-1.5 text-xs gap-1.5": size === "sm",
          "px-5 py-2.5 text-sm gap-2": size === "md",
          "px-7 py-3 text-base gap-2.5": size === "lg",
          "w-9 h-9 p-0": size === "icon",
        },
        glow && "shadow-glow",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
